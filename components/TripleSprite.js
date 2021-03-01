const Component = require('./Component');

class TripleSprite extends Component {
	constructor(options) {
		super(options);

		this.container = this.constructor.createContainer();

		this.container.x = options.x || 0;
		this.container.y = options.y || 0;

		const left = this.constructor.createSprite(options.sideSprite);
		const right = this.constructor.createSprite(options.sideSprite);
		const center = this.constructor.createSprite(options.centerSprite);
		right.scale.set(-1, 1);

		this._width = left.width*2 + center.width;
		this._height = center.height;
		this._sideWidth = left.width;

		left.anchor.set(1, 0.5);
		right.anchor.set(1, 0.5);
		center.anchor.set(0.5, 0.5);

		left.x  = -center.width/2;
		right.x =  center.width/2;

		this.container.addChild(center, left, right);

		this.left = left;
		this.right = right;
		this.center = center;

		this.scale = this.container.scale;

		if (options.width) this.width = options.width;
		if (options.height) this.height = options.height;

		this.gameObject.addShape(this.container);

	}

	align() {
		this.left.width = this._sideWidth;
		this.right.width = this._sideWidth;
		this.center.width = this._width - this.left.width*2;
		this.left.x  = -this.center.width/2;
		this.right.x =  this.center.width/2;
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
		this.left.height = h;
		this.right.height = h;
		this.center.height = h;
	}

	get sideWidth() {
		return this._sideWidth;
	}

	set sideWidth(sideWidth) {
		this._sideWidth = sideWidth;
		this.align();
	}

	setWidthAsBase(w) {
		let oldW = this._width;
		this.width = w;
		this.height *= w/oldW;
	}

	setHeightAsBase(h) {
		let oldH = this._height;
		this.height = h;
		this.width *= h/oldH;
	}

	get rotation() {
		return this.container.rotation;
	}

	set rotation(r) {
		this.container.rotation = r;
	}

	get x() {
		return this.container.x;
	}

	set x(x) {
		this.container.x = x
	}

	get y() {
		return this.container.y;
	}

	set y(y) {
		this.container.y = y
	}
	
}

module.exports = TripleSprite;