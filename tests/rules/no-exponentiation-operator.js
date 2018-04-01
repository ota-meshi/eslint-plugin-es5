'use strict';

module.exports = {
  valid: [
    'a * b',
    'var foo = a * b;'
  ],
  invalid: [
    {
      code: 'a ** b',
      output: 'Math.pow(a, b)',
      errors: [{ message: 'Unexpected exponentiation operator.' }]
    },
    {
      code: 'var foo = a ** b',
      output: 'var foo = Math.pow(a, b)',
      errors: [{ message: 'Unexpected exponentiation operator.' }]
    },
    {
      code: 'a **= b',
      output: 'a = Math.pow(a,b)',
      errors: [{ message: 'Unexpected exponentiation operator.' }]
    },
    //
    {
      code: '1 + 2 ** 3 ** 4 + 5',
      output: '1 + Math.pow(2, Math.pow(3, 4)) + 5',
      errors: [{ message: 'Unexpected exponentiation operator.' }, { message: 'Unexpected exponentiation operator.' }]
    },
    {
      code: '1 * 2 ** 3 ** 4 * 5',
      output: '1 * Math.pow(2, Math.pow(3, 4)) * 5',
      errors: [{ message: 'Unexpected exponentiation operator.' }, { message: 'Unexpected exponentiation operator.' }]
    },
    {
      code: '(1 + 2) ** 3 ** (4 + 5)',
      output: 'Math.pow((1 + 2), Math.pow(3, (4 + 5)))',
      errors: [{ message: 'Unexpected exponentiation operator.' }, { message: 'Unexpected exponentiation operator.' }]
    },
    {
      code: '1 * (2 ** 3) ** (4 * 5)',
      output: '1 * Math.pow((Math.pow(2, 3)), (4 * 5))',
      errors: [{ message: 'Unexpected exponentiation operator.' }, { message: 'Unexpected exponentiation operator.' }]
    },
    {
      code: '1 * /*a*/2 ** 3 ** (/*b*/4 * 5)',
      output: '1 * /*a*/Math.pow(2, Math.pow(3, (/*b*/4 * 5)))',
      errors: [{ message: 'Unexpected exponentiation operator.' }, { message: 'Unexpected exponentiation operator.' }]
    },
    {
      code: `
var a = 1 * 2 ** 3 ** 
    (4 * 5) ** 6
`,
      output: `
var a = 1 * Math.pow(2, Math.pow(3, 
    Math.pow((4 * 5), 6)))
`,
      errors: [
      { message: 'Unexpected exponentiation operator.' },
      { message: 'Unexpected exponentiation operator.' },
      { message: 'Unexpected exponentiation operator.' }]
    },
    {
      code: 'a **= b + c',
      output: 'a = Math.pow(a,b + c)',
      errors: [{ message: 'Unexpected exponentiation operator.' }]
    },
    {
      code: 'a **= (b + c)',
      output: 'a = Math.pow(a,(b + c))',
      errors: [{ message: 'Unexpected exponentiation operator.' }]
    },
    {
      code: 'a **= /*1*/b + c/*2*/',
      output: 'a = Math.pow(a,/*1*/b + c)/*2*/',
      errors: [{ message: 'Unexpected exponentiation operator.' }]
    },
  ]
};
