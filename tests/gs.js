var gs = require('../index')
		assert = require('assert');

describe('gs', function() {

	describe('#batch', function() {
		it('should set batch option', function(done) {
			assert.deepEqual(gs().batch().options, ['-dBATCH']);
			done();
		});
	});

	describe('#nopause', function() {
		it('should set nopause option', function(done) {
			assert.deepEqual(gs().nopause().options, ['-dNOPAUSE']);
			done();
		});
	});

	describe('#device', function() {
		it('should set device option with default', function(done) {
			assert.deepEqual(gs().device().options, ['-sDEVICE=txtwrite']);
			done();
		});
		it('should set device option with value', function(done) {
			assert.deepEqual(gs().device('bacon').options, ['-sDEVICE=bacon']);
			done();
		});
	});

	describe('#output', function() {
		it('should set output option with default', function(done) {
			assert.deepEqual(gs().output().options, ['-sOutputFile=-', '-q']);
			done();
		});
		it('should set output option with value', function(done) {
			assert.deepEqual(gs().output('bacon').options, ['-sOutputFile=bacon']);
			done();
		});
	});

	describe('#input', function() {
		it('should set inputs with file', function(done) {
			assert.deepEqual(gs().input('file')._input, 'file');
			done();
		});
	});

	describe('#define', function() {
		it('should set definition with value', function(done) {
			assert.deepEqual(gs().define('FirstPage', 1).options, ['-dFirstPage=1']);
			done();
		});
	});

	describe('#resolution / #res / #r', function() {
		it('should set device resolution', function(done) {
			assert.deepEqual(gs().res(240, 72).options, ['-r240x72']);
			done();
		});
	});

	describe('#papersize', function() {
		it('should set the paper size', function(done) {
			assert.deepEqual(gs().papersize('a4').options, ['-sPAPERSIZE=a4']);
			done();
		});
	});

	describe('#safer', function() {
		it('should set gs to run in safe mode', function(done) {
			assert.deepEqual(gs().safer().options, ['-dSAFER']);
			done();
		});
	});

	describe('#quiet / #q', function() {
		it('should tell gs to be quiet', function(done) {
			assert.deepEqual(gs().q().options, ['-q']);
			done();
		});
	});

	describe('#currentDirectory / #p', function() {
		it('should tell gs to use current directory for libraries first', function(done) {
			assert.deepEqual(gs().p().options, ['-p']);
			done();
		});
	});

	describe('#command', function() {
		it('should tell gs to interpret PostScript code', function(done) {
			assert.deepEqual(gs().command('quit').options, ['-c', 'quit']);
			done();
		});
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

	describe('#page', function() {
		it('should tell gs to process single page', function(done) {
			gs()
				.nopause()
				.input('./tests/pdfs/sizes.pdf')
				.output('./test/pdfs/sizes-%d.jpg')
				.page(2)
				.on('pages', function(from, to){
					assert.equal(from, 2);
					assert.equal(to, 2);
					done();
				})
				.exec(function(err, data){
				});
		});
	});

	describe('#pages', function() {
		it('should tell gs to process page range', function(done) {
			gs()
				.nopause()
				.input('./tests/pdfs/sizes.pdf')
				.output('./test/pdfs/sizes-%d.jpg')
				.pages(1, 2)
				.on('pages', function(from, to){
					assert.equal(from, 1);
					assert.equal(to, 2);
					done();
				})
				.exec(function(err, data){
				});
		});
	});

	describe('#pagecount', function() {
		it('should return number of pages', function(done) {
			gs()
				.input('./tests/pdfs/sizes.pdf')
				.pagecount(function(err, count){
					assert.ok(!err);
					assert.equal(count, 3);

					done();
				})
		});
	});

	describe('events', function() {
		it('should emit `data` event', function(done) {
			gs()
				.q()
				.nodisplay()
				.input('./tests/pdfs/sizes.pdf')
				.on('data', function(data) {
					assert.equal(data, 'GS>');
					done();
				})
				.exec(function(err, data){
				});
		});
		it('should emit `pages` event', function(done) {
			gs()
				.input('./tests/pdfs/sizes.pdf')
				.output('./test/pdfs/sizes-%d.jpg')
				.on('pages', function(from, to) {
					assert.equal(from, 1);
					assert.equal(to, 3);

					done();
				})
				.exec(function(err, data){
				});
		});
		it('should emit `page` event', function(done) {
			var count = 0;
			gs()
				.device('jpeg')
				.output('tests/sizes-%d.jpg')
				.batch()
				.nopause()
				.input('./tests/pdfs/sizes.pdf')
				.on('page', function(page) {
					if ( page ) count++;
				})
				.on('close', function() {
					if ( count == 3 ) {
						done();
					}
				})
				.exec(function(err, data){
				});
		});
		after(function(done){
			require('child_process').exec('rm tests/sizes-*.jpg', function(err,stdout,stderr){
				if (err) return done(err);
				done();
			});
		});
	});
});
