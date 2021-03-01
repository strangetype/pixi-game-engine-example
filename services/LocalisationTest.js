const Service = require('./Service');
const { parse } = require('query-string');

class LocalisationTest extends Service {
	constructor(options) {
		super(options);
		this.lang = parse(location.search).language || 'en';
		this.cache = {};
		if (localStorage.locals) this.cache = JSON.parse(localStorage.locals);
		this.localisation = options.localisation;
		this.localisation.activeLanguages.forEach(l => {
			if (!this.cache[l]) this.cache[l] = {}
		});
	}

	get(key, isTry) {
		let word = (this.cache[this.lang] && this.cache[this.lang][key]) ? this.cache[this.lang][key] : undefined;
		if (!word) {
			let f = this.localisation.translations.find(tr => tr.key === key);
			if (f && f.translations && f.translations[this.lang]) {
				word = f.translations[this.lang];
				this.cache[this.lang][key] = word;
				localStorage.locals = JSON.stringify(this.cache);
			} else {
				word = isTry ? key : `[${key}]`;
			}
		}
		return word;
	}

}

module.exports = LocalisationTest;