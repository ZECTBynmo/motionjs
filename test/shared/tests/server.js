motion = (typeof motion === 'undefined')        ?
          require(__dirname + '/../../../index') :
          motion;

var noop = function() {};

module.exports = {
  'SANITY: test tick rate' : function(t) {
    var handle = motion.server(1, noop, noop, function(tick, patches) {
      t.ok(tick === 1);
      t.ok(patches.length === 0);
      handle.stop();
      t.done();
    });
  }
};