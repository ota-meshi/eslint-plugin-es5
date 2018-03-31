'use strict';

module.exports = {
  valid: [
    'var foo = { bar: baz };',
    'foo[bar] = baz;'
  ],
  invalid: [
    {
      code: 'var foo = { [bar]: baz };',
      output: `var foo={};foo[bar]=baz;`,
      errors: [{ message: 'Unexpected computed property.' }]
    },
    {
      code:
        `
        var obj = {
          ["x" + foo]: "heh",
          ["y" + bar]: "noo",
          foo: "foo",
          bar: "bar"
        };
        `,
      output:
        `
        var obj={};
obj["x" + foo]="heh";
obj["y" + bar]="noo";
obj['foo']="foo";
obj['bar']="bar";
        `,
      errors: [{ message: 'Unexpected computed property.' }, { message: 'Unexpected computed property.' }]
    },
    {
      code: 'var foo = { [bar]: baz }  /**/',
      output: `var foo={};foo[bar]=baz  /**/`,
      errors: [{ message: 'Unexpected computed property.' }]
    },
    {
      code: '(foo = { [bar]: baz });',
      output: null,
      errors: [{ message: 'Unexpected computed property.' }]
    },
    {
      code: 'var foo = { [bar]: baz, get a() {return 1} };',
      output: null,
      errors: [{ message: 'Unexpected computed property.' }]
    },
    {
      code: 'foo = { a:a, [bar]: baz, b:b, "c": c };',
      output: `foo={};foo['a']=a;foo[bar]=baz;foo['b']=b;foo["c"]=c;`,
      errors: [{ message: 'Unexpected computed property.' }]
    },
    {
      code: `var foo = {
        a(){},
        [bar]: baz,
        b,c: () => {}, d: 123, e: f};`,
      output:
`var foo={};
foo['a']=function(){};
foo[bar]=baz;
foo['b']=b;foo['c']=() => {};foo['d']=123;foo['e']=f;`,
      errors: [{ message: 'Unexpected computed property.' }]
    },
    {
      code: 'var foo = bar = { ["baz"]: baz };',
      output: `var foo = bar={};bar["baz"]=baz;`,
      errors: [{ message: 'Unexpected computed property.' }]
    },
    {
      code: 'foo = (bar = { ["baz"]: "baz" }, 1);',
      output: null,
      errors: [{ message: 'Unexpected computed property.' }]
    },
    {
      code: `
var a = { [a1]: a2 }
var b = { [b1]: b2 }
`,
      output:
`
var a={};a[a1]=a2
var b={};b[b1]=b2
`,
      errors: [{ message: 'Unexpected computed property.' }, { message: 'Unexpected computed property.' }]
    },
    {
      code: `() => { return { [a]: b } }`,
      output: null,
      errors: [{ message: 'Unexpected computed property.' }]
    },
    {
      code: `() => ({ [a]: b })`,
      output: null,
      errors: [{ message: 'Unexpected computed property.' }]
    },
  ]
};
