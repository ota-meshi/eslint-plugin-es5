'use strict'
const fs = require('fs')
const path = require('path')
const plugin = require('../src/index');

const readmeFilePath = path.resolve(__dirname, '../README.md')
const readmeText = fs.readFileSync(readmeFilePath, 'utf8')

const readmeErrors = []
Object.keys(plugin.rules).forEach((ruleName) => {
  const ruleId = `es5/${ruleName}`
  const rule = plugin.rules[ruleName]
  if (readmeText.indexOf(`\n  - \`${ruleId}\``) < 0) {
    readmeErrors.push(`There is no description of the \`${ruleId}\` rule.
Please add as follows.
  - \`${ruleId}\`: description.`)
  } else if (readmeText.indexOf(`\n  - \`${ruleId}\`${rule.meta.fixable ? ':wrench:' : ''}:`) < 0) {
    readmeErrors.push(`\`${ruleId}\` rule does not match fixable.
Please modify as follows.
  - \`${ruleId}\`${rule.meta.fixable ? ':wrench:' : ''}:`)
  }
  if (!rule.meta.docs || !rule.meta.docs.description) {
    console.error(`Empty meta.docs.description. \`${ruleId}\``)// eslint-disable-line
  }
})

if (readmeErrors.length) {
  console.error(readmeErrors.join('\n'))// eslint-disable-line
  process.exit(1)
}