import Ticker from './lib/Ticker';
import RootScriptRenderer from './rendering/renderers/root/RootScriptRenderer';
import RootTimelineRenderer from './rendering/renderers/root/RootTimelineRenderer';
import RootBoardRenderer from './rendering/renderers/root/RootBoardRenderer';
import Media from './rendering/Media';
import MediaProxy from './rendering/MediaProxy';
import Device from './rendering/Device';
import DeviceProxy from './rendering/DeviceProxy';
import Script from './rendering/Script';
import Timeline from './rendering/Timeline';
import Board from './rendering/Board';
import Output from './rendering/Output';
import Input from './rendering/Input';
import hashComparator from '../common/js/lib/hashComparator';

export default class Renderer {
  outputs = {};
  inputs = {};
  devices = {};
  scripts = {};
  timelines = {};
  boards = {};
  medias = {};
  currentScript = null;
  currentTimeline = null;
  currentBoard = null;
  ticker = null;
  playing = false;
  providers = null;
  renderDelay = (1 / 40) * 1000; // @TODO configurable?
  frameTime = 0;
  
  constructor() {
    this.providers = {
      getOutput: this.getOutput,
      getScript: this.getScript,
      getScripts: this.getScripts,
      getDevices: this.getDevices,
      getTimeline: this.getTimeline,
      getBoard: this.getBoard,
      getMedia: this.getMedia,
    }
    
    process.on('SIGTERM', this.onSigTerm);
    process.on('message', this.onMessage);

    this.send('ready');
  }
  
  onSigTerm = () => {
    this.destroy();
    process.exit();
  }
  
  destroy = () => {
    if (this.inputs) {
      Object.values(this.inputs).forEach((input) => input.destroy());
    }
    if (this.outputs) {
      Object.values(this.outputs).forEach((output) => output.destroy());
    }
    
    this.inputs = null;
    this.outputs = null;
  }
  
  onMessage = (message) => {
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
    } else if ('previewScript' in message) {
      const { previewScript } = message;
      this.previewScript(previewScript);
    } else if ('runTimeline' in message) {
      const { runTimeline } = message;
      this.runTimeline(runTimeline);
    } else if ('runBoard' in message) {
      const { runBoard } = message;
      this.runBoard(runBoard);
    } else if ('timelineInfoUser' in message) {
      const { timelineInfoUser } = message;
      this.updateTimelineInfo(timelineInfoUser);
    } else if ('boardInfoUser' in message) {
      const { boardInfoUser } = message;
      this.updateBoardInfo(boardInfoUser);
    }
  }
  
  updateOutputs = (data) => {
    this.outputs = hashComparator(
      data,
      this.outputs,
      (item) => new Output(item),
      (output, item) => output.update(item),
      (output) => output.destroy()
    );
    // console.log('RENDERER updateOutputs', this.outputs);

    // temp test
    if (Object.keys(this.outputs).length) {
      this.send({
        ioStatus: {
          [this.outputs[Object.keys(this.outputs)[0]].id]: 'activity', 
        },
      });
    }
  }
  
  updateInputs = (data) => {
    this.inputs = hashComparator(
      data,
      this.inputs,
      (item) => new Input(item, this.onInput),
      (input, item) => input.update(item),
      (input) => input.destroy()
    );
    // console.log('RENDERER updateInputs', this.inputs);
  }
  
  updateDevices = (data) => {
    this.devices = hashComparator(
      data,
      this.devices,
      (item) => new Device(this.providers, item),
      (device, item) => device.update(item),
      (device) => device.destroy()
    );
  }
  
  updateScripts = (data) => {
    this.scripts = hashComparator(
      data,
      this.scripts,
      (item) => new Script(item),
      (script, item) => script.update(item),
      (script) => script.destroy()
    );
    // console.log('RENDERER updateScripts', this.scripts);
  }
  
  updateTimelines = (data) => {
    this.timelines = hashComparator(
      data,
      this.timelines,
      (item) => new Timeline(item),
      (timeline, item) => timeline.update(item),
      (timeline) => timeline.destroy()
    );
    // console.log('RENDERER updateTimelines', this.timelines);
  }
  
  updateBoards = (data) => {
    this.boards = hashComparator(
      data,
      this.boards,
      (item) => new Board(item),
      (board, item) => board.update(item),
      (board) => board.destroy()
    );
    // console.log('RENDERER updateBoards', this.boards);
  }
  
  updateMedias = (data) => {
    this.medias = hashComparator(
      data,
      this.medias,
      (item) => new Media(this.providers, item),
      (media, item) => media.update(item),
      (media) => media.destroy()
    );
    // console.log('RENDERER updateMedias', this.medias);
  }
  
  getOutput = (outputId) => {
    return this.outputs[outputId];
  }
  
  getScript = (scriptId) => {
    return this.scripts[scriptId];
  }
  
  getScripts = (scriptsList) => {
    return scriptsList.map((id) => {
      return this.scripts[id];
    });
  }
  
  getTimeline = (timelineId) => {
    return this.timelines[timelineId];
  }
  
  getBoard = (boardId) => {
    return this.boards[boardId];
  }
  
  getDevices = (devicesList) => {
    return devicesList.map((id) => {
      return new DeviceProxy(this.devices[id]);
    });
  }
  
  getMedia = (mediaId) => {
    return new MediaProxy(this.medias[mediaId]);
  }
  
  previewScript = (id) => {
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
    
    console.log('RENDERER previewScript', id);
  }
  
  runTimeline = (id) => {
    if (id === null || (this.currentTimeline && this.currentTimeline.id !== id)) {
      if (this.currentTimeline) {
        this.currentTimeline.destroy();
        this.currentTimeline = null;
      }
    }
    
    this.resetAll();
    
    if (id !== null) {
      const renderer = new RootTimelineRenderer(this.providers, id, this.onTimelineEnded);
      this.currentTimeline = renderer;
    }

    this.updateTicker(false);
    
    console.log('RENDERER runTimeline', id);
  }
  
  runBoard = (id) => {
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
  
  updateTicker = (start = true) => {
    if (this.ticker) {
      this.ticker.destroy();
      this.ticker = null;
    }

    this.frameTime = 0;
    
    if (this.currentScript || this.currentTimeline || this.currentBoard) {
      if (!this.ticker) {
        this.ticker = new Ticker(this.tickHandler);
        if (start) {
          this.ticker.start();
        }
      }
    }
  }

  onTimelineEnded = () => {
    this.updateTimelinePlaybackStatus(false);
    this.send({
      'timelineInfo': {
        'playing': false,
        'position': this.currentTimeline.currentTime,
      },
    });
  }
  
  updateTimelineInfo = (data) => {
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
  
  updateTimelinePlaybackStatus = (playing) => {
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
  
  updateBoardInfo = (data) => {
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
  
  send = (data) => {
    process.send(data);
  }

  tickHandler = (delta, initial = false) => {
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
  
  tickerFrame = (delta) => {
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
        },
      });
    }
    
    this.outputAll();
  }
  
  onInput = (type, data) => {
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
  
  resetAll = () => {
    this.resetDevices();
    this.resetMedias();
  }
  
  resetDevices = () => {
    Object.values(this.devices).forEach((device) => device.resetChannels());
  }
  
  resetMedias = () => {
    Object.values(this.medias).forEach((media) => media.resetOutputData());
  }
  
  outputAll = () => {
    Object.values(this.devices).forEach((device) => device.sendDataToOutput());
    Object.values(this.medias).forEach((media) => media.sendDataToOutput());
    
    Object.values(this.outputs).forEach((output) => output.flush());
  }
}
