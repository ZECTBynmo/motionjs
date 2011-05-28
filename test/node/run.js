var suites = [
  '/test/shared/tests/client',
];

if (process.argv.length > 2) {
  suites.map(function(suite) {
    if (suite.indexOf(process.argv[2]) > -1) {
      require('nodeunit/reporters/default').run([suite]);
    }
  });
} else {
  require('nodeunit/reporters/default').run(suites);
}


exports['calculate'] = function (test) {
    test.equal(doubled.calculate(2), 4);
    test.done();
};