function _protected(object, propertyName, value) {
	Object.defineProperty(object, propertyName, {
		value,
		writable: false,
		configurable: false
	});
}

module.exports = _protected;