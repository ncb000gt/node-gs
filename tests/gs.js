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
    assert.deepEqual(gs().output().options, ['-sOutputFile=-']);
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
          assert.equal(data, "Page 1\n               Normal\r\nPage 2\n           Envelope\r\nPage 3\n     Landscape\r\n");

          done();
        });
    });
  });
});
