'use strict';

module.exports = {
  valid: [
    'test.testMethod()',
    'test.otherTestMethod()',
    'test[find](x => x == 3)',
    '$.find(x => x == 3);',
    '$(array).find(x => x == 3);',
    '$(array).filter(active => active).find(x => x == 3);',
    '_.find(array, x => x == 3);',
    '_(array).find(x => x == 3);',
    '_(array).filter(active => active).find(x => x == 3);',
    'jquery.find(array, x => x == 3);',
    'jQuery(array).find(x => x == 3);',
    'JQuery(array).filter(active => active).find(x => x == 3);',
    '$array.find(x => x == 3);',
    '$array.find(x => x == 3);',
    '$array.filter(active => active).find(x => x == 3);',
    'this.$array.find(x => x == 3);',
    'this.$array.find(x => x == 3);',
    'this.$array.filter(active => active).find(x => x == 3);',
    `
var a = $(array)
a.find(x => x == 3)
    `,
    `
var a = $(array)
{
  let a = get()
}
a.find(x => x == 3)
    `,
    `
let a = get()
{
  const a = $(array)
  a.find(x => x == 3)
}
a.test()
    `,
    `
var a = $()
var b = a.find(x => x == 3)
b.find(x => x == 3)
    `,`
var a = $()
a = a.find(x => x == 3)
a.find(x => x == 3)
    `,
  ],
  invalid: [
    { code: '[1, 2, 3].find(x => x == 3);', errors: [{ message: 'ES6 methods not allowed: find' }] },
    { code: '[0, 0, 0].fill(7, 1);', errors: [{ message: 'ES6 methods not allowed: fill' }] },
    { code: 'v.find(array, x => x == 3);', errors: [{ message: 'ES6 methods not allowed: find' }] },
    { code: 'v(array).find(x => x == 3);', errors: [{ message: 'ES6 methods not allowed: find' }] },
    { code: 'v(array).filter(active => active).find(x => x == 3);', errors: [{ message: 'ES6 methods not allowed: find' }] },
    { code: 'this[$array].find(array, x => x == 3);', errors: [{ message: 'ES6 methods not allowed: find' }] },
    { code: 'this[$array](array).find(x => x == 3);', errors: [{ message: 'ES6 methods not allowed: find' }] },
    { code: 'this[$array](array).filter(active => active).find(x => x == 3);', errors: [{ message: 'ES6 methods not allowed: find' }] },
    {
      code: `
var a = get()
a.find(x => x == 3)
      `,
      errors: [{ message: 'ES6 methods not allowed: find' }]
    },
    {
      code: `
var a = $()
a = get()
a.find(x => x == 3)
      `,
      errors: [{ message: 'ES6 methods not allowed: find' }]
    },
    {
      code: `
{
  let a = $()
  a.find(x => x == 3)
  function fn() {
    a = get()
  }
}
      `,
      errors: [{ message: 'ES6 methods not allowed: find' }]
    },
  ]
};
