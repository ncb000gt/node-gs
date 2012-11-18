gs
=====

NodeJS wrapper for `gs`


Usage
=====

    var gs = require('gs');
    gs()
      .batch()
      .output()
      .inputs([files])
      .exec(function(err, data) {
        console.log(data.toString());
      });


API
=====

* `batch`
* `nopause`
* `device` - device - defaults to `txtwrite`
* `output` - file - defaults to `-` which represents stdout
* `inputs` - file or files
* `exec` - callback


License
=====

MIT - http://ncb000gt.mit-license.org/
