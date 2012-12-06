var spawn = require('child_process').spawn,
	EventEmitter = require('events').EventEmitter;

module.exports = exports = create;

function create() {
	var _gs = new gs();
	return _gs;
}

function gs() {
	this.options = [];
	this._input = null;
}

gs.prototype.__proto__ = EventEmitter.prototype;

gs.prototype.batch = function() {
	this.options.push('-dBATCH');
	return this;
};

gs.prototype.diskfonts = function() {
	this.options.push('-dDISKFONTS');
	return this;
};

gs.prototype.nobind = function() {
	this.options.push('-dNOBIND');
	return this;
};

gs.prototype.nocache = function() {
	this.options.push('-dNOCACHE');
	return this;
};

gs.prototype.nodisplay = function() {
	this.options.push('-dNODISPLAY');
	return this;
};

gs.prototype.nopause = function() {
	this.options.push('-dNOPAUSE');
	return this;
};

gs.prototype.command = function(cmd) {
	this.options.push('-c', cmd.replace(/(\s)/g,'\ '));
	return this;
};

gs.prototype.define = function(key, val) {
	this.options.push('-d' + key + (val ? '=' + val : ''));
	return this;
};

gs.prototype.device = function(dev) {
	dev = dev || 'txtwrite';
	this.options.push('-sDEVICE=' + dev);
	return this;
};

gs.prototype.input = function(file) {
	this._input = file;
	return this;
};

gs.prototype.output = function(file) {
	file = file || '-';
	this.options.push('-sOutputFile=' + file);
	if (file === '-') return this.q();
	return this;
};

gs.prototype.quiet = function() {
	this.options.push('-q');
	return this;
};

gs.prototype.q = gs.prototype.quiet;

gs.prototype.currentDirectory = function() {
	this.options.push('-p');
	return this;
};

gs.prototype.p = gs.prototype.currentDirectory;

gs.prototype.papersize = function(size) {
	this.options.push('-sPAPERSIZE=' + size);
	return this;
};

gs.prototype.resolution = function(xres, yres) {
	this.options.push('-r' + xres + (yres ? 'x' + yres : ''));
	return this;
};

gs.prototype.res = gs.prototype.r = gs.prototype.resolution;

gs.prototype.reset = function() {
	this.options = [];
	this._input = null;
	return this;
};

gs.prototype.safer = function() {
	this.options.push('-dSAFER');
	return this;
};

gs.prototype.exec = function(cb) {
	var self = this;
	if (!this._input) return cb.call(self, 'No input specified');

	var proc = spawn('gs', this.options.concat([this._input]));
	proc.stdin.on('error', cb);
	proc.stdout.on('error', cb);

	var _data = [];
	var totalBytes = 0;

	proc.stdout.on('data', function(data) {
		totalBytes += data.length;
		_data.push(data);
		var str = data.toString();

		self.emit('data', data.toString());

		if ( str.match(/Processing pages (.*) through (.*)\./) ) {
			self.emit('pages', RegExp.$1, RegExp.$2);
		}

		if ( str.match(/Page (.*)/) ) {
			self.emit('page', RegExp.$1);
		}
	});

	proc.on('close', function() {
		var buf = Buffer.concat(_data, totalBytes);

		cb.call(self, null, buf.toString());
		return self.emit('close');
	});

	process.on('exit', function() {
		proc.kill();
		self.emit('exit');
	});
};

gs.prototype.page = function(page) {
	return this.define('FirstPage', page).define('LastPage', page);
};

gs.prototype.pages = function(from, to) {
	return this.define('FirstPage', from).define('LastPage', to);
};

gs.prototype.pagecount = function(cb) {
	var self = this;
	if (!this._input) return cb.call(self, 'No input specified');

	this.q()
		.command('(' + this._input + ') (r) file runpdfbegin pdfpagecount = quit')
		.exec(function(err, data){
			if (err) return cb.call(self, err);
			return cb.call(self, null, data);
		});
};

