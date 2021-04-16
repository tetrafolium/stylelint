'use strict';

const standalone = require('../../../standalone');
const {messages, ruleName, meta} = require('..');

it('warns that the rule is deprecated', () => {
  const config = {
    rules : {
      [ruleName] : [],
    },
  };

  const code = '';

  return standalone({code, config}).then((output) => {
    const result = output.results[0];

    expect(result.deprecations).toHaveLength(1);
    expect(result.deprecations[0].text)
        .toEqual(
            `'${ruleName}' has been deprecated. Instead use 'property-disallowed-list'.`,
        );
    expect(result.deprecations[0].reference)
        .toEqual(
            `https://github.com/stylelint/stylelint/blob/13.7.0/lib/rules/${
                ruleName}/README.md`,
        );
  });
});

it('also warns that the rule is deprecated via a meta', () => {
  expect(meta).not.toBeUndefined();
  expect(meta).toHaveProperty('deprecated', true);
});

testRule({
  ruleName,

  config : [ '' ],

  accept : [
    {
      code : 'a { color: pink; }',
    },
  ],
});

testRule({
  ruleName,

  config : [ [] ],

  accept : [
    {
      code : 'a { color: pink; }',
    },
  ],
});

testRule({
  ruleName,

  config : [ 'transform', 'background-size' ],

  accept : [
    {
      code : 'a { color: pink; }',
    },
    {
      code : 'a { background: red; }',
    },
    {
      code : 'a { top: 0; color: pink; }',
    },
    {
      code : 'a { $scss: 0; }',
    },
    {
      code : 'a { @less: 0; }',
    },
    {
      code : 'a { --custom-property: 0; }',
    },
  ],

  reject : [
    {
      code : 'a { transform: scale(1); }',
      message : messages.rejected('transform'),
      line : 1,
      column : 5,
    },
    {
      code : 'a { color: pink; background-size: cover; }',
      message : messages.rejected('background-size'),
      line : 1,
      column : 18,
    },
    {
      code : 'a { color: pink; -webkit-transform: scale(1); }',
      message : messages.rejected('-webkit-transform'),
      line : 1,
      column : 18,
    },
  ],
});

testRule({
  ruleName,

  config : [ [ '/^background/' ] ],

  accept : [
    {
      code : 'a { color: pink; }',
    },
    {
      code : 'a { no-background: sure; }',
    },
    {
      code : 'a { $scss: 0; }',
    },
    {
      code : 'a { @less: 0; }',
    },
    {
      code : 'a { --custom-property: 0; }',
    },
  ],

  reject : [
    {
      code : 'a { background: pink; }',
      message : messages.rejected('background'),
      line : 1,
      column : 5,
    },
    {
      code : 'a { background-size: cover; }',
      message : messages.rejected('background-size'),
      line : 1,
      column : 5,
    },
    {
      code : 'a { background-image: none; }',
      message : messages.rejected('background-image'),
      line : 1,
      column : 5,
    },
  ],
});

testRule({
  ruleName,

  config : [ [ /^background/] ],

  accept : [
    {
      code : 'a { color: pink; }',
    },
  ],

  reject : [
    {
      code : 'a { background-size: cover; }',
      message : messages.rejected('background-size'),
      line : 1,
      column : 5,
    },
  ],
});

testRule({
  ruleName,

  config : [ '/margin/' ],

  accept : [
    {
      code : 'a { $margin: 0; }',
    },
    {
      code : 'a { @margin: 0; }',
    },
    {
      code : 'a { --margin: 0; }',
    },
  ],
});
