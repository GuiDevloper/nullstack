import segments from './segments';
import router from './router';
import rerender from './rerender';
import context from './context';

import generateTree from '../shared/generateTree';

import Routable from '../plugins/routable';
import Bindable from '../plugins/bindable';
import Datable from '../plugins/datable';
import Parameterizable from '../plugins/parameterizable';
import Anchorable from '../plugins/anchorable';
import Objectable from '../plugins/objectable';

class Scope {
  initialized = false;
  hydrated = false;
  initializer = null;

  instances = {};
  initiationQueue = [];
  renewalQueue = [];
  hydrationQueue = [];
  virtualDom = {};
  selector = null;
  routes = {};
  events = {};

  segments = segments;
  renderQueue = null;
  context = context;
  plugins = [];

  async update() {
    if(this.initialized) {
      clearInterval(this.renderQueue);
      this.renderQueue = setTimeout(async () => {
        this.plugins = [
          new Objectable({scope: this}),
          new Parameterizable({scope: this}),
          new Anchorable({scope: this}),
          new Routable({scope: this}),
          new Datable({scope: this}),
          new Bindable({scope: this})
        ];
        this.initialized = false;
        this.initiationQueue = [];
        this.renewalQueue = [];
        this.hydrationQueue = [];
        this.nextVirtualDom = await generateTree(this.initializer(), this);
        rerender(this.selector, []);
        this.virtualDom = this.nextVirtualDom;
        this.nextVirtualDom = null;
        this.processLifecycleQueues();
      }, 16);
    }
  }

  async processLifecycleQueues() {
    if(!this.initialized) {
      this.initialized = true;
      this.hydrated = true;
    }
    const initiationQueue = this.initiationQueue;
    const hydrationQueue = this.hydrationQueue;
    for(const instance of initiationQueue) {
      instance.initiate && await instance.initiate();
      instance._self.initiated = true;
    }
    if(initiationQueue.length) {
      this.update();
    }
    for(const instance of hydrationQueue) {
      instance.hydrate && await instance.hydrate();
      instance._self.hydrated = true;
    }
    if(hydrationQueue.length) {
      this.update();
    }
    for(const key in this.instances) {
      const instance = this.instances[key];
      if(!this.renewalQueue.includes(instance)) {
        instance.terminate && await instance.terminate();
        delete this.instances[key];
      }
    }
    router._changed = false;
  }
}

export default Scope;