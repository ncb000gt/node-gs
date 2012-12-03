var gs = require('../index'),
    assert = require('assert');

describe('gs', function() {
  it('should set batch option', function(done) {
    assert.deepEqual(gs().batch().options, ['-dBATCH']);
    done();
  });
  it('should set nopause option', function(done) {
    assert.deepEqual(gs().nopause().options, ['-dNOPAUSE']);
    done();
  });
  it('should set device option with default', function(done) {
    assert.deepEqual(gs().device().options, ['-sDEVICE=txtwrite']);
    done();
  });
  it('should set device option with value', function(done) {
    assert.deepEqual(gs().device('bacon').options, ['-sDEVICE=bacon']);
    done();
  });
  it('should set output option with default', function(done) {
    assert.deepEqual(gs().output().options, ['-sOutputFile=-', '-q']);
    done();
  });
  it('should set output option with value', function(done) {
    assert.deepEqual(gs().output('bacon').options, ['-sOutputFile=bacon']);
    done();
  });
  it('should set inputs with file', function(done) {
    assert.deepEqual(gs().input('file')._input, 'file');
    done();
  });
  it('should set definition with value', function(done) {
    assert.deepEqual(gs().define('FirstPage', 1).options, ['-dFirstPage=1']);
    done();
  });
  it('should set device resolution', function(done) {
    assert.deepEqual(gs().res(240, 72).options, ['-r240x72']);
    done();
  });
	it('should set the paper size', function(done) {
    assert.deepEqual(gs().papersize('a4').options, ['-sPAPERSIZE=a4']);
    done();
	});
	it('should set gs to run in safe mode', function(done) {
    assert.deepEqual(gs().safer().options, ['-dSAFER']);
    done();
	});
	it('should tell gs to be quiet', function(done) {
		assert.deepEqual(gs().q().options, ['-q']);
		done();
	});
	it('should tell gs to use current directory for libraries first', function(done) {
		assert.deepEqual(gs().p().options, ['-p']);
		done();
	});

  describe('#exec', function() {
    it('should pass an error for no inputs', function(done) {
      gs()
        .batch()
        .nopause()
        .device()
        .output()
        .exec(function(err, data) {
          assert.ok(err);
          assert.ok(!this._input);
          assert.equal(err, 'No input specified');

          done();
        });
    });
    it('should display data from a file', function(done) {
      gs()
        .batch()
        .nopause()
        .device()
        .output()
        .input('./tests/pdfs/sizes.pdf')
        .exec(function(err, data) {
          assert.ok(!err);
          assert.equal(this._input, './tests/pdfs/sizes.pdf');
          assert.equal(data, "               Normal\r\n           Envelope\r\n     Landscape\r\n");

          done();
        });
    });
  });
});
