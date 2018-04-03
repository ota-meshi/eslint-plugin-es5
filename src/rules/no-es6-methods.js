'use strict';

function isIgnoreName(name, options) {
  if (options.ignoreNamePatterns &&
    options.ignoreNamePatterns.some(r => r.test(name))) {
    return true
  }
  if (options.ignoreNames &&
    options.ignoreNames.indexOf(name) >= 0) {
    return true
  }
  return false
}

/**
 * It checks whether it is a Node which is not subject to verification
 * @param  {Node} node Check target Node
 * @param  {Variable[]} variables declared variables
 * @param  {Object} options option
 * @param  {Object} [verified] Array of verified Nodes
 * @return {Boolean} is ignore
 */
function isIgnore(node, variables, options, verified) {
  verified = verified || []
  if (!node) {
    return false
  }
  if (verified.indexOf(node) >= 0) {
    // ignore
    return true
  }
  verified.push(node)
  if (node.type === 'CallExpression') {
    return isIgnore(node.callee, variables, options, verified)
  }
  if (node.type === 'MemberExpression') {
    if (node.computed) {
      // unknown name
      return false
    }
    if (node.property.type === 'Identifier') {
      if (isIgnoreName(node.property.name, options)) {
        return true
      }
    }
    return isIgnore(node.object, variables, options, verified)
  }
  if (node.type === 'Identifier') {
    if (isIgnoreName(node.name, options)) {
      return true
    }
    const roots = findVariableWriteExpressions(node, variables)
    return (roots && roots.length) ? roots.every(node => isIgnore(node, variables, options, verified)) : false
  }
  return false
}

/**
 * Find for expressions in which variables are written
 * @param  {Identifier} node Identifier Node
 * @param  {Variable[]} variables declared variables
 * @return {Node[]} Reference#writeExpr list
 */
function findVariableWriteExpressions(node, variables) {
  for (const variable of variables) {
    const index = variable.references.findIndex(reference => reference.identifier === node)
    if (index >= 0) {
      return variable.references.map((reference, i) => {
        if (index === i) {
          return null
        }
        return reference.writeExpr
      }).filter(writeExpr => writeExpr)
    }
  }
  return null
}

function parseOptions (options) {
  const opt = Object.assign({
    'ignoreNames': ['_', '$', 'jQuery', 'jquery', 'JQuery'],
    'ignoreNamePatterns': ['^\\$.*', '^_\\$.*'],
  }, options)

  if (opt.ignoreNamePatterns && opt.ignoreNamePatterns.length) {
    opt.ignoreNamePatterns = opt.ignoreNamePatterns.map(ptn => new RegExp(ptn));
  }
  return opt
}

module.exports = {
  meta: {
    docs: {
      description: 'Forbid methods added in ES6'
    },
    schema: [{
      type: 'object',
      properties: {
        'ignoreNames': {
          type: 'array',
          items: {
            allOf: [
              { type: 'string' },
            ]
          },
        },
        'ignoreNamePatterns': {
          type: 'array',
          items: {
            allOf: [
              { type: 'string' },
            ]
          },
        }
      },
      additionalProperties: false
    }]
  },
  create(context) {
    const options = parseOptions(context.options[0])
    const variables = []
    return {
      VariableDeclaration(node) {
        context.getDeclaredVariables(node).forEach(n => variables.push(n))
      },
      CallExpression(node) {
        if (node.callee.type !== 'MemberExpression' || node.callee.computed || node.callee.property.type !== 'Identifier') {
          return
        }
        const functionName = node.callee.property.name;

        const es6ArrayFunctions = [
          'find',
          'findIndex',
          'copyWithin',
          'values',
          'fill'
        ];
        const es6StringFunctions = [
          'startsWith',
          'endsWith',
          'includes',
          'repeat'
        ];

        const es6Functions = [].concat(
          es6ArrayFunctions,
          es6StringFunctions
        );
        if(es6Functions.indexOf(functionName) > -1) {
          if (isIgnore(node, variables, options)) {
            return
          }
          context.report({
            node: node.callee.property,
            message: 'ES6 methods not allowed: ' + functionName
          });
        }
      }
    };
  }
};
