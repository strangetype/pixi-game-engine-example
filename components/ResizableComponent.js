const Component = require('./Component');

class ResizableComponent extends Component {
	constructor(options) {
		super(options);
		this.gameObject.resizeService.on('resize', this.resize, this);
	}

	resize() {

	}

	destroy() {
		this.gameObject.resizeService.off('resize', this.resize, this);
		super.destroy();
	}
}

module.exports = ResizableComponent;