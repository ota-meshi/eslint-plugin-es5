'use strict';

module.exports = {
  meta: {
    docs: {
      description: 'Forbid exponentiation operator'
    },
    fixable: 'code',
    schema: []
  },
  create(context) {
    const sourceCode = context.getSourceCode()
    function text(node) {
      return sourceCode.getText(node)
    }
    function textRange(start, end) {
      return sourceCode.text.slice(start, end)
    }

    function exponentiationBinaryExpressionToMathPow(node) {
      if (node.type === 'BinaryExpression' && node.operator === '**') {
          const opNode = sourceCode.getTokenAfter(node.left, (t) => t.type === 'Punctuator' && t.value === '**')
          let leftText = ''
          leftText += textRange(node.range[0], node.left.range[0])
          leftText += exponentiationBinaryExpressionToMathPow(node.left)
          leftText += textRange(node.left.range[1], opNode.range[0])
          let rightText = ''
          rightText += textRange(opNode.range[1], node.right.range[0])
          rightText += exponentiationBinaryExpressionToMathPow(node.right)
          rightText += textRange(node.right.range[1], node.range[1])
          return `Math.pow(${leftText.replace(/\s+$/g,'')},${rightText})`
      }
      return text(node)
    }
    return {
      BinaryExpression(node) {
        if (node.operator === '**') {
          context.report({
            node,
            message: 'Unexpected exponentiation operator.',
            fix(fixer) {
              return fixer.replaceText(node, exponentiationBinaryExpressionToMathPow(node))
            }
          });
        }
      },
      AssignmentExpression(node) {
        if (node.operator === '**=') {
          context.report({
            node,
            message: 'Unexpected exponentiation operator.',
            fix(fixer) {
              const opNode = sourceCode.getTokenAfter(node.left, (t) => t.type === 'Punctuator' && t.value === '**=')
              const rightStart = sourceCode.getTokenAfter(opNode, {includeComments: true})
              const range = [opNode.range[0], node.range[1]]
              const spaces = textRange(opNode.range[1], rightStart.range[0])
              const replacement = `=${spaces}Math.pow(${text(node.left)},${textRange(rightStart.range[0], node.range[1])})`
              return fixer.replaceTextRange(range, replacement)
            }
          });
        }
      }
    };
  }
};
