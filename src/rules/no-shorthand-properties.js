'use strict';

module.exports = {
  meta: {
    docs: {
      description: 'Forbid shorthand properties'
    },
    fixable: 'code',
    schema: []
  },
  create(context) {
    const sourceCode = context.getSourceCode()
    return {
      Property(node) {
        if (node.shorthand || node.method) {
          context.report({
            node,
            message: 'Unexpected object shorthand property.',
            fix: node.shorthand ?
              fixer => fixer.insertTextAfter(node.key, `: ${node.key.name}`) :
              node.value.generator ? 
              fixer => {
                const asterisk = sourceCode.getTokens(node).find(token => token.type === 'Punctuator' && token.value === "*")
                const text = sourceCode.text
                const keyText = text.slice(node.range[0], asterisk.range[0]) + text.slice(asterisk.range[1], node.value.range[0])
                const replacement = `${keyText}: ${node.value.async ? 'async ' : ''}function*`
                return fixer.replaceTextRange([node.range[0], node.value.range[0]], replacement)
              } :
              fixer => fixer.insertTextBefore(node.value, `: ${node.value.async ? 'async ' : ''}function`)
          });
        }
      }
    };
  }
};
