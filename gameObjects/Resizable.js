const GameObject = require('./GameObject');

class Resizable extends GameObject {
	constructor(options) {
		super(options);
		this.resizeService = this.app.services[options.resizeService || this.app.constants.RESIZE_SERVICE_NAME || 'resize'];
		this.resizeService.on('resize', this.resize, this);
	}

	resize() {

	}

	destroy() {
		this.resizeService.off('resize', this.resize, this);
		super.destroy();
	}

}

module.exports = Resizable;