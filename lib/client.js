/*
  TODO: allow for interpolation!

  Requirements:
   * local pendingPatches
   * tick interval
     * send queue to server
     * concat queue to transmittedPatches
   * revert function([patch, patch])
   * apply function([patch, patch])
   * handle method function([patch, patch, patch])
    * calls revert on pendingPatches
    * calls revert on appliedPatches
    * calls apply([patch, patch, patch])
    * calls apply(appliedPatches)
    * calls apply(pendingPatches)

var handle = client(10,
  function revert(patches, fn) {
    // defines how to revert a group of patches

    // It is completely feasable to need to do some
    // async work while reverting, which is why the
    // callback exists.

    // it is also feasable that some patches may not revert
    // successfully (although, probably rare).
    // Arguments:
    // 1. patches to drop [array]
    // 2. patches to keep [array]
    fn([],[]);
  },
  function compare(patch, patch) {
    // or false, depending on whether the patches are the same object
    // This should not be an identity comparison as these will most
    // likely contain a mix origins (server, user input)
    return true;
  },
  function apply(patches, fn) {
    // defines how to apply a group of patches

    // the callback takes 2 arrays
    // Arguments
    // 1. patches that failed to apply [array]
    // 2. patches that were applied successfully [array]
    fn([], patches);
  },
  function emit(patches) {
    // this method is used to get the queue of 
    // input patches that the client has to the 
    // server
    socket.io.send(patches);
  }
});

handle.local(patches);
handle.remote(patches);
*/
module.exports = function client(rate, revert, apply, compare, emit) {
  var
  pendingPatches = [],
  transmittedPatches =[];
  
  comparator = comparator || function() { return true; };

  setInterval(function tick() {
    transmittedPatches = transmittedPatches.concat(pendingPatches);
    emit(pendingPatches.splice(0));
  }, rate);

  return {
    local  : function(patch) {
      pendingPatches.push(patch);
    },
    remote : function(patches) {
      var localPatches = transmittedPatches.concat(pendingPatches);
      // take us back to a saner time
      revert(localPatches, function(drop, keep) {

        var patchesToApply = patches.concat(keep);

        apply(patchesToApply, function(dropped, kept) {
          var patchesToRemove = dropped.concat(dropped, patches);

          transmittedPatches = transmittedPatches.filter(compare);
          pendingPatches = pendingPatches.filter(compare);

        });
      });
    }
  };
}
