/*
var data = {};
var handle = server(10,
  function apply(patches, fn) {
    // the final array of patches that will be sent
    // to the client
    fn([], accepted);
  },
  function packet(tick, deltas) {
    // send the deltas to the client.
    // this would be a good time to merge as many patches
    // as possible to speed up transport (save bandwidth)
    socket.io.broadcast({
     tick   : tick,
     deltas : deltas
    });
  }
);

socket.io.on('message', function(msg) { handle(msg); });
*/

(function(exports) {
  exports.server = function server(rate, apply, callback) {
    var tick = 0,  patches = [];

    var ticker = setInterval(function() {

      tick++;
      // splice does exactly what we need here
      // reset the current snapshots to []
      // and return a copy.
      // push the collected patches out
      callback(tick, patches.splice(0));
    }, rate);

    // Provide a way to pump new diffs into the system
    return {
      add : function(diffs) {
        apply(diffs, function(rejected, accepted) {
          // merge the accepted changes
          patches = patches.concat(accepted);
        });
      },
      stop : function() {
        clearInterval(ticker);
      }
    };
  }
})(typeof module === 'undefined' ? window.motion = window.motion || {}: module.exports);