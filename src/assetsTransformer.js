const path = require('path')

// mock static asset modules
module.exports = {
  process(src, filename, config, options) {
    return `module.exports = ${JSON.stringify(path.basename(filename))};`
  },
}
