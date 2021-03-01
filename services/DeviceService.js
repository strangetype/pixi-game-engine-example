const screenfull = require('screenfull');
const { isMobile, isAndroid } = require('mobile-device-detect');
const DeviceOrientation = require('mobile-device-orientation');
const Service = require('./Service');

class DeviceService extends Service {
	constructor(options) {
		super(options);
		this.screenfull = screenfull;
		this.deviceOrientation = new DeviceOrientation();
		(this.deviceOrientation.value === 'landscape') ? document.body.classList.add('landscape') : document.body.classList.add('portrait');
		this.isMobile() ? document.body.classList.add('mobile') : document.body.classList.add('desktop');

		this.deviceOrientation.onChange = orientation => {
			document.body.classList.add(orientation);
			(orientation === 'landscape') ? document.body.classList.remove('portrait') : document.body.classList.remove('landscape');
			this.emit('orientation-changed', orientation);
		};

	}

	isAndroid() {
		return isAndroid;
	}

	isMobile() {
		return isMobile || isAndroid;
	}

	get screenfullEnabled() {
		return screenfull && screenfull.enabled;
	}

	launchFullScreen() {
		if (this.screenfull && this.screenfull.enabled && this.isMobile()) this.screenfull.toggle();
	}

}

module.exports = DeviceService;