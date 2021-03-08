import generator from './generator';
import render from './render';

import printError from './printError';
import {generateContext} from './client';
import generateTree from '../shared/generateTree';
import Scope from './scope';

import Routable from '../plugins/routable';
import Bindable from '../plugins/bindable';
import Datable from '../plugins/datable';
import Parameterizable from '../plugins/parameterizable';

export async function prerender(request, response) {
  const scope = new Scope(request, response);
  scope.generateContext = generateContext(scope.context);
  scope.plugins = [
    new Parameterizable({scope}),
    new Routable({scope}),
    new Datable({scope}),
    new Bindable({scope})
  ]

  try {
    const tree = await generateTree(generator.starter(), scope);
    scope.body = render(tree, scope);
    if(!scope.context.worker.online) {
      scope.context.page.status = 200;
    }
  } catch(error) {
    printError(error);
    scope.context.page.status = 500;
  } finally {
    if(scope.context.page.status !== 200) {
      for(const key in scope.routes) {
        delete scope.routes[key];
      }
      for(const key in scope.instances) {
        delete scope.instances[key];
      }
      scope.head = '';
      scope.plugins = [
        new Parameterizable({scope}),
        new Routable({scope}),
        new Datable({scope}),
        new Bindable({scope})
      ]
      const tree = await generateTree(generator.starter(), scope);
      scope.body = render(tree, scope);
    }
  }
  return scope;
}