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

    // Transform layers and blocks data for simpler looping
    this._blocks = flatten(get(timelineData, 'layers', []));

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

  render() {
    this._currentTime = Date.now() - this._startTime;
    if (this._currentTime > this._outTime) {
      this.restartTimeline();
      this._currentTime = 0;
    }

    const renderData = this._blocks
      .filter((block) => (this._currentTime >= block.inTime && this._currentTime <= block.outTime))
      .reduce((renderDataObj, block) => {
        // console.log('rendering ', this._currentTime, block.id, block.name);

        // Script start
        if (!this._scriptInstances[block.id].started) {
          try {
            if (typeof this._scriptInstances[block.id].instance.start === 'function') {
              const data = this._scriptInstances[block.id].instance.start(this._scriptInstances[block.id].devices);
              this._scriptInstances[block.id].data = data || {};
            }
          }  catch (err) {
             console.error(err);
          }
          this._scriptInstances[block.id].started = true;
        }

        // Script loop
        try {
          if (typeof this._scriptInstances[block.id].instance.loop === 'function') {
            const data = this._scriptInstances[block.id].instance.loop(this._scriptInstances[block.id].devices, this._scriptInstances[block.id].data);
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

    for (let id in this._scriptInstances) {
      this._scriptInstances[id].started = false;
      this._scriptInstances[id].data = {};
      for (let device in this._scriptInstances[id].devices) {
        this._scriptInstances[id].devices[device].resetChannels();
      }
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

    this._blocks = null;
    this._scriptInstances = null;
  }
}
