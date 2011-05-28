motion = (typeof motion === 'undefined')        ?
          require(__dirname + '/../../../index') :
          motion;

if (typeof exports !== 'undefined') {
  var motionTests = exports
}

exports.calculate = function (t) {
  t.done()
};
