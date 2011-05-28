/*
var data = {};
var handle = server(10,
  function validate(commands, fn) {
    // For simplicity's sake, always return true
    fn([], commands);
  },
  function apply(fn) {
    return function(rejected, accepted) {
      // last chance to resolve rejected patches
      // and apply patches to data

      // the final array of patches that will be sent
      // to the client
      fn(accepted);
    }
  },
  function packet(tick, deltas) {
    // send the deltas to the client.
    // this would be a good time to merge as many patches
    // as possible to speed up transport (save bandwidth)
    socket.io.broadcast({
     tick   : tick,
     deltas : delta
    });
  }
);

socket.io.on('message', function(msg) { handle(msg); });
*/

(function(exports) {
  exports.server = function server(rate, validate, apply, callback, patches, tick, obj) {
    tick = 0;
    patches = [];

    setInterval(function() {
      tick++;
      // splice does exactly what we need here
      // reset the current snapshots to []
      // and return a copy.
      // push the collected patches out
      callback(tick, patches.splice(0));
    }, rate);

    // Provide a way to pump new diffs into the system
    return function(diffs) {
      validate(diffs, apply(function(accepted) {
        // merge the latest changeset with the
        // existing
        patches = patches.concat(accepted);
      }));
    };
  }
})(typeof module === 'undefined' ? window.motion = window.motion || {}: module.exports);