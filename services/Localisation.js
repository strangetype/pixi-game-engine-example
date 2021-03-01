const Service = require('./Service');
const { parse } = require('query-string');

class Localisation extends Service {
	constructor(options) {
		super(options);
		this.lang = parse(location.search).language || 'en';
		this.localisation = options.localisation;
	}

	get(key, isTry) {
		let word;
		let f = this.localisation.translations[this.lang];
		if (f && f[key]) {
			word = f[key];
		} else {
			word = isTry ? key : `[${key}]`;
		}
		return word;
	}

}

module.exports = Localisation;