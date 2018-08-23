import EventEmitter from 'events';
import MidiClock from 'midi-clock';
import autoBind from 'auto-bind-inheritance';
import { get, flatten, uniq, pick } from 'lodash';
import Device from '../Device';
import TimelineRendererEvent from '../events/TimelineRendererEvent';

export default class TimelineRenderer extends EventEmitter {
  constructor(timelineData, outputs) {
    super();
    try { // @TODO fix warning
      autoBind(this);
    } catch (err) {}

    this._outputs = outputs;
    this._tempo = get(timelineData, 'tempo');
    this._duration = get(timelineData, 'duration');
    this._inTime = get(timelineData, 'inTime');
    this._outTime = get(timelineData, 'outTime');

    this._currentTime = 0;
    this._startTime = 0;
    this._position = 0;
    this._interval = null;
    this._playing = false;
    this._fps = 40;
    this._devices = null;
    this._scripts = null;
    this._baseData = null;
    this._dmx = null;

    this._clock = MidiClock();
    this._clock.setTempo(this._tempo);
    this._clock.on('position', this.triggerClock);

    // Transform timeline items data for simpler looping
    const timelineItems = flatten(get(timelineData, 'layers', []));
    this._blocks = timelineItems.filter((item) => 'script' in item);
    this._triggers = timelineItems.filter((item) => 'trigger' in item);

    // Create script instances
    this._scriptInstances = this._blocks.reduce((obj, { id, script }) => ({
      ...obj,
      [id]: {
        script,
        started: false,
        instance: null,
        devices: [],
        data: {},
      },
    }), {});

    // Create trigger instances
    this._triggerInstances = this._triggers.reduce((obj, { id, trigger }) => ({
      ...obj,
      [id]: {
        trigger,
        started: false,
      },
    }), {});
  }

  init() {
    for (let id in this._scriptInstances) {
      const scriptId = this._scriptInstances[id].script;
      this._scriptInstances[id].instance = new this._scripts[scriptId].scriptClass;
      this._scriptInstances[id].devices = Object.values(pick(this._devices, this._scripts[scriptId].scriptData.devices.map(({id}) => id)))
        .map((device) => new Device(
          device.name,
          device.groups,
          Number(device.startChannel),
          device.channels.length,
          device.channels
            // .filter(({alias}) => alias !== null) // @TODO fix
            .reduce((obj, channel, index) => ({
              ...obj,
              [channel.alias]: index + 1,
            }), {})
          // device.channels
          //   .reduce((obj, channel, index) => ({
          //     ...obj,
          //     [index]: Number(channel.defaultValue),
          //   }), {}),
        ));
    }

    this._baseData = this.computeBaseData(this._devices);
  }

  get playing() {
    return this._playing;
  }

  get scriptIds() {
    return uniq(Object.values(this._scriptInstances).map(({ script }) => script));
  }

  updateDevices(devices) {
    this._devices = devices;
  }

  updateScripts(scripts) {
    this._scripts = scripts;
  }

  start() {
    if (this._playing) return;

    this._startTime = Date.now();
    this._position = 0;

    this.render();

    this._interval = setInterval(this.render, (1 / this._fps) * 1000);
    this._clock.start();

    this._playing = true;
  }

  stop() {
    if (!this._playing) return;

    clearInterval(this._interval);
    this._clock.stop();

    this._playing = false;
  }

  setPosition(position) {
    this._position = position;
    this._startTime = Date.now();
    this.resetScriptInstances();
    this.resetTriggerInstances();
  }

