import generateKey from '../shared/generateKey';

export default class Instanceable {

  match({node}) {
    return (
      node &&
      typeof node.type === 'function' &&
      node.type.prototype &&
      node.type.name.length > 0
    )
  }

  transform({node, depth, scope}) {
    if (!scope.context.instances[node.type.name]) {
      const instance = new node.type(scope);
      instance._scope = { generateContext: scope.generateContext };
      scope.context.instances[node.type.name] = instance;
    } else {
      const key = node.attributes.key || generateKey(depth);
      scope.instances[key] = scope.context.instances[node.type.name];
    }
  }

}