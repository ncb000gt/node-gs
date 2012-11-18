gs
=====

[![Build Status](https://secure.travis-ci.org/ncb000gt/node-gs.png)](http://travis-ci.org/#!/ncb000gt/node-gs)

NodeJS wrapper for `gs`


Usage
=====

    var gs = require('gs');
    gs()
      .batch()
      .output()
      .input(input)
      .exec(function(err, data) {
        console.log(data.toString());
      });


API
=====

* `batch`
* `nopause`
* `device` - device - defaults to `txtwrite`
* `output` - file - defaults to `-` which represents stdout
* `input` - file
* `exec` - callback


License
=====

MIT - http://ncb000gt.mit-license.org/
