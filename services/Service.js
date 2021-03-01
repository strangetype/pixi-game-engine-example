const { EventEmitter } = require('pixi.js').utils;
const deferred = require('deferred');

class Service extends EventEmitter {
	constructor(options = {}) {
		super();
		Object.defineProperty(this, 'app', { get: ()=> options.app });
		this.promises = {};
	}

	createPromise(name) {
		this.promises[name] = deferred();
		return this.promises[name].promise;
	}

	resolvePromise(name, data) {
		if (this.promises[name]) this.promises[name].resolve(data);
		delete this.promises[name];
	}

	rejectPromise(name, data) {
		if (this.promises[name]) this.promises[name].reject(data);
		delete this.promises[name];
	}

	destroy() {

	}

}

module.exports = Service;