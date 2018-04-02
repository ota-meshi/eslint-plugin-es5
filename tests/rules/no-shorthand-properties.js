'use strict';

module.exports = {
  valid: [
    'var foo = { bar: 1 };',
    'var foo = { bar: function () {} };'
  ],
  invalid: [
    {
      code: 'var foo = { bar };',
      output: 'var foo = { bar: bar };',
      errors: [{ message: 'Unexpected object shorthand property.' }]
    },
    {
      code: 'var foo = { bar() {} };',
      output: 'var foo = { bar: function() {} };',
      errors: [{ message: 'Unexpected object shorthand property.' }]
    },
    {
      code: 'var foo = { bar(a) {} };',
      output: 'var foo = { bar: function(a) {} };',
      errors: [{ message: 'Unexpected object shorthand property.' }]
    },
    {
      code: 'var foo = { *[bar]() {} };',
      output: 'var foo = { [bar]: function*() {} };',
      errors: [{ message: 'Unexpected object shorthand property.' }]
    },
    {
      code: 'var foo = { /*1*/ * /*2*/ [ /*3*/ bar /*4*/ ] /*5*/ () /*6*/ { /*7*/ } /*8*/ };',
      output: 'var foo = { /*1*/  /*2*/ [ /*3*/ bar /*4*/ ] /*5*/ : function*() /*6*/ { /*7*/ } /*8*/ };',
      errors: [{ message: 'Unexpected object shorthand property.' }]
    }
  ]
};
