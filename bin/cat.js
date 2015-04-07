var fs = require('fs')
var path = require('path')
var pump = require('pump')
var ndjson = require('ndjson')
var openDat = require('../lib/open-dat.js')

module.exports = {
  name: 'cat',
  command: handleCat,
  options: [
    {
      name: 'format',
      boolean: false,
      abbr: 'f'
    },
    {
      name: 'greater-than',
      boolean: false,
      abbr: 'gt'
    },
    {
      name: 'less-than',
      boolean: false,
      abbr: 'lt'
    }
  ]
}

function handleCat (args) {
  if (args.help) return usage()
  openDat(args, function ready (err, db) {
    if (err) abort(err)
  
    var readStream = db.createReadStream({gt: args.gt, lt: args.lt})
  
    pump(readStream, ndjson.serialize(), process.stdout, function done (err) {
      if (err) abort(err, 'dat: cat error')
    })
  })
}

function abort (err, message) {
  if (message) console.error(message)
  if (err) throw err
  process.exit(1)
}

function usage () {
  console.error(fs.readFileSync(path.join(__dirname, '..', 'usage', 'cat.txt')).toString())
}
