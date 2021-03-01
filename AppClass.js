const PIXI = require('pixi.js');
const Visibility = require('visibilityjs');
const FontFaceObserver = require('fontfaceobserver');
PIXI.settings.RESOLUTION = 1;

let loadInterval;
let loaded = false;

let _timerId = 0;
const timerCallbacks = {};

let timer;

let i,l;

class AppClass extends PIXI.Application {
	constructor(width = 1024, height = 768, options = { }) {
		options.antialias = true;
		options.aspectRatio = 1;
		options.width = width;
		options.height = height;
		super(options);

		timer = new Worker(options.timeWorkerSrc || 'assets/timeWorker.js');

		timer.onmessage = function(e) {
			if (timerCallbacks[e.data]) timerCallbacks[e.data](e);
		};

		this.defaultFont = options.defaultFont || 'Arial';

		//this.loader = new PIXI.loaders.Loader();
		this.resources = {};
		this.resourcesLoaded = false;

		this.loader.on('progress', (a,r) => {
			this.resources[r.name] = r;
		});

		this.view.classList.add('main-container');
		document.getElementById('app').appendChild(this.view);

		this.gameObjects = [];
		this.gameObjectsClasses = {};
		this.components = {};
		this.blanks = {};
		this.services = {};
		this.stores = {};
		this.sceneClasses = {};
		this.currentScene = null;
		this.constants = {};

		this.prevSceneName = null;
		this.prevSceneOptions = null;
		this.currentSceneName = null;
		this.currentSceneOptions = null;

		this.destroyTimer = 0;

		this.__frameTime = Date.now();
		this.frameDelta = 0;

		this.ticker.stop();

		this.interval(()=> {
			let d = Date.now() - this.__frameTime;
			if (d>16) {
				this.update();
				this.frameDelta = d;
				this.__frameTime = Date.now();
				if (Visibility && Visibility.hidden && Visibility.hidden()) return;
				this.renderer.render(this.stage);
			}
		});

		/*
		if (window.requestAnimationFrame) {
			this.interval(()=> {
				let t = Date.now();
				if (t - this.__frameTime>16) {
					this.update();
					requestAnimationFrame(()=>this.renderer.render(this.stage));
					this.__frameTime = Date.now();
				}
			});
		}
		*/


	}

	static get PIXI() {
		return PIXI;
	}

	constant(name, value) {
		this.constants[name] = value;
		Object.defineProperty(this.constants, name, {
			value,
			writable: false
		});
	}

	addResource(name, path) {
		this.loader.add(name, path);
	}

	addResources(resources) {
		resources.forEach(({ name, path }) => this.addResource(name, path));
	}

	loadResources(callback) {
		this.loader.load((loader, resources)=> {
			this.resources = resources;
			if (typeof callback === 'function') callback(resources);
		});
	}

	checkFontsLoaded(fontFamilies) {
		const promises = [];
		fontFamilies.forEach(f => {
			const font = new FontFaceObserver(f);
			promises.push(font.load(null, 6e6));
		});
		return Promise.all(promises);
	}

	service(name, serviceClass, options = {}) {
		if (typeof name !== 'string') {
			serviceClass = name;
			name = serviceClass.name;
		}
		options.app = this;
		this.services[name] = new serviceClass(options);
	}

	store(name, storeClass, options = {}) {
		if (typeof name !== 'string') {
			storeClass = name;
			name = storeClass.name;
		}
		this.stores[name] = new storeClass(options, this);
	}

	gameObject(name, Class) {
		if (typeof name !== 'string') {
			throw 'Cannot register gameObject; gameObject should be provided with name';
			//Class = name;
			//name = Class.name;
		}
		if (this.gameObjectsClasses[name]) {
			throw 'Cannot register '+name+' ; game object class already registered';
			return;
		}
		this.gameObjectsClasses[name] = Class;
		return this;
	}

	component(name, Class) {
		if (typeof name !== 'string') {
			throw 'Cannot register component; component should be provided with name';
			return;
			//Class = name;
			//name = Class.name;
		}
		if (this.components[name]) {
			throw 'Cannot register component '+name+' ; component class already registered';
			return;
		}
		this.components[name] = Class;
		return this;
	}

	gameObjectsCollection(collection) {
		Object.keys(collection).forEach(key => {
			this.gameObject(key, collection[key]);
		});
	}

	componentsCollection(collection) {
		Object.keys(collection).forEach(key => {
			this.component(key, collection[key]);
		});
	}

	createGameObject(className, options = {}, initializeNeeded = true) {
		options.app = this;
		let go = new this.gameObjectsClasses[className](options);
		this.gameObjects.push(go);
		if (initializeNeeded) go.init();
		return go;
	}

	createComponent(className, options = {}) {
		options.app = this;
		return new this.components[className](options);
	}

	addBlank(name, constructor) {
		this.blanks[name] = constructor;
	}

	addBlanks(blanks) {
		Object.assign(this.blanks, blanks);
	}

	blank(name, go, params) {
		return this.blanks[name].apply(go, params);
	}

	scene(name, SceneClass) {
		if (typeof name!== 'string') {
			SceneClass = name;
			name = SceneClass.name;
		}
		if (this.sceneClasses[name]) {
			throw 'Cannot register '+name+' ; scene class already registered';
			return;
		}
		this.sceneClasses[name] = SceneClass;
		return this;
	}

	setScene(name, options = {}) {
		if (this.currentScene) this.currentScene.destroy();
		this.currentScene = null;
		if (this.sceneClasses[name]) {
			options.app = this;
			this.prevSceneName = this.currentSceneName;
			this.prevSceneOptions = this.currentSceneOptions;
			this.currentSceneName = name;
			this.currentSceneOptions = options;
			this.currentScene = new this.sceneClasses[name](options);
			this.currentScene.init();
		} else {
			console.error('cannot switch to ' + name + 'scene, scene is not registered');
		}
		return this.currentScene;
	}

	setPrevScene() {
		this.setScene(this.prevSceneName, this.prevSceneOptions);
	}

	timeout(callback, timeout = 0) {
		_timerId++;
		timer.postMessage(['timeout', timeout, _timerId]);
		timerCallbacks[_timerId] = callback;
		return _timerId;
	}

	interval(callback, interval = 0) {
		_timerId++;
		timer.postMessage(['interval', interval, _timerId]);
		timerCallbacks[_timerId] = callback;
		return _timerId;
	}

	clearTimer(id) {
		timer.postMessage(['clear', id]);
		delete timerCallbacks[id];
	}

	update() {
		this.destroyTimer++;
		l = this.gameObjects.length;
		for (i=0; i<l; i++) if (this.gameObjects[i].active) this.gameObjects[i].update();
		if (this.destroyTimer>200) {
			this.gameObjects = this.gameObjects.filter(go => {
				go.clearDeadElements();
				return go.live;
			});
			this.destroyTimer = 0;
		}
	}

}

module.exports = AppClass;