const _protected = require('./_protected');

class Scene {
	constructor(options) {
		Object.defineProperty(this, 'app', { get: ()=> options.app });
		_protected(this, 'subscribes', []);
		_protected(this, 'gameObjects', []);
		this.initialized = false;
	}

	init() {
		this.subscribes.forEach(({ store, valueName, callback })=> {
			callback.call(this, this.app.stores[store].state[valueName]);
		});
		this.initialized = true;
		this.gameObjects.forEach(go => go.init());
	}

	createGameObject(className, options) {
		const go = this.app.createGameObject(className, options, false);
		this.gameObjects.push(go);
		if (this.initialized) go.init();
		return go;
	}

	subscribe(store, valueName, callback) {
		this.subscribes.push({
			store, valueName, callback
		});
		this.app.stores[store].on(valueName, callback, this);
	}

	destroy() {
		this.gameObjects.forEach(go => {
			go.destroy();
		});
		this.subscribes.forEach(({ store, valueName, callback }) => {
			this.app.stores[store].removeListener(valueName, callback, this);
		});
	}

	setLayer(layer) {
		this.gameObjects.forEach(go => {
			go._shapes.forEach(sh => {
				sh.parentLayer = this.app.layers[layer];
			});
		});
	}

}

module.exports = Scene;