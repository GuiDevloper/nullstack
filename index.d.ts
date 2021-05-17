type Page = {
  /**
   * Current page title
   * 
   * https://nullstack.app/context-page
   */
  title: string,
  
  /**
   * Current page description
   * 
   * https://nullstack.app/context-page
   */
  description: string,
  
  /**
   * Current page locale
   * 
   * https://nullstack.app/context-page
   */
  locale: string
};

type Project = {
  /**
   * Name of the project
   *
   * https://nullstack.app/context-project
   */
  name: string
};

type Worker<qType = Object> = {
  /**
   * - keys: server functions names
   * - values: array of these functions arguments
   *
   * https://nullstack.app/service-worker#loading-screens
   */
  queues: qType,

  /**
   * When a server function is called fetching will be set to `true` until the response is resolved.
   *
   * https://nullstack.app/service-worker#loading-screens
   */
  fetching: boolean,

  /**
   * @deprecated Removed on v0.9.20 use `fetching` instead:
   *
   * https://nullstack.app/service-worker#loading-screens
   */
  loading: boolean
};

type Context = {
  /**
   * Information about the document `head` metatags.
   *
   * https://nullstack.app/context-page
   */
  page?: Page,

  /**
   * Information about the app manifest and some metatags.
   *
   * https://nullstack.app/context-project
   */
  project?: Project,

  /**
   * Gives you granular control of your PWA behavior.
   * 
   * https://nullstack.app/service-worker
   */
  worker?: Worker
};

export class Nullstack {
  render(context: Context): any
}
