import EventEmitter from 'events';

import * as StoreEvent from '../events/StoreEvent';

export default class Store extends EventEmitter {
  currentState = null;
  prevState = null;
  
  update = (newState) => {
    this.compareDevices(this.prevState, newState);
    // this.compareScripts(this.prevState, newState);
    // this.compareTimelines(this.prevState, newState);
    
    this.prevState = this.currentState;
    this.currentState = newState;
  }
  
  get state() {
    return this.currentState;
  }
  
  compareDevices = (prevState, newState) => {
    this.doCompare(
      prevState ? prevState.devices : [],
      newState ? newState.devices : [],
      StoreEvent.DEVICE_CHANGED
    );
  }
  
  compareScripts = (prevState, newState) => {
    this.doCompare(
      prevState ? prevState.scripts : [],
      newState ? newState.scripts : [],
      StoreEvent.SCRIPT_CHANGED
    );
  }
  
  doCompare = (prevItems, newItems, eventName) => {
    const step1 = prevItems.reduce((acc, item) => {
      return {
        ...acc,
        [item.id]: item,
      };
    }, {});
    
    const step2 = newItems.reduce((acc, item) => {
      if (!(item.id in acc)) {
        return {
          ...acc,
          [item.id]: {
            item,
            status: 'added',
          },
        };
      }
      const existingItem = acc[item.id];
      if (!existingItem.lastUpdated || existingItem.lastUpdated < item.lastUpdated) {
        return {
          ...acc,
          [item.id]: {
            item,
            status: 'updated',
          },
        };
      }
    }, step1);
    
    Object.entries(step2).forEach(([id, item]) => {
      if ('status' in item) {
        this.emit(eventName, {
          item: item.item,
          status: item.status,
        })
      } else {
        this.emit(eventName, {
          item,
          status: 'removed',
        });
      }
    });
  }
}