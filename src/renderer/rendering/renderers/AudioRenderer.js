import uniqid from 'uniqid';

export default class AudioRenderer {
  _media = null;
  _providers = null;
  
  started = false;
  volume = 1;
  streamId = null;
  duration = 0;
  id = null;
  
  constructor(providers, sourceAudio) {
    this._providers = providers;
    
    const { id, volume, inTime, outTime } = sourceAudio;
    
    this.id = id;
    this.volume = Number(volume);
    this.duration = Number(outTime) - Number(inTime);
    
    this.setMedia(id);
  }
  
  setMedia = (mediaId) => {
    this._media = this._providers.getMedia(mediaId);
  }
  
  reset = () => {
    this.started = false;
    this.streamId = null;
  }
  
  render = (delta, blockInfo) => {
    const { audioPercent } = blockInfo;
    if (!this.started) {
      this.streamId = uniqid();
    }
    
    this.started = true;
    
    const position = audioPercent * this.duration;
    const volume = this.volume;
    
    this._media.setActive(true);
    this._media.setVolume(volume);
    this._media.setPosition(position);
    this._media.setStreamId(this.streamId); // hack
  }
  
  stop = () => {
    this.reset();
    this._media.stop();
  }
}