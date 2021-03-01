const Component = require('./Component');

class AnimationsComponent extends Component {
	constructor(options) {
		super(options);
		this._animations = {};
		this._animationsStack = [];

		this._willPlay = [];
		this._willStop = [];
	}

	addAnimation(name, method) {
		this._animations[name] = method;
	}

	removeAnimation(name) {
		delete this._animations[name];
	}

	play(name) {
		this._willPlay.push(name);
	}

	stop(name) {
		name ? this._willStop.push(name) : this._willStop = this._animationsStack;
	}

	update() {
		if (this._willStop.length) {
			this._willStop.forEach(ws => this._animationsStack = this._animationsStack.filter(a =>a!==ws));
			this._willStop = [];
		}
		if (this._willPlay.length) {
			this._willPlay.forEach(wp => this._animationsStack.push(wp));
			this._willPlay = [];
		}

		this._willPlay = [];
		this._animationsStack.forEach(a => this._animations[a].call(this.gameObject));
	}

}

module.exports = AnimationsComponent;