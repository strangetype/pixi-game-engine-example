const { forIn } = require('lodash');
const { EventEmitter } = require('pixi.js').utils;

const _state = Symbol('_state');

class Store extends EventEmitter {
	constructor(state, app) {
		super();
		Object.defineProperty(this, 'app', { get: ()=> app });

		this.defaultState = Object.freeze(Object.assign({}, state));

		this[_state] = {};

		const self = this;
		const st = {};

		forIn(state, (value, name) => {
			st[name] = value;
			Object.defineProperty(this[_state], name, {
				get() {
					return st[name];
				},
				set(value) {
					st[name] = value;
					self.emit(name, value);
				},
			});
		});

		Object.seal(this[_state]);

	}

	get state() {
		return this[_state];
	}

	resetState(key) {
		if (key) {
			this.state[key] = this.defaultState[key];
		} else Object.keys(this.defaultState).forEach(key => {
			this.state[key] = this.defaultState[key];
		});
	}

	updateState(name) {
		this.emit(name, this.state[name]);
	}

}

module.exports = Store;