const DeviceService = require('./DeviceService');
const viewportSize = require('viewport-size');
const res = require('res');
const { debounce } = require('lodash');

class ResizeService extends DeviceService {
	constructor(options) {
		super(options);

		const MAX_DPPX = options.MAX_DPPX || 1.5;
		const MIN_DPPX = options.MIN_DPPX || 1;

		this.DPPX = res.dppx();
		if (this.DPPX<MIN_DPPX) this.DPPX = MIN_DPPX;
		if (this.DPPX>MAX_DPPX) this.DPPX = MAX_DPPX;

		this._MAX_RATIO = options.maxRatio || .6;
		this._MIN_RATIO = options.minRatio || .45;

		this._MAX_RATIO_LONG = options.maxRatioLong || this._MAX_RATIO || .6;
		this._MIN_RATIO_LONG = options.minRatioLong || this._MIN_RATIO || .45;

		this._isCheckLimits = options.isCheckLimits || false;

		window.addEventListener('resize', ()=>this.resize());

		this.on('orientation-changed', this.resize, this);

		this.isLong = true;

		if (this.screenfull) {
			this.screenfull.on('change', ()=>this.resize());
			this.screenfull.on('change', ()=> {
				(this.screenfull && !this.screenfull.isFullscreen) ? document.body.classList.add('not-fullscreen') : document.body.classList.remove('not-fullscreen');
			});
		}

		//this.resize = debounce(this.resize, 100);

		this._resize();

		this.__baseX = this.app.renderer.width;
		this.__baseY = this.app.renderer.height;
		this.__baseSize = Math.min(this.__baseX, this.__baseY);

		this.__prevBaseX = this.__baseX;
		this.__prevBaseY = this.__baseY;
		this.__prevBaseSize = this.__baseSize;

		this.__cx = 1;
		this.__cy = 1;
		this.__c = 1;

		this.resize();

	}

	get isCheckLimits() {
		return this._isCheckLimits;
	}

	set isCheckLimits(v) {
		this._isCheckLimits = v;
		this.resize();
	}

	get MAX_RATIO() {
		return this._MAX_RATIO;
	}

	set MAX_RATIO(r) {
		this._MAX_RATIO = r;
		this.resize();
	}

	get MIN_RATIO() {
		return this._MIN_RATIO;
	}

	set MIN_RATIO(r) {
		this._MIN_RATIO = r;
		this.resize();
	}

	get MAX_RATIO_LONG() {
		return this._MAX_RATIO_LONG;
	}

	set MAX_RATIO_LONG(r) {
		this._MAX_RATIO_LONG = r;
		this.resize();
	}

	get MIN_RATIO_LONG() {
		return this._MIN_RATIO_LONG;
	}

	set MIN_RATIO_LONG(r) {
		this._MIN_RATIO_LONG = r;
		this.resize();
	}

	_checkLimits(w,h) {
		if (this.isLong) {
			if (h/w < this.MIN_RATIO_LONG) {
				w = h/this.MIN_RATIO_LONG;
			} else if (h/w>this.MAX_RATIO_LONG) {
				h = w*this.MAX_RATIO_LONG;
			}
		} else {
			if (w/h < this.MIN_RATIO) {
				h = w/this.MIN_RATIO;
			} else if (w/h>this.MAX_RATIO) {
				w = h*this.MAX_RATIO;
			}
		}
		return { w, h };
	}

	_resize() {
		let w = Math.min(document.body.offsetWidth, window.innerWidth);
		let h = Math.min(document.body.offsetHeight, window.innerHeight);

		this.isLong = w/h>1;

		if (this._isCheckLimits) {
			let l = this._checkLimits(w,h);
			w = l.w;
			h = l.h;
		}

		this.app.view.parentNode.style.width = w + 'px';
		this.app.view.parentNode.style.height = h + 'px';
		this.app.renderer.resize(w*this.DPPX, h*this.DPPX);
	}

	_calcSizeChanges() {
		this.__baseX = this.app.renderer.width;
		this.__baseY = this.app.renderer.height;
		this.__baseSize = Math.min(this.__baseX, this.__baseY);

		this.__cx = this.__baseX/this.__prevBaseX;
		this.__cy = this.__baseY/this.__prevBaseY;
		this.__c = this.__baseSize/this.__prevBaseSize;

		this.__prevBaseX = this.__baseX;
		this.__prevBaseY = this.__baseY;
		this.__prevBaseSize = this.__baseSize;
	}

	resize() {
		this._resize();
		//this.app.timeout(()=>{
		this._calcSizeChanges();
		this.emit('resize');
		//});
	}

}

module.exports = ResizeService;