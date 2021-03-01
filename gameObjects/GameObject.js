const Component = require('../components/Component');
const _protected = require('../_protected');

let id = 0, i, l;

class GameObject {
	constructor(options) {
		id++;
		_protected(this, 'app', options.app);
		_protected(this, '_shapes', []);
		this.gameObjects = [];
		this.components = [];
		this._componentsToUpdateList = [];
		_protected(this, 'subscribes', []);
		_protected(this, 'id', id);
		_protected(this, 'parent', options.parent || null);
		_protected(this, '_timeouts', []);
		_protected(this, '_intervals', []);
		this._isComponents = false;
		this.active = true;
		this.live = true;
	}

	init() {
		this.subscribes.forEach(({ store, valueName, callback })=> {
			callback.call(this, this.app.stores[store].state[valueName]);
		});
		this.components.forEach(c => c.init());
		this.gameObjects.forEach(go => go.init());
	}

	addShape(shape, addToStage = true) {
		this._shapes.push(shape);
		if (addToStage) this.app.stage.addChild(shape);
	}

	createGameObject(name, options = {}) {
		options.parent = this;
		const go = this.app.createGameObject(name, options, false);
		this.gameObjects.push(go);
		return go;
	}

	createComponent(name, options = {}) {
		options.app = this.app;
		options.gameObject = this;
		const component = new this.app.components[name](options);
		if (component.update) this._componentsToUpdateList.push(component);
		this.components.push(component);
		this._isComponents = true;
		return component;
	}

	blank(name) {
		const params = arguments.length>1 ? Array.prototype.slice.call(arguments, 1, arguments.length) : [];
		return this.app.blank(name, this, params);
	}

	clearDeadElements() {
		this.gameObjects = this.gameObjects.filter(go => go.live);
		this.components = this.components.filter(c => c.live);
		this._componentsToUpdateList = this._componentsToUpdateList.filter(c => c.live);
	}

	subscribe(store, valueName, callback) {
		this.subscribes.push({
			store, valueName, callback
		});
		this.app.stores[store].on(valueName, callback, this);
	}

	update() {
		if (this._isComponents) {
			l = this._componentsToUpdateList.length;
			for (i=0; i<l; i++) this._componentsToUpdateList[i].update();
		}
	}

	hold() {
		this.active = false;
		this.hide();
	}

	unhold() {
		this.active = true;
		this.show();
	}

	static createSprite(name, ext) {
		return Component.createSprite(name, ext);
	}

	static createSpriteFromTexture(texture) {
		return Component.createSpriteFromTexture(texture);
	}

	static createContainer() {
		return Component.createContainer();
	}

	static createText(text, options) {
		return Component.createText(text, options);
	}

	static setTextScaleCoef(scale) {
		return Component.setTextScaleCoef(scale);
	}

	static createTextS(text, options) {
		return Component.createTextS(text, options);
	}

	static createGraphics() {
		return Component.createGraphics();
	}

	static texture(name, ext) {
		return Component.texture(name, ext);
	}

	static get TEXT_SCALE() {
		return Component.TEXT_SCALE;
	}

	static emitter() {
		return Component.emitter();
	}

	static get BLEND_MODES() {
		return Component.BLEND_MODES;
	}

	setTimeout(method, time) {
		let tm = this.app.timeout(method, time);
		this._timeouts.push(tm);
		return tm;
	}

	setInterval(method, interval) {
		let int = this.app.interval(method, interval);
		this._intervals.push(int);
		return int;
	}

	clearTimer(timerId) {
		this.app.clearTimer(timerId);
		//TODO: remove timer from timers/intervals list
	}

	hide() {
		this._shapes.forEach(sh => sh.visible = false);
	}
	show() {
		this._shapes.forEach(sh => sh.visible = true);
	}

	get visible() {
		return this._visible;
	}

	set visible(v) {
		this._visible = v;
	}

	destroy() {
		this._timeouts.forEach(t => this.app.clearTimer(t));
		this._intervals.forEach(t => this.app.clearTimer(t));
		this.subscribes.forEach(({ store, valueName, callback }) => {
			this.app.stores[store].removeListener(valueName, callback, this);
		});
		this.components.forEach(c => c.destroy());
		this.gameObjects.forEach(go => go.destroy());
		this.active = false;
		this.live = false;
		this.hide();
		this._shapes.forEach(shape => {
			shape.destroy({ children: true });
			if (shape.parent) shape.parent.removeChild(shape);
		});
	}
}

module.exports = GameObject;