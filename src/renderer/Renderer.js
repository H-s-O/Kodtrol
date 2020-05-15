import Ticker from './lib/Ticker';
import RootDeviceRenderer from './rendering/renderers/root/RootDeviceRenderer';
import RootScriptRenderer from './rendering/renderers/root/RootScriptRenderer';
import RootTimelineRenderer from './rendering/renderers/root/RootTimelineRenderer';
import RootBoardRenderer from './rendering/renderers/root/RootBoardRenderer';
import Media from './rendering/Media';
import MediaProxy from './rendering/MediaProxy';
import Script from './rendering/Script';
import Timeline from './rendering/Timeline';
import Board from './rendering/Board';
import Output from './rendering/Output';
import Input from './rendering/Input';
import hashComparator from '../common/js/lib/hashComparator';
import DmxDevice from './rendering/DmxDevice';
import IldaDevice from './rendering/IldaDevice';
import DmxDeviceProxy from './rendering/DmxDeviceProxy';
import IldaDeviceProxy from './rendering/IldaDeviceProxy';
import MidiDevice from './rendering/MidiDevice';
import MidiDeviceProxy from './rendering/MidiDeviceProxy';
import { IO_DMX, IO_ILDA, IO_MIDI } from '../common/js/constants/io';
import customLog from '../common/js/lib/customLog';

export default class Renderer {
  outputs = {};
  inputs = {};
  devices = {};
  scripts = {};
  timelines = {};
  boards = {};
  medias = {};
  currentDevice = null;
  currentScript = null;
  currentTimeline = null;
  currentBoard = null;
  ticker = null;
  playing = false;
  providers = null;
  renderDelay = (1 / 40) * 1000; // @TODO configurable?
  frameTime = 0;
  _ioUpdateTimer = null;

  constructor() {
    customLog('renderer');

    this.providers = {
      getOutput: this.getOutput.bind(this),
      getScript: this.getScript.bind(this),
      getScripts: this.getScripts.bind(this),
      getDevice: this.getDevice.bind(this),
      getDevices: this.getDevices.bind(this),
      getTimeline: this.getTimeline.bind(this),
      getBoard: this.getBoard.bind(this),
      getMedia: this.getMedia.bind(this),
    }

    process.on('SIGTERM', this._onSigTerm.bind(this));
    process.on('message', this._onMessage.bind(this));

    this._ioUpdateTimer = setInterval(this.updateIOStatus.bind(this), 3000);

    this.send('ready');
  }

  _onSigTerm() {
    this.destroy();
    process.exit();
  }

  destroy() {
    if (this._ioUpdateTimer) {
      clearInterval(this._ioUpdateTimer);
    }
    if (this.inputs) {
      Object.values(this.inputs).forEach((input) => input.destroy());
    }
    if (this.outputs) {
      Object.values(this.outputs).forEach((output) => output.destroy());
    }

    this.inputs = null;
    this.outputs = null;
  }

  _onMessage(message) {
    if ('updateOutputs' in message) {
      const { updateOutputs } = message;
      this.updateOutputs(updateOutputs);
    } else if ('updateInputs' in message) {
      const { updateInputs } = message;
      this.updateInputs(updateInputs);
    } else if ('updateDevices' in message) {
      const { updateDevices } = message;
      this.updateDevices(updateDevices);
    } else if ('updateScripts' in message) {
      const { updateScripts } = message;
      this.updateScripts(updateScripts);
    } else if ('updateMedias' in message) {
      const { updateMedias } = message;
      this.updateMedias(updateMedias);
    } else if ('updateTimelines' in message) {
      const { updateTimelines } = message;
      this.updateTimelines(updateTimelines);
    } else if ('updateBoards' in message) {
      const { updateBoards } = message;
      this.updateBoards(updateBoards);
    } else if ('runDevice' in message) {
      const { runDevice } = message;
      this.runDevice(runDevice);
    } else if ('runScript' in message) {
      const { runScript } = message;
      this.runScript(runScript);
    } else if ('runTimeline' in message) {
      const { runTimeline } = message;
      this.runTimeline(runTimeline);
    } else if ('runBoard' in message) {
      const { runBoard } = message;
      this.runBoard(runBoard);
    } else if ('updateTimelineInfo' in message) {
      const { updateTimelineInfo } = message;
      this.updateTimelineInfo(updateTimelineInfo);
    } else if ('updateBoardInfo' in message) {
      const { updateBoardInfo } = message;
      this.updateBoardInfo(updateBoardInfo);
    }
  }

  updateOutputs(data) {
    this.outputs = hashComparator(
      data,
      this.outputs,
      (item) => new Output(item),
      (output, item) => output.update(item),
      (output) => output.destroy()
    );
    // console.log('RENDERER updateOutputs', this.outputs);

    this.updateIOStatus();
  }

