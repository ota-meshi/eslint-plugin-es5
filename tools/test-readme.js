'use strict'
const fs = require('fs')
const path = require('path')

const RULES_ROOT = path.resolve(__dirname, '../src/rules')
const rules = fs.readdirSync(RULES_ROOT)
  .filter(file => path.extname(file) === '.js')
  .map(file => path.basename(file, '.js'))
  .map(name => ({
    ruleId: `es5/${name}`,
    name,
    meta: require(path.join(RULES_ROOT, name)).meta
  }))

const readmeFilePath = path.resolve(__dirname, '../README.md')
const readmeText = fs.readFileSync(readmeFilePath, 'utf8')

const readmeErrors = []
rules.forEach((rule) => {
  if (readmeText.indexOf(`\n  - \`${rule.ruleId}\``) < 0) {
    readmeErrors.push(`There is no description of the \`${rule.ruleId}\` rule.
Please add as follows.
  - \`${rule.ruleId}\`: description.`)
  } else if (readmeText.indexOf(`\n  - \`${rule.ruleId}\`${rule.meta.fixable ? ':wrench:' : ''}:`) < 0) {
    readmeErrors.push(`\`${rule.ruleId}\` rule does not match fixable.
Please modify as follows.
  - \`${rule.ruleId}\`${rule.meta.fixable ? ':wrench:' : ''}:`)
  }
  if (!rule.meta.docs || !rule.meta.docs.description) {
    console.error(`Empty meta.docs.description. \`${rule.ruleId}\``)// eslint-disable-line
  }
})

if (readmeErrors.length) {
  console.error(readmeErrors.join('\n'))// eslint-disable-line
  process.exit(1)
}