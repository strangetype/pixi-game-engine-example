const { Howl, Howler } = require('howler');
const Visibility = require('visibilityjs');
const Service = require('./Service');

class SoundService extends Service {
	constructor(options) {
		super(options);
		this.resources = [];
		this.sounds = {};
		if (options.silenceSound) {
			this.__silence = new Howl({
				src: options.silenceSound,
				html5: false,
				loop: true,
				preload: true,
				autoplay: false,
				onload: () => {
					this.__silence.play();
				}
			});
		}

		this._isMute = false;

	}

	startSilence() {
		this.__silence.play();
	}

	get isMute() {
		return this._isMute;
	}

	set isMute(v) {
		this._isMute = !!v;
	}

	sound(name, path) {
		this.sounds[name] = new Howl({
			src: [path]
		});
		return this.sounds[name];
	}

	addSounds(sounds) {
		Object.keys(sounds).forEach(key => {
			this.resources.push({ name: key, path: sounds[key] });
		});
	}

	load(callback, errorCallback) {
		let loaded = 0;
		let count = this.resources.length;
		if (!count) {
			callback();
			return;
		}
		this.resources.forEach(({ name, path }) => {
			const listener = ()=> {
				loaded++;
				this.emit('loading', 100*loaded/count);
				if (loaded === count) {
					callback();
					this.emit('load');
				}
			};
			const s = this.sound(name, path);
			s.once('load', listener);
			s.once('loaderror', errorCallback);
		});
	}

	play(name) {
		if (this.isMute) return;
		if (Visibility && Visibility.hidden && Visibility.hidden()) return;
		this.sounds[name].currentTime = 0;
		this.sounds[name].volume = 1;
		return this.sounds[name].play();
	}

	pause(name, id) {
		this.sounds[name].pause(id);
	}

	stop(name, id) {
		this.sounds[name].stop(id);
	}

}

module.exports = SoundService;