  render() {
    this._currentTime = (Date.now() - this._startTime) + this._position;
    if (this._currentTime > this._outTime) {
      this.restartTimeline();
      this._currentTime = 0;
    }

    const triggerData = this._triggers
      .filter((trigger) => (
        this._currentTime >= trigger.inTime
        && this._currentTime <= trigger.inTime + 50
        && !this._triggerInstances[trigger.id].started)
      )
      .reduce((renderTriggerData, trigger) => {
        this._triggerInstances[trigger.id].started = true;

        return {
          ...renderTriggerData,
          [trigger.trigger]: true,
        };
      }, {});

    const renderData = this._blocks
      .filter((block) => (
        this._currentTime >= block.inTime
        && this._currentTime <= block.outTime)
      )
      .reduce((renderDataObj, block) => {
        // console.log('rendering ', this._currentTime, block.id, block.name);

        // Script start
        if (!this._scriptInstances[block.id].started) {
          try {
            if (typeof this._scriptInstances[block.id].instance.start === 'function') {
              const data = this._scriptInstances[block.id].instance.start(this._scriptInstances[block.id].devices, triggerData);
              this._scriptInstances[block.id].data = data || {};
            }
          }  catch (err) {
             console.error(err);
          }
          this._scriptInstances[block.id].started = true;
        }

        const blockInfo = {
          inTime: block.inTime,
          outTime: block.outTime,
          currentTime: this._currentTime,
          blockPercent: ((this._currentTime - block.inTime) / (block.outTime - block.inTime)),
        }

        // Script loop
        try {
          if (typeof this._scriptInstances[block.id].instance.loop === 'function') {
            const data = this._scriptInstances[block.id].instance.loop(this._scriptInstances[block.id].devices, this._scriptInstances[block.id].data, blockInfo, triggerData);
            this._scriptInstances[block.id].data = data || this._scriptInstances[block.id].data;
          }
        } catch (err) {
          console.error(err);
        }

        const renderOutput = {
          ...renderDataObj,
          ...this._scriptInstances[block.id].devices.reduce((obj, device) => ({
            ...obj,
            ...Object.entries(device.data).reduce((data, [channel, value]) => ({
              ...data,
              [Number(channel) + device.startingChannel]: value,
            }), {}),
          }), {}),
        };

        // this._scriptInstances[block.id].devices.forEach((device) => {
        //   device.resetChannels();
        // });

        return renderOutput;
      }, {});

    const allData = {
      ...this._baseData,
      ...renderData,
    };

    // console.log(this._baseData);
    // console.log(renderData);
    // console.log(allData);
    this._outputs.main.update('main', allData);

    this.emit(TimelineRendererEvent.UPDATE_POSITION, this._currentTime);
  }

  triggerClock(time) {
    const renderData = this._blocks
      .filter((block) => (this._currentTime >= block.inTime && this._currentTime <= block.outTime))
      .reduce((renderDataObj, block) => {
        // Script beat
        try {
          if (typeof this._scriptInstances[block.id].instance.beat === 'function') {
            const data = this._scriptInstances[block.id].instance.beat(this._scriptInstances[block.id].devices, time, this._scriptInstances[block.id].data);
            this._scriptInstances[block.id].data = data || this._scriptInstances[block.id].data;
          }
        } catch (err) {
          console.error(err);
        }

        return {
          ...renderDataObj,
          ...this._scriptInstances[block.id].devices.reduce((obj, device) => ({
            ...obj,
            ...Object.entries(device.data).reduce((data, [channel, value]) => ({
              ...data,
              [Number(channel) + device.startingChannel]: value,
            }), {}),
          }), {}),
        };
      }, {});

    const allData = {
      ...this._baseData,
      ...renderData,
    };

    // console.log(this._baseData);
    // console.log(renderData);
    // console.log(allData);
    this._outputs.main.update('main', allData);
  }

  restartTimeline() {
    this._startTime = Date.now();
    this._position = 0;
    this.resetScriptInstances();
    this.resetTriggerInstances();
  }

  resetScriptInstances() {
    for (let id in this._scriptInstances) {
      this._scriptInstances[id].started = false;
      this._scriptInstances[id].data = {};
      for (let device in this._scriptInstances[id].devices) {
        this._scriptInstances[id].devices[device].resetChannels();
      }
    }
  }

  resetTriggerInstances() {
    for (let id in this._triggerInstances) {
      this._triggerInstances[id].started = false;
    }
  }

  computeBaseData(allDevices) {
    return {
      ...Object.values(allDevices).reduce((obj, device) => ({
        ...obj,
        ...device.channels.reduce((obj2, channel, index) => {
          return {
            ...obj2,
            [Number(device.startChannel) + index]: channel.defaultValue,
          };
        }, {}),
      }), {}),
    };
  }

  destroy() {
    this.stop();

    for (let id in this._scriptInstances) {
      // if ('instance' in this._scriptInstances[id]) {
      //   this._scriptInstances[id].instance.destroy();
      // }
      delete this._scriptInstances[id];
    }
    for (let id in this._triggerInstances) {
      delete this._triggerInstances[id];
    }

    this._blocks = null;
    this._scriptInstances = null;
    this._triggerInstances = null;
  }
}