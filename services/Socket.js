const { js2xml, xml2json } = require('xml-js');

const Service = require('./Service');

class Socket extends Service {
	constructor(options) {
		super(options);
		this.socket = null;
	}

	open(url) {
		if (this.socket) {
			this.socket.onclose = () => {};
			this.socket.close();
			this.emit('close');
		}
		this.socket = new WebSocket(url);
		this.socket.onopen = ()=> this.emit('open');
		this.socket.onmessage = message => this.emit('message', JSON.parse(xml2json(message.data, { compact: true })));
		this.socket.onerror = error => this.emit('error', error);
		this.socket.onclose = () => this.emit('close');
	}

	send(xmlObject) {
		this.socket.send(js2xml(xmlObject, { compact: true }));
	}

	close() {
		this.socket.close();
	}

}

module.exports = Socket;