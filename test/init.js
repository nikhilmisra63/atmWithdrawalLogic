before(async () => {
  global.expect = require('chai').expect;
  global.assert = require('chai').assert;

  require('../index');
});

after(async () => {
  // timeout for istanbul & nyc
  setTimeout(() => {
    process.exit(0);
  }, 100);
});
