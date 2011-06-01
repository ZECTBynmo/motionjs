motion = (typeof motion === 'undefined')        ?
          require(__dirname + '/../../../index') :
          motion;

var noop = function() {};

module.exports = {
  'SANITY: test tick rate' : function(t) {
    var handle = motion.server(1, noop, function(tick, patches) {
      t.ok(tick === 1);
      t.ok(patches.length === 0);
      handle.stop();
      t.done();
    });
  },
 'test merging' :  function(t) {
    var  data   = {}

    var handle = motion.server(1, 
      function apply(patches, fn) {
        var i=0, l=patches.length, patch;
        for (i; i<l; i++) {
          patch = patches[i];
          data[patch.key] = patch.value;
        }
        fn([], patches);
      }, function(tick, patches) {
        if (patches.length > 0) {
          t.ok(patches[0].key === 'abc');
          handle.stop();
          t.done();
        }
    });

    handle.add([{
      key   : 'abc',
      value : 123
    }]);
  }
};