import { ipcRenderer } from 'electron';

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
import { READY } from './events/OutputEvent';
import AudioOutput from './outputs/AudioOutput';

export default class Renderer {
  _outputs = {};
  _inputs = {};
  _devices = {};
  _scripts = {};
  _timelines = {};
  _boards = {};
  _medias = {};
  _currentDevice = null;
  _currentScript = null;
  _currentTimeline = null;
  _currentBoard = null;
  _ticker = null;
  _currentTimelinePlaying = false;
  _providers = null;
  _renderDelay = (1 / 40) * 1000; // @TODO configurable?
  _frameTime = 0;
  _ioUpdateTimer = null;

  constructor() {
    this._providers = {
      getOutput: this._getOutput.bind(this),
      getScript: this._getScript.bind(this),
      getScripts: this._getScripts.bind(this),
      getDevice: this._getDevice.bind(this),
      getDevices: this._getDevices.bind(this),
      getTimeline: this._getTimeline.bind(this),
      getBoard: this._getBoard.bind(this),
      getMedia: this._getMedia.bind(this),
    }

    // process.on('SIGTERM', this._onSigTerm.bind(this));
    // process.on('message', this._onMessage.bind(this));

    ipcRenderer.on('message', (evt, data) => {
      console.log('ipcRenderer message', evt, data)
      this._onMessage(data)
    })

    this._ioUpdateTimer = setInterval(this._updateIOStatus.bind(this), 3000);

    this._send('ready');
  }

  // _onSigTerm() {
  //   this._destroy();
  //   process.exit();
  // }

  _destroy() {
    if (this._ioUpdateTimer) {
      clearInterval(this._ioUpdateTimer);
    }
    if (this._inputs) {
      Object.values(this._inputs).forEach((input) => input.destroy());
    }
    if (this._outputs) {
      Object.values(this._outputs).forEach((output) => output.destroy());
    }

    this._inputs = null;
    this._outputs = null;
  }

  _onMessage(message) {
    if ('updateOutputs' in message) {
      const { updateOutputs } = message;
      this._updateOutputs(updateOutputs);
    } else if ('updateInputs' in message) {
      const { updateInputs } = message;
      this._updateInputs(updateInputs);
    } else if ('updateDevices' in message) {
      const { updateDevices } = message;
      this._updateDevices(updateDevices);
    } else if ('updateScripts' in message) {
      const { updateScripts } = message;
      this._updateScripts(updateScripts);
    } else if ('updateMedias' in message) {
      const { updateMedias } = message;
      this._updateMedias(updateMedias);
    } else if ('updateTimelines' in message) {
      const { updateTimelines } = message;
      this._updateTimelines(updateTimelines);
    } else if ('updateBoards' in message) {
      const { updateBoards } = message;
      this._updateBoards(updateBoards);
    } else if ('runDevice' in message) {
      const { runDevice } = message;
      this._runDevice(runDevice);
    } else if ('runScript' in message) {
      const { runScript } = message;
      this._runScript(runScript);
    } else if ('runTimeline' in message) {
      const { runTimeline } = message;
      this._runTimeline(runTimeline);
    } else if ('runBoard' in message) {
      const { runBoard } = message;
      this._runBoard(runBoard);
    } else if ('updateTimelineInfo' in message) {
      const { updateTimelineInfo } = message;
      this._updateTimelineInfo(updateTimelineInfo);
    } else if ('updateBoardInfo' in message) {
      const { updateBoardInfo } = message;
      this._updateBoardInfo(updateBoardInfo);
    }
  }

  _updateOutputs(data) {
    this._outputs = hashComparator(
      data,
      this._outputs,
      (item) => {
        const output = new Output(item);
        output.on(READY, this._onOutputReady.bind(this, output));
        return output;
      },
      (output, item) => output.update(item),
      (output) => {
        output.removeAllListeners();
        output.destroy();
      }
    );
    // console.log('RENDERER _updateOutputs', this._outputs);

    this._updateIOStatus();
  }

  _updateInputs(data) {
    this._inputs = hashComparator(
      data,
      this._inputs,
      (item) => new Input(item, this._onInput.bind(this)),
      (input, item) => input.update(item),
      (input) => input.destroy()
    );
    // console.log('RENDERER _updateInputs', this._inputs);
  }

  _updateDevices(data) {
    this._devices = hashComparator(
      data,
      this._devices,
      (item) => {
        if (item.type === IO_DMX) {
          return new DmxDevice(this._providers, item);
        } else if (item.type === IO_ILDA) {
          return new IldaDevice(this._providers, item);
        } else if (item.type === IO_MIDI) {
          return new MidiDevice(this._providers, item);
        }
        throw new Error(`Unknown device type "${item.type}"`);
      },
      (device, item) => device.update(item),
      (device) => device.destroy()
    );
    // console.log('RENDERER _updateDevices', this._devices);
  }