  updateInputs(data) {
    this.inputs = hashComparator(
      data,
      this.inputs,
      (item) => new Input(item, this.onInput.bind(this)),
      (input, item) => input.update(item),
      (input) => input.destroy()
    );
    // console.log('RENDERER updateInputs', this.inputs);
  }

  updateDevices(data) {
    this.devices = hashComparator(
      data,
      this.devices,
      (item) => {
        if (item.type === IO_DMX) {
          return new DmxDevice(this.providers, item);
        } else if (item.type === IO_ILDA) {
          return new IldaDevice(this.providers, item);
        } else if (item.type === IO_MIDI) {
          return new MidiDevice(this.providers, item);
        }
        throw new Error(`Unknown device type "${item.type}"`);
      },
      (device, item) => device.update(item),
      (device) => device.destroy()
    );
    // console.log('RENDERER updateDevices', this.devices);
  }

  updateScripts(data) {
    this.scripts = hashComparator(
      data,
      this.scripts,
      (item) => new Script(item),
      (script, item) => script.update(item),
      (script) => script.destroy()
    );
    // console.log('RENDERER updateScripts', this.scripts);
  }

  updateTimelines(data) {
    this.timelines = hashComparator(
      data,
      this.timelines,
      (item) => new Timeline(item),
      (timeline, item) => timeline.update(item),
      (timeline) => timeline.destroy()
    );
    // console.log('RENDERER updateTimelines', this.timelines);
  }

  updateBoards(data) {
    this.boards = hashComparator(
      data,
      this.boards,
      (item) => new Board(item),
      (board, item) => board.update(item),
      (board) => board.destroy()
    );
    // console.log('RENDERER updateBoards', this.boards);
  }

  updateMedias(data) {
    this.medias = hashComparator(
      data,
      this.medias,
      (item) => new Media(this.providers, item),
      (media, item) => media.update(item),
      (media) => media.destroy()
    );
    // console.log('RENDERER updateMedias', this.medias);
  }

  getOutput(outputId) {
    return this.outputs[outputId];
  }

  getScript(scriptId) {
    return this.scripts[scriptId];
  }

  getScripts(scriptsList) {
    return scriptsList.map((id) => {
      return this.getScript(id);
    });
  }

  getTimeline(timelineId) {
    return this.timelines[timelineId];
  }

  getBoard(boardId) {
    return this.boards[boardId];
  }

  getDevice(deviceId) {
    const device = this.devices[deviceId];
    if (device.type === IO_DMX) {
      return new DmxDeviceProxy(device);
    } else if (device.type === IO_ILDA) {
      return new IldaDeviceProxy(device);
    } else if (device.type === IO_MIDI) {
      return new MidiDeviceProxy(device);
    }
    return null;
  }

  getDevices(devicesList) {
    return devicesList.map((id) => {
      return this.getDevice(id);
    });
  }

  getMedia(mediaId) {
    const media = this.medias[mediaId];
    if (media) {
      return new MediaProxy(media);
    }
    return null;
  }

  runDevice(id) {
    if (id === null || (this.currentDevice && this.currentDevice.device.id !== id)) {
      if (this.currentDevice) {
        this.currentDevice.destroy();
        this.currentDevice = null;
      }
    }

    if (id !== null) {
      const renderer = new RootDeviceRenderer(this.providers, id);
      this.currentDevice = renderer;
    }

    this.updateTicker();

    console.log('RENDERER runDevice', id);
  }

  runScript(id) {
    if (id === null || (this.currentScript && this.currentScript.script.id !== id)) {
      if (this.currentScript) {
        this.currentScript.destroy();
        this.currentScript = null;
      }
    }

    this.resetAll();

    if (id !== null) {
      const renderer = new RootScriptRenderer(this.providers, id);
      this.currentScript = renderer;
    }

    this.updateTicker();

    console.log('RENDERER runScript', id);
  }

  runTimeline(id) {
    if (id === null || (this.currentTimeline && this.currentTimeline.id !== id)) {
      if (this.currentTimeline) {
        this.currentTimeline.destroy();
        this.currentTimeline = null;
      }
    }

    this.resetAll();

    if (id !== null) {
      const renderer = new RootTimelineRenderer(this.providers, id, this.onTimelineEnded.bind(this));
      this.currentTimeline = renderer;
    }

    this.updateTicker(false);

    console.log('RENDERER runTimeline', id);
  }

