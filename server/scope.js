import environment from './environment';
import project from './project';
import Router from './router';
import settings from './settings';
import worker from './worker';
import {generateParams} from './params';

class Scope {
  constructor(request, response) {
    const context = {
      page: {image: '/image-1200x630.png', status: 200},
      project: project,
      environment: environment,
      settings: settings,
      params: generateParams(request.originalUrl),
      router: new Router(request, response)
    };

    const online = context.router.url !== `/offline-${environment.key}`;
    context.worker = { ...worker, online, responsive: online };

    return {
      instances: {},
      segments: context.params,
      request: request,
      response: response,
      head: '',
      body: '',
      context: context
    };
  }
}

export default Scope;