  _updateScripts(data) {
    this._scripts = hashComparator(
      data,
      this._scripts,
      (item) => {
        const script = new Script(item);
        script.on('load_error', this._onScriptError.bind(this))
        return script;
      },
      (script, item) => script.update(item),
      (script) => {
        script.removeAllListeners();
        script.destroy();
      }
    );
    // console.log('RENDERER _updateScripts', this._scripts);
  }

  _updateTimelines(data) {
    this._timelines = hashComparator(
      data,
      this._timelines,
      (item) => new Timeline(item),
      (timeline, item) => timeline.update(item),
      (timeline) => timeline.destroy()
    );
    // console.log('RENDERER _updateTimelines', this._timelines);
  }

  _updateBoards(data) {
    this._boards = hashComparator(
      data,
      this._boards,
      (item) => new Board(item),
      (board, item) => board.update(item),
      (board) => board.destroy()
    );
    // console.log('RENDERER _updateBoards', this._boards);
  }

  _updateMedias(data) {
    this._medias = hashComparator(
      data,
      this._medias,
      (item) => new Media(this._providers, item),
      (media, item) => media.update(item),
      (media) => media.destroy()
    );
    // console.log('RENDERER _updateMedias', this._medias);

    this._notifyMediasToOutputs();
  }

  _onOutputReady(output) {
    if (output.outputInstance instanceof AudioOutput) {
      this._notifyMediasToOutputs();
    }
  }

  _notifyMediasToOutputs() {
    const outputsMedias = Object.values(this._medias).reduce((data, media) => {
      // Guard
      if (!media.output) {
        return data;
      }
      return {
        ...data,
        [media.output.id]: {
          ...data[media.output.id],
          [media.id]: media.file,
        }
      }
    }, {});

    Object.entries(outputsMedias).forEach(([outputId, media]) => {
      const output = this._getOutput(outputId);
      if (output) {
        output.outputInstance.send({ media });
      }
    });
  }

  _getOutput(outputId) {
    return this._outputs[outputId];
  }

  _getScript(scriptId) {
    return this._scripts[scriptId];
  }

  _getScripts(scriptsList) {
    return scriptsList.map((id) => {
      return this._getScript(id);
    });
  }

  _getTimeline(timelineId) {
    return this._timelines[timelineId];
  }

  _getBoard(boardId) {
    return this._boards[boardId];
  }

  _getDevice(deviceId) {
    const device = this._devices[deviceId];
    if (device.type === IO_DMX) {
      return new DmxDeviceProxy(device);
    } else if (device.type === IO_ILDA) {
      return new IldaDeviceProxy(device);
    } else if (device.type === IO_MIDI) {
      return new MidiDeviceProxy(device);
    }
    return null;
  }

  _getDevices(devicesList) {
    return devicesList.map((id) => {
      return this._getDevice(id);
    });
  }

  _getMedia(mediaId) {
    const media = this._medias[mediaId];
    if (media) {
      return new MediaProxy(media);
    }
    return null;
  }

  _runDevice(id) {
    if (id === null || (this._currentDevice && this._currentDevice.device.id !== id)) {
      if (this._currentDevice) {
        this._currentDevice.destroy();
        this._currentDevice = null;
      }
    }

    if (id !== null) {
      const renderer = new RootDeviceRenderer(this._providers, id);
      this._currentDevice = renderer;
    }

    this._updateTicker();

    console.log('RENDERER _runDevice', id);
  }

  _runScript(id) {
    if (id === null || (this._currentScript && this._currentScript.script.id !== id)) {
      if (this._currentScript) {
        this._currentScript.removeAllListeners();
        this._currentScript.destroy();
        this._currentScript = null;
      }
    }

    this._resetAll();

    if (id !== null) {
      const renderer = new RootScriptRenderer(this._providers, id);
      renderer.on('script_error', this._onScriptError.bind(this))
      renderer.on('script_log', this._onScriptLog.bind(this))
      this._currentScript = renderer;
    }

    this._updateTicker();

    console.log('RENDERER _runScript', id);
  }

  _runTimeline(id) {
    if (id === null || (this._currentTimeline && this._currentTimeline.id !== id)) {
      if (this._currentTimeline) {
        this._currentTimeline.removeAllListeners();
        this._currentTimeline.destroy();
        this._currentTimeline = null;
      }
      this._currentTimelinePlaying = false;
    }

    this._resetAll();
    this._outputAll();

    if (id !== null) {
      const renderer = new RootTimelineRenderer(this._providers, id, this._onTimelineEnded.bind(this));
      renderer.on('end', this._onTimelineEnded.bind(this));
      renderer.on('script_error', this._onScriptError.bind(this))
      renderer.on('script_log', this._onScriptLog.bind(this))
      this._currentTimeline = renderer;
    }

    this._updateTicker();

    console.log('RENDERER _runTimeline', id);
  }

  _runBoard(id) {
    if (id === null || (this._currentBoard && this._currentBoard.id !== id)) {
      if (this._currentBoard) {
        this._currentBoard.removeAllListeners();
        this._currentBoard.destroy();
        this._currentBoard = null;
      }
    }

    this._resetAll();
    this._outputAll();

    if (id !== null) {
      const renderer = new RootBoardRenderer(this._providers, id);
      renderer.on('script_error', this._onScriptError.bind(this))
      renderer.on('script_log', this._onScriptLog.bind(this))
      this._currentBoard = renderer;
    }

    this._updateTicker();

    console.log('RENDERER _runBoard', id);
  }

