const Component = require('./Component');

class SymmetrySprite extends Component {
	constructor(options) {
		super(options);

		this.container = this.constructor.createContainer();

		this.container.x = options.x || 0;
		this.container.y = options.y || 0;

		const left = this.constructor.createSprite(options.spriteName);
		const right = this.constructor.createSprite(options.spriteName);
		right.scale.set(-1, 1);

		this._width = options.width || left.width*2;
		this._height = options.height || left.height;

		left.anchor.set(1, 0.5);
		right.anchor.set(1, 0.5);

		left.width = this._width/2;
		left.height = this._height;

		right.width = this._width/2;
		right.height = this._height;

		this.container.addChild(left, right);

		this.left = left;
		this.right = right;

		this.scale = this.container.scale;
		this.gameObject.addShape(this.container);

	}

	get width() {
		return this._width;
	}

	set width(w) {
		this._width = w;
		this.left.width = w/2;
		this.right.width = w/2;
	}

	get height() {
		return this._height;
	}

	set height(h) {
		this._height = h;
		this.left.height = h;
		this.right.height = h;
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

module.exports = SymmetrySprite;