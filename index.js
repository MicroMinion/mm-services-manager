'use strict'

var assert = require('assert')
var _ = require('lodash')

var ServiceManager = function (options) {
  assert(_.isObject(options))
  assert(_.isObject(options.platform))
  assert(_.isObject(options.logger))
  assert(_.isObject(options.storage))
  assert(_.isObject(options.runtime))
  this.platform = options.platform
  this._log = options.logger
  this._storage = options.storage
  this._runtime = options.runtime
  this._services = ['serviceManager']
}

ServiceManager.prototype._load = function () {
  var self = this
  this._storage.get('services', function (err, result) {
    if (!err) {
      var services = JSON.parse(result)
      _.forEach(services, function (serviceName) {
        self.activate(serviceName, true)
      })
      self._save()
    }
  })
}

ServiceManager.prototype._save = function () {
  this._storage.put('services', JSON.stringify(this._services))
}

ServiceManager.prototype.hasService = function (serviceName) {
  return _.has(this._services, serviceName)
}

ServiceManager.prototype.activate = function (serviceName, dontSave) {
  if (!this.hasService(serviceName)) {
    var result = this._runtime.createService(serviceName)
    if (result) {
      this._services.push(serviceName)
    }
    if (dontSave) {} else {
      this._save()
    }
  }
}

module.exports = ServiceManager