  _onScriptError(info) {
    this._send({ scriptError: info });
  }

  _onScriptLog(log) {
    this._send({ scriptLog: log });
  }

  _updateTicker() {
    if (this._currentDevice || this._currentScript || this._currentTimeline || this._currentBoard) {
      if (!this._ticker) {
        console.log('RENDERER _updateTicker create');

        this._frameTime = 0;
        this._ticker = new Ticker(this._tickHandler.bind(this));
        this._ticker.start();
      }
    } else {
      if (this._ticker) {
        console.log('RENDERER _updateTicker destroy');

        this._ticker.destroy();
        this._ticker = null;
      }
    }
  }

  _onTimelineEnded() {
    this._updateTimelinePlaybackStatus(false);
    this._send({
      timelineInfo: {
        playing: false,
        position: this._currentTimeline.currentTime,
      },
    });
  }

  _updateTimelineInfo(data) {
    console.log('RENDERER _updateTimelineInfo', data);

    if (this._currentTimeline) {
      const { playing, position } = data;
      if (typeof playing !== 'undefined') {
        this._updateTimelinePlaybackStatus(playing);
      }
      if (typeof position !== 'undefined') {
        this._resetDevices();
        this._currentTimeline.setPosition(position);
      }
      this._send({
        timelineInfo: data,
      });
    }
  }

  _updateTimelinePlaybackStatus(playing) {
    console.log('RENDERER _updateTimelinePlaybackStatus', playing);

    if (playing && !this._currentTimelinePlaying) {
      this._currentTimeline.notifyPlay();
      this._currentTimelinePlaying = true;
    } else if (!playing && this._currentTimelinePlaying) {
      this._currentTimelinePlaying = false;
      this._currentTimeline.notifyStop();

      this._outputAll();
    }
  }

  _updateBoardInfo(data) {
    console.log('Renderer._updateBoardInfo', data);

    if (this._currentBoard) {
      const { activeItems } = data;
      if (typeof activeItems !== 'undefined') {
        this._currentBoard.setActiveItems(activeItems);
      }
      this._send({
        boardInfo: data
      });
    }
  }

  _updateIOStatus() {
    const ioStatus = {
      ...Object.values(this._inputs).reduce((obj, input) => {
        obj[input.id] = input.inputInstance.refreshAndGetStatus();
        return obj;
      }, {}),
      ...Object.values(this._outputs).reduce((obj, output) => {
        obj[output.id] = output.outputInstance.refreshAndGetStatus();
        return obj;
      }, {}),
    }

    this._send({
      ioStatus,
    });
  }

  _send(data) {

    // process.send(data);
  }

  _tickHandler(delta, initial = false) {
    if (this._currentScript) {
      this._currentScript.tick(delta);
    }
    if (this._currentTimeline && this._currentTimelinePlaying) {
      this._currentTimeline.tick(delta);
    }
    if (this._currentBoard) {
      this._currentBoard.tick(delta);
    }

    if (this._frameTime >= this._renderDelay || initial) {
      const diff = this._frameTime - this._renderDelay;
      this._tickerFrame(diff);
      this._frameTime = 0;
    }

    this._frameTime += delta;
  }

  _tickerFrame(delta) {
    this._resetDevices();
    this._resetMedias();

    if (this._currentScript) {
      this._currentScript.frame(delta);
    }
    if (this._currentTimeline && this._currentTimelinePlaying) {
      this._currentTimeline.frame(delta);
      this._send({
        timelineInfo: {
          position: this._currentTimeline.currentTime,
          playing: this._currentTimelinePlaying,
        },
      });
    }
    if (this._currentBoard) {
      this._currentBoard.frame(delta);
      this._send({
        boardInfo: {
          activeItems: this._currentBoard.activeItems,
          itemsStatus: this._currentBoard.itemsStatus,
        },
      });
    }
    if (this._currentDevice) {
      this._currentDevice.frame(delta);
    }

    this._outputAll();
  }

  _onInput(type, data) {
    if (this._currentScript) {
      this._currentScript.input(type, data);
    }
    if (this._currentTimeline && this._currentTimelinePlaying) {
      this._currentTimeline.input(type, data);
    }
    if (this._currentBoard) {
      this._currentBoard.input(type, data);
    }
  }

  _resetAll() {
    this._resetDevices();
    this._resetMedias();
  }

  _resetDevices() {
    Object.values(this._devices).forEach((device) => device.reset());
  }

  _resetMedias() {
    Object.values(this._medias).forEach((media) => media.reset());
  }

  _outputAll() {
    Object.values(this._devices).forEach((device) => device.sendDataToOutput());
    Object.values(this._medias).forEach((media) => media.sendDataToOutput());

    Object.values(this._outputs).forEach((output) => output.flush());
  }
}
