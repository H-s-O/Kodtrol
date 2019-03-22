import Ticker from './lib/Ticker';
import ScriptRenderer from './rendering/renderers/ScriptRenderer';
import TimelineRenderer from './rendering/renderers/TimelineRenderer';
import BoardRenderer from './rendering/renderers/BoardRenderer';
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
    
    process.on('exit', this.onExit);
    process.on('message', this.onMessage);
  }
  
  onExit = () => {
    this.destroy();
  }
  
  destroy = () => {
    Object.values(this.inputs).forEach((input) => input.destroy());
    Object.values(this.outputs).forEach((output) => output.destroy());
    
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
    
    // temp patch so that audio tracks may continue working
    if (!('audio' in this.outputs)) {
      const audioOutput = new Output({
        id: 'audio',
        type: 'audio',
      });
      this.outputs.audio = audioOutput;
    }
    
    // console.log('RENDERER updateOutputs', this.outputs);
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
    
    // temp patch to simulate future medias
    const medias = Object.values(this.timelines).reduce((arr, timeline) => {
      const medias = timeline.items.filter(({file}) => !!file);
      return [
        ...arr,
        ...medias,
      ]
    }, []);
    this.updateMedias(medias);
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
      const renderer = new ScriptRenderer(this.providers, id);
      
      this.currentScript = renderer;
      this.updateTicker(renderer.script.tempo);
    } else {
      this.updateTicker();
    }
    
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
      const renderer = new TimelineRenderer(this.providers, id);
      
      this.currentTimeline = renderer;
      this.updateTicker(renderer.timeline.tempo, false);
    } else {
      this.updateTicker(null, false);
    }
    
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
      const renderer = new BoardRenderer(this.providers, id);
      
      this.currentBoard = renderer;
      this.updateTicker(renderer.board.tempo);
    } else {
      this.updateTicker(null, false);
    }
    
    console.log('RENDERER runBoard', id);
  }
  
  updateTicker = (tempo = null, start = true) => {
    console.log('===tempo', tempo);
    if (this.ticker) {
      this.ticker.destroy();
      this.ticker = null;
    }
    
    if (this.currentScript || this.currentTimeline || this.currentBoard) {
      if (!this.ticker) {
        this.ticker = new Ticker(this.tickerFrame, this.tickerBeat, tempo || 120);
        if (start) {
          this.ticker.start();
        }
      }
    }
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
  
  tickerFrame = (delta) => {
    this.resetDevices();
    
    if (this.currentScript) {
      this.currentScript.render(delta);
    }
    if (this.currentTimeline) {
      this.currentTimeline.render(delta);
      this.send({
        timelineInfo: {
          position: this.currentTimeline.currentTime,
          playing: this.playing,
        },
      });
    }
    if (this.currentBoard) {
      this.currentBoard.render(delta);
      this.send({
        boardInfo: {
          activeItems: this.currentBoard.activeItems,
        },
      });
    }
    
    this.outputAll();
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
  
  tickerBeat = (beat, delta) => {
    if (this.currentScript) {
      this.currentScript.beat(beat, delta);
    }
    if (this.currentTimeline) {
      this.currentTimeline.beat(beat, delta);
    }
    if (this.currentBoard) {
      this.currentBoard.beat(beat, delta);
    }
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
}
