const PIXI = require('pixi.js');
const Component = require('./Component');

const PARTS = ['lt', 't', 'rt', 'l', 'r', 'lb', 'b', 'rb'];
const POSITIONS = {
	lt: { x: -0.5, y: -0.5, sx: 0, sy: 0 },
	t:  { x:    0, y: -0.5, sx: 1, sy: 0 },
	rt: { x:  0.5, y: -0.5, sx: 0, sy: 0 },
	l:  { x: -0.5, y:    0, sx: 0, sy: 1 },
	r:  { x:  0.5, y:    0, sx: 0, sy: 1 },
	lb: { x: -0.5, y:  0.5, sx: 0, sy: 0 },
	b:  { x:    0, y:  0.5, sx: 1, sy: 0 },
	rb: { x:  0.5, y:  0.5, sx: 0, sy: 0 },
};

class SpriteRect extends Component {
	constructor(options) {
		super(options);
		this.container = options.container || new PIXI.Container();
		this.parts = {};
		const center = this.constructor.createSprite(options.spriteName+'_c');
		center.anchor.set(0.5);
		this.center = center;
		this.container.addChild(center);

		this._width = options.width || 64;
		this._height = options.height || 16;
		this._borderWidth = options.borderWidth || 4;
		this.container.x = options.x || 0;
		this.container.y = options.y || 0;

		PARTS.forEach(p => {
			let part = this.constructor.createSprite(options.spriteName + '_' + p);
			part.anchor.set(-POSITIONS[p].x+0.5, -POSITIONS[p].y+0.5);
			this.parts[p] = part;
			this.alignPart(p);
			this.container.addChild(part);
		});

		this.align();

		this.scale = this.container.scale;
		this.gameObject.addShape(this.container);
	}

	align() {
		this.center.width = this._width - 2*this._borderWidth;
		this.center.height = this._height - 2*this._borderWidth;
		if (this.center.width<0) this.center.width = 0;
		if (this.center.height<0) this.center.height = 0;
		PARTS.forEach(p => this.alignPart(p));
	}

	alignPart(p) {
		this.parts[p].x = POSITIONS[p].x*this.center.width;
		this.parts[p].y = POSITIONS[p].y*this.center.height;
		this.parts[p].width = (POSITIONS[p].sx) ? this.center.width : this._borderWidth;
		this.parts[p].height = (POSITIONS[p].sy) ? this.center.height : this._borderWidth;
	}

	get x() {
		return this.container.x;
	}

	set x(x) {
		this.container.x = x;
	}

	get y() {
		return this.container.y;
	}

	set y(y) {
		this.container.y = y;
	}

	get width() {
		return this._width;
	}

	set width(w) {
		this._width = w;
		this.align();
	}

	get height() {
		return this._height;
	}

	set height(h) {
		this._height = h;
		this.align();
	}

	get borderWidth() {
		return this._borderWidth;
	}

	set borderWidth(bw) {
		this._borderWidth = bw;
		this.align();
	}

	get rotation() {
		return this.container.rotation;
	}

	set rotation(r) {
		this.container.rotation = r;
	}

}

module.exports = SpriteRect;