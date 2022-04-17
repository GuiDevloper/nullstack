'use strict';
// Originally published at https://npmjs.com/package/ignore-loader
module.exports = function(content) {
  this.cacheable && this.cacheable();
  return '';
}
