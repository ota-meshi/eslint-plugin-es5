'use strict';

function isSimpleAssignmentLeft(node) {
  if (!node) {
    return false
  }
  if (node.type === 'Identifier' || node.type === 'Literal' || node.type === 'ThisExpression') {
    return true
  }
  if (node.type === 'MemberExpression') {
    return isSimpleAssignmentLeft(node.object) && isSimpleAssignmentLeft(node.property)
  }
  return false
}

function isFixableProperties(node) {
  if (node.type !== 'ObjectExpression') {
    return false
  }
  return node.properties.every(p => p.kind === 'init')
}

function noSideEffect(node, sourceCode) {
  const next = sourceCode.getTokenAfter(node)
  if (!next) {
    return true
  }
  if (next.type === 'Punctuator' && next.value === ',') {
    return false
  }
  if (next.type === 'Punctuator' && next.value === ')') {
    return false
  }
  return true
}

function isFixable(node, sourceCode) {
  if (!noSideEffect(node, sourceCode)) {
    return false
  }
  if (node.type === 'VariableDeclarator') {
    if (!isFixableProperties(node.init)) {
      return false
    }
    if (!isSimpleAssignmentLeft(node.id)) {
      return false
    }
    return true
  } else if (node.type === 'AssignmentExpression') {
    if (!isFixableProperties(node.right)) {
      return false
    }
    if (!isSimpleAssignmentLeft(node.left)) {
      return false
    }
    return true
  }
  return false
}
function getPropertyKeyText(node, sourceCode) {
  const key = node.key
  if (node.computed) {
    return sourceCode.getText(key)
  }
  if (node.shorthand) {
    return `'${key.name}'`
  }
  if (key.type === 'Identifier') {
    return `'${key.name}'`
  } else {
    return sourceCode.getText(key)
  }
}

function getPropertyValueText(node, sourceCode) {
  const value = node.value
  if (node.method) {
    return `${value.async ? 'async ' : ''}function${value.generator ? '*' : ''}${sourceCode.getText(value)}`
  }
  return sourceCode.getText(value)
}

function getTextProperties(node, sourceCode) {
  let lastLine = node.loc.start.line
  return node.properties.map(p => {
    const lineBreaks = p.loc.end.line - lastLine
    lastLine = p.loc.end.line
    return {
      keyText: getPropertyKeyText(p, sourceCode),
      text: getPropertyValueText(p, sourceCode),
      lineBreaks,
    }
  })
}

function toPropertyAssignments(node, sourceCode) {
  let left
  let props
  if (node.type === 'VariableDeclarator') {
    left = sourceCode.getText(node.id)
    props = getTextProperties(node.init, sourceCode)
  } else if (node.type === 'AssignmentExpression') {
    left = sourceCode.getText(node.left)
    props = getTextProperties(node.right, sourceCode)
  }
  return `${left}={};${props.map(p => {
    return `${'\n'.repeat(p.lineBreaks)}${left}[${p.keyText}]=${p.text}`
  }).join(';')}`
}

module.exports = {
  meta: {
    docs: {
      description: 'Forbid computed properties.'
    },
    fixable: 'code',
    schema: []
  },
  create(context) {
    const sourceCode = context.getSourceCode()
    return {
      Property(node) {
        if (node.computed) {
          context.report({
            node,
            message: 'Unexpected computed property.',
            fix(fixer) {
              const target = node.parent && node.parent.parent
              if (!target || !isFixable(target, sourceCode)) {
                return undefined
              }
              return fixer.replaceText(target, toPropertyAssignments(target, sourceCode))
            }
          });
        }
      }
    };
  }
};
