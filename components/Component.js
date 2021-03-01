const PIXI = require('pixi.js');
const _protected = require('../_protected');

let TEXT_SCALE = 2;

let id = 0;

class Component {
	constructor(options) {
		id++;
		_protected(this, 'id', id);
		_protected(this, 'app', options.app);
		_protected(this, 'gameObject', options.gameObject);
		this.live = true;
	}

	init() {

	}

	static createSprite(name, ext) {
		ext = (ext) ? '.'+ext : '.png';
		return new PIXI.Sprite.from(name + ext);
	}

	static createSpriteFromTexture(texture) {
		return new PIXI.Sprite(texture);
	}

	static createContainer() {
		return new PIXI.Container();
	}

	static createText(text, options = {}) {
		let t = new PIXI.Text(text, options);
		if (options.alpha) t.alpha = options.alpha;
		return t;
	}

	static createTextS(text, options, scale = TEXT_SCALE) {
		let t = this.createText(text, Object.assign({}, options, { fontSize: options.fontSize*scale, wordWrapWidth: options.wordWrapWidth*scale }));
		t.scale.set(1/scale);
		return t;
	}

	static get TEXT_SCALE() {
		return TEXT_SCALE;
	}

	static setTextScaleCoef(coef) {
		TEXT_SCALE = coef;
	}

	static createGraphics() {
		return new PIXI.Graphics();
	}

	static texture(name, ext) {
		ext = (ext) ? '.'+ext : '.png';
		return PIXI.Texture.from(name+ext);
	}

	static emitter() {
		return new PIXI.utils.EventEmitter();
	}

	static get BLEND_MODES() {
		return PIXI.BLEND_MODES;
	}

	/*
	update() {

	}
	*/

	destroy() {
		this.live = false;
	}

}

module.exports = Component;