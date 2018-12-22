export default class ScriptRenderer {
  rendererType = 'script';
  script = null;
  devices = null;
  standalone = true;
  setuped = false;
  started = false;
  localBeat = 0;
  scriptData = {};
  devicesData = {};
  
  constructor(script, devices, standalone = true) {
    this.script = script;
    this.devices = devices;
    this.standalone = standalone;
  }
  
  reset = () => {
    this.scriptData = {};
    this.devicesData = {};
    this.setuped = false;
    this.started = false;
    this.localBeat = 0;
  }
  
  injectDevicesData = () => {
    this.devices.forEach((device) => {
      device.vars = device.id in this.devicesData
                    ? this.devicesData[device.id]
                    : {};
    });
  }
  
  extractDevicesData = () => {
    this.devices.forEach((device) => {
      this.devicesData[device.id] = device.vars;
      device.vars = null;
    });
  }
  
  render = (delta, blockInfo = {}, triggerData = {}, curveData = {}) => {
    this.injectDevicesData();
        
    // Standalone setup
    if (this.standalone) {
      if (this.script.hasSetup && !this.setuped) {
        try {
          const data = this.script.scriptInstance.setup(this.devices);
          if (data) {
            this.scriptData = data;
          }
        } catch (err) {
          console.error(err);
        }
        this.setuped = true;
      }
    }
    // In-timeline setup
    else {
      // If in setup period
      if (this.script.hasSetup && blockInfo.blockPercent < 0) {
        try {
          const data = this.script.scriptInstance.setup(this.devices);
          if (data) {
            this.scriptData = data;
          }
        } catch (err) {
          console.error(err);
        }
        this.setuped = true;
        this.extractDevicesData();
        return;
      }
    }
  
    // Start
    if (!this.started) {
      if (this.script.hasStart) {
        try {
          const data = this.script.scriptInstance.start(this.devices, triggerData, curveData);
          if (data) {
            this.scriptData = data;
          }
        } catch (err) {
          console.error(err);
        }
      }
      this.started = true;
    }

    // Loop
    if (this.script.hasLoop) {
      try {
        const data = this.script.scriptInstance.loop(this.devices, this.scriptData, blockInfo, triggerData, curveData);
        if (data) {
          this.scriptData = data;
        }
      } catch (err) {
        console.error(err);
      }
    }
    
    this.extractDevicesData();
  }

  beat = (beat, delta) => {
    this.localBeat++;
    
    // Beat
    if (this.script.hasBeat) {
      this.injectDevicesData();
      
      const beatObject = {
        localBeat: this.localBeat,
        globalBeat: beat,
      };
      try {
        const data = this.script.scriptInstance.beat(this.devices, beatObject, this.scriptData);
        if (data) {
          this.scriptData = data;
        }
      } catch (err) {
        console.error(err);
      }
      
      this.extractDevicesData();
    }
  }
  
  input = (type, inputData) => {
    // Input
    if (this.script.hasInput) {
      this.injectDevicesData();
      
      try {
        const data = this.script.scriptInstance.input(this.devices, type, inputData, this.scriptData);
        if (data) {
          this.scriptData = data;
        }
      } catch (err) {
        console.error(err);
      }
      
      this.extractDevicesData();
    }
  }

  destroy = () => {
    this.script = null;
    this.devices = null;
    this.scriptData = null;
    this.devicesData = null;
  }
}