  runBoard(id) {
    if (id === null || (this.currentBoard && this.currentBoard.id !== id)) {
      if (this.currentBoard) {
        this.currentBoard.destroy();
        this.currentBoard = null;
      }
    }

    this.resetAll();

    if (id !== null) {
      const renderer = new RootBoardRenderer(this.providers, id);
      this.currentBoard = renderer;
    }

    this.updateTicker();

    console.log('RENDERER runBoard', id);
  }

  updateTicker(start = true) {
    if (this.ticker) {
      this.ticker.destroy();
      this.ticker = null;
    }

    this.frameTime = 0;

    if (this.currentDevice || this.currentScript || this.currentTimeline || this.currentBoard) {
      if (!this.ticker) {
        this.ticker = new Ticker(this.tickHandler.bind(this));
        if (start) {
          this.ticker.start();
        }
      }
    }
  }

  onTimelineEnded() {
    this.updateTimelinePlaybackStatus(false);
    this.send({
      'timelineInfo': {
        'playing': false,
        'position': this.currentTimeline.currentTime,
      },
    });
  }

  updateTimelineInfo(data) {
    console.log('Renderer.updateTimelineInfo', data);

    if (this.currentTimeline) {
      const { playing, position } = data;
      if (typeof playing !== 'undefined') {
        this.updateTimelinePlaybackStatus(playing);
      }
      if (typeof position !== 'undefined') {
        this.resetDevices();
        this.currentTimeline.setPosition(position);
      }
      this.send({
        'timelineInfo': data,
      });
    }
  }

  updateTimelinePlaybackStatus(playing) {
    if (playing && !this.ticker.running) {
      this.currentTimeline.notifyPlay();

      this.playing = true;
      this.ticker.start();
    } else if (!playing && this.ticker.running) {
      this.playing = false;
      this.ticker.stop();

      this.currentTimeline.notifyStop();
      this.outputAll();
    }
  }

  updateBoardInfo(data) {
    console.log('Renderer.updateBoardInfo', data);

    if (this.currentBoard) {
      const { activeItems } = data;
      if (typeof activeItems !== 'undefined') {
        this.currentBoard.setActiveItems(activeItems);
      }
      this.send({
        'boardInfo': data
      });
    }
  }

  updateIOStatus() {
    const ioStatus = {
      ...Object.values(this.inputs).reduce((obj, input) => {
        obj[input.id] = input.inputInstance.refreshAndGetStatus();
        return obj;
      }, {}),
      ...Object.values(this.outputs).reduce((obj, output) => {
        obj[output.id] = output.outputInstance.refreshAndGetStatus();
        return obj;
      }, {}),
    }
    // console.log('RENDERER updateIOStatus', ioStatus);
    this.send({
      ioStatus,
    });
  }

  send(data) {
    process.send(data);
  }

  tickHandler(delta, initial = false) {
    if (this.currentScript) {
      this.currentScript.tick(delta);
    }
    if (this.currentTimeline) {
      this.currentTimeline.tick(delta);
    }
    if (this.currentBoard) {
      this.currentBoard.tick(delta);
    }

    if (this.frameTime >= this.renderDelay || initial) {
      const diff = this.frameTime - this.renderDelay;
      this.tickerFrame(diff);
      this.frameTime = 0;
    }

    this.frameTime += delta;
  }

  tickerFrame(delta) {
    this.resetDevices();

    if (this.currentScript) {
      this.currentScript.frame(delta);
    }
    if (this.currentTimeline) {
      this.currentTimeline.frame(delta);
      this.send({
        timelineInfo: {
          position: this.currentTimeline.currentTime,
          playing: this.playing,
        },
      });
    }
    if (this.currentBoard) {
      this.currentBoard.frame(delta);
      this.send({
        boardInfo: {
          activeItems: this.currentBoard.activeItems,
          itemsStatus: this.currentBoard.itemsStatus,
        },
      });
    }
    if (this.currentDevice) {
      this.currentDevice.frame(delta);
    }

    this.outputAll();
  }

  onInput(type, data) {
    if (this.currentScript) {
      this.currentScript.input(type, data);
    }
    if (this.currentTimeline) {
      this.currentTimeline.input(type, data);
    }
    if (this.currentBoard) {
      this.currentBoard.input(type, data);
    }
  }

  resetAll() {
    this.resetDevices();
    this.resetMedias();
  }

  resetDevices() {
    Object.values(this.devices).forEach((device) => device.reset());
  }

  resetMedias() {
    Object.values(this.medias).forEach((media) => media.reset());
  }

  outputAll() {
    Object.values(this.devices).forEach((device) => device.sendDataToOutput());
    Object.values(this.medias).forEach((media) => media.sendDataToOutput());

    Object.values(this.outputs).forEach((output) => output.flush());
  }
}
