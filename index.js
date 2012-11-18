var spawn = require('child_process').spawn;

function gs() {
  return {
    "options": [],
    "inputs": [],
    "batch": function() {
      this.options.push('-dBATCH');
      return this;
    },
    "nopause": function() {
      this.options.push('-dNOPAUSE');
      return this;
    },
    "device": function(dev) {
      dev = dev || 'txtwrite';
      this.options.push('-sDEVICE=' + dev);
      return this;
    },
    "inputs": function(files) {
      if (!(files instanceof Array)) files = [files];

      this.inputs = files;
      return this;
    },
    "output": function(file) {
      file = file || '-';
      this.options.push('-sOutputFile=' + file);
      return this;
    },
    "exec": function(cb) {
      var proc = spawn('gs', this.options.concat(this.inputs));
      proc.stdin.on('error', cb);
      proc.stdout.on('error', cb);

      var _data = [];
      var totalBytes = 0;
      proc.stdout.on('data', function(data) { totalBytes += data.length; _data.push(data); });
      proc.on('close', function() {
        return cb(null, Buffer.concat(_data, totalBytes));
      });
    }
  };
}

module.exports = exports = gs;
