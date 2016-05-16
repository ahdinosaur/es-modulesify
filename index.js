const os = require('os')
const through = require('through2')
const falafel = require('falafel')
const cid = require('cuid')

module.exports = esModulesify

function esModulesify (filename, options) {
  options = options || {}

  const bufs = []

  // for each buffer in file
  function transform (buf, enc, next) {
    // push buffer to list of buffers
    bufs.push(buf)
    next()
  }

  var modules = {}
  // after done reading file
  function flush () {
    // concat list of buffers into a single string
    const src = Buffer.concat(bufs).toString('utf8')
    // find all require calls
    const ast = falafel(src, {
      ecmaVersion: 6,
      sourceType: 'module'
    }, onNode)

    //this.push(getImportStatements(modules))
    this.push(ast.toString())
    this.push(null)
  }

  function onNode (node) {
    if (isRequire(node)) {
      onRequire(node)
    } else if (isModuleExports(node)) {
      onModuleExports(node)
    }
  }

  function onRequire (node) {
    var moduleName = node.arguments[0].value
    var variableName
    // if node is variable declaration with no function call
    if (node.parent.type === 'VariableDeclarator') {
      const variableDeclarator = node.parent
      const variableDeclaration = node.parent.parent
      // move up to top-level import
      variableName = node.parent.id.name
      modules[moduleName] = variableName
      variableDeclaration.update(0)
    }
    // else node is changed to variable
    else {
      // hash of ast node?
      variableName = cid()
      modules[moduleName] = variableName
      node.update(variableName)
    }
  }

  function onModuleExports (node) {
    exportDefault(node)
  }

  return through(transform, flush)
}

function isRequire (node) {
  return node.type === 'CallExpression'
    && node.callee.type === 'Identifier'
    && node.callee.name === 'require'
}

function isModuleExports (node) {
  return node.type === 'AssignmentExpression'
    && node.operator === '='
    && node.left.type === 'MemberExpression'
    && node.left.property.type === 'Identifier'
    && node.left.property.name === 'exports'
    && node.left.object.type === 'Identifier'
    && node.left.object.name === 'module'
}

// ported from https://github.com/jonbretman/amd-to-as6/blob/7d37a1dadae6dcd82b2b0ea9ffa15ffe5c9d94a8/index.js#L144-L158
function getImportStatements (modules) {
  return Object.keys(modules).map(function (moduleName) {
    const variableName = modules[moduleName]
    if (!variableName) {
      return `import ${moduleName}`
    }
    else {
      return `import ${variableName} from '${moduleName}'`
    }
  }).join(os.EOL) + '\n'
}

function exportDefault (node) {
  // hmm, why doesn't this work?
  node.update(
    node.source()
    .replace(
      'module.exports =',
      'export default'
    )
  )
}
