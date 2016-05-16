const test = require('tape')

const esModulesify = require('../')

test('es-modulesify', function(t) {
  t.ok(esModulesify, 'module is require-able')
  t.end()
})
