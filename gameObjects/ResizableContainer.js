const Container = require('./Container');

class ResizableContainer extends Container {
	constructor(options) {
		super(options);
		this.resizeService = this.app.services[options.resizeService || this.app.constants.RESIZE_SERVICE_NAME || 'resize'];
		this.resizeService.on('resize', this.resize, this);
		this._resize();
	}

	_resize() {
		this.scale.set(this.scale.x*this.resizeService.__c);
	}

	resize() {
		this._resize();
	}

	destroy() {
		this.resizeService.off('resize', this.resize, this);
		super.destroy();
	}

}

module.exports = ResizableContainer;