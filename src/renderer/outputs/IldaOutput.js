import { DAC } from '@laser-dac/core';
import { Scene, Rect } from '@laser-dac/draw';
import { EtherDream } from '@laser-dac/ether-dream';

export default class IldaOutput {
  output = null;
  scene = null;

  constructor(driver, address) {
    this.output = new DAC();
    switch (driver) {
      case 'ether-dream':
        this.output.use(new EtherDream())
        break;
      default:
        throw new Error(`Unknown ILDA driver "${driver}"`);
        break;
    }
    this.output.start().then(this.onOutputStarted);
  }

  onOutputStarted = (started) => {
    console.log('ILDA output', started)
    if (started) {
      this.scene = new Scene();
      this.output.stream(this.scene, 20000) // @TODO
    }
  }

  send = (data) => {
    if (this.scene) {
      this.scene.reset();

      let hasObject = false;
      for (const deviceId in data) {
        const deviceObjects = data[deviceId];
        const len = deviceObjects.length;
        for (let i = 0; i < len; i++) {
          const obj = deviceObjects[i]
          hasObject = true;
          this.scene.add(obj);
        }
      }

      // As a "keep-alive", send an invisible shape
      if (!hasObject) {
        this.scene.add(new Rect({x: 0, y: 0, width: 1, height: 1, color: [0, 0, 0]}))
      }
    }
  }

  destroy = () => {
    if (this.output) {
      this.output.stop();
    }
    if (this.scene) {
      this.scene.stop();
    }

    this.output = null;
    this.scene = null;
  }
}