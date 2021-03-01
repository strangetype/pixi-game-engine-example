const GameObject  = require('./GameObject');

class Container extends GameObject {
	constructor(options) {
		super(options);
		this.container = options.container || this.constructor.createContainer();
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.addShape(this.container);
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

	get scale() {
		return this.container.scale;
	}

	get rotation() {
		return this.container.rotation;
	}

	set rotation(rotation) {
		this.container.rotation = rotation;
	}
}

module.exports = Container;