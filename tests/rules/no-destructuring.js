'use strict';

module.exports = {
  valid: [
    'var foo = [];',
    'var foo = {}',
    'function foo(bar) {}'
  ],
  invalid: [
    { code: 'var [ foo ] = [];', output: null, errors: [{ message: 'Unexpected destructuring.' }] },
    { code: 'var { foo } = {};', output: null, errors: [{ message: 'Unexpected destructuring.' }] },
    { code: 'function foo([ bar ]) {}', output: null, errors: [{ message: 'Unexpected destructuring.' }] },
    { code: 'function foo({ bar }) {}', output: null, errors: [{ message: 'Unexpected destructuring.' }] },
    // ObjectPattern 
    {
      code: 'var { a } = foo;',
      output: 'var a=foo.a;',
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'let { a, b } = foo;',
      output: 'let a=foo.a,b=foo.b;',
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var { a: aa, b: bb } = foo, c = d;',
      output: 'var aa=foo.a,bb=foo.b, c = d;',
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var { a: {a1, a2: aa2} } = foo;',
      output: 'var a1=foo.a.a1,aa2=foo.a.a2;',
      errors: [{ message: 'Unexpected destructuring.' }, { message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var { "s-u-b": {1: a, ["b"]: b} } = foo;',
      output: 'var a=foo["s-u-b"][1],b=foo["s-u-b"]["b"];',
      errors: [{ message: 'Unexpected destructuring.' }, { message: 'Unexpected destructuring.' }]
    },
    {
      code: '({ a: {a1: aa1} } = foo, { b: {b1: bb1} } = bar);',
      output: '(aa1=foo.a.a1, bb1=bar.b.b1);',
      errors: [{ message: 'Unexpected destructuring.' }, { message: 'Unexpected destructuring.' }, { message: 'Unexpected destructuring.' }, { message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var { a, b } = { a:1, b:2 };',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var { [a]: a } = foo;',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var { a = 1 } = foo;',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var { a } = foo.bar().baz;',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: '({ a } = foo.bar().baz)',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var { a } = foo();',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    // ArrayPattern
    {
      code: 'var [ a ] = foo;',
      output: 'var a=foo[0];',
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'const [ a, b ] = foo;',
      output: 'const a=foo[0],b=foo[1];',
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var [,, a,, b ] = foo;',
      output: 'var a=foo[2],b=foo[4];',
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: '([ a ] = foo);',
      output: '(a=foo[0]);',
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var [, a, [b], [c], d] = foo',
      output: 'var a=foo[1],b=foo[2][0],c=foo[3][0],d=foo[4]',
      errors: [{ message: 'Unexpected destructuring.' }, { message: 'Unexpected destructuring.' }, { message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var [ a, b ] = [ 1, 2 ];',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var [ ,,, ] = foo;',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var [ a = 1 ] = foo;',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var [ a ] = foo.bar().baz;',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: '([ a ] = foo.bar().baz)',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var [a] = foo();',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    // mix
    {
      code: 'var [{a1:aa1}] = foo;',
      output: 'var aa1=foo[0].a1;',
      errors: [{ message: 'Unexpected destructuring.' }, { message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var {a : [a1]} = foo;',
      output: 'var a1=foo.a[0];',
      errors: [{ message: 'Unexpected destructuring.' }, { message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var [{a1:aa1 = 1}] = foo;',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }, { message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var {a : [a1 = 1]} = foo;',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }, { message: 'Unexpected destructuring.' }]
    },
    // assignment-expression
    {
      code: 'console.log([x] = foo);',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'console.log(([x] = foo));',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'console.log((([x] = foo)));',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    // chained
    {
      code: '({ a, b } = ({ c, d } = foo));',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }, { message: 'Unexpected destructuring.' }]
    },
    {
      code: '({ a, b } = ((({ c, d } = foo))));',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }, { message: 'Unexpected destructuring.' }]
    },
    // null
    {
      code: 'var {} = null;',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var {a, b} = null;',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    // other literal
    {
      code: 'var {a, b} = "null";',
      output: 'var a="null".a,b="null".b;',
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var {} = "abc";',
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var {a, b} = true;',
      output: 'var a=true.a,b=true.b;',
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var {a, b} = "abc";',
      output: 'var a="abc".a,b="abc".b;',
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var {a, b} = 123;',
      output: 'var a=123.a,b=123.b;',
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: 'var {a, b} = this;',
      output: 'var a=this.a,b=this.b;',
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    // export
    {
      code: `export let {a, b, c} = foo;`,
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: `export let {a, b, c: {d, e: {f}}} = foo;`,
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }, { message: 'Unexpected destructuring.' }, { message: 'Unexpected destructuring.' }]
    },
    {
      code: `export default {a, b, c} = foo;`,
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    // for
    {
      code: `
for (var [name, value] in obj) {
  //
}
      `,
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: `
for (let [ i, n ] = range; ; ) {
  //
}
      `,
      output: `
for (let i=range[0],n=range[1]; ; ) {
  //
}
      `,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: `
for (var [ a, b, c ] of test.test) {
}
      `,
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    {
      code: `
for (let i = 0, { length } = list; i < length; i++) {
  //
}
      `,
      output: `
for (let i = 0, length=list.length; i < length; i++) {
  //
}
      `,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    // rest
    {
      code: `
var z = [];
var [x, ...y] = z;
      `,
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
    // nesting
    {
      code: `[foo.foo, foo.bar] = arr;`,
      output: null,
      errors: [{ message: 'Unexpected destructuring.' }]
    },
  ]
};
