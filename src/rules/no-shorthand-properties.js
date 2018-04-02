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
    function makeFunctionLongform(fixer, node) {
        const firstKeyToken = node.computed ? sourceCode.getTokens(node).find(token => token.value === "[") : sourceCode.getFirstToken(node.key);
        const lastKeyToken = node.computed ? sourceCode.getTokensBetween(node.key, node.value).find(token => token.value === "]") : sourceCode.getLastToken(node.key);
        const keyText = sourceCode.text.slice(firstKeyToken.range[0], lastKeyToken.range[1]);
        let functionHeader = "function";

        if (node.value.generator) {
            functionHeader = "function*";
        } else if (node.value.async) {
            functionHeader = "async function";
        }

        return fixer.replaceTextRange([node.range[0], lastKeyToken.range[1]], `${keyText}: ${functionHeader}`);
    }
    return {
      Property(node) {
        if (node.shorthand || node.method) {
          context.report({
            node,
            message: 'Unexpected object shorthand property.',
            fix: node.shorthand ?
              fixer => fixer.insertTextAfter(node.key, `: ${node.key.name}`) :
              fixer => makeFunctionLongform(fixer, node)
          });
        }
      }
    };
  }
};
