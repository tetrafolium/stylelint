'use strict';

const standalone = require('../../../standalone');
const {messages, ruleName, meta} = require('..');

it('warns that the rule is deprecated', () => {
  const config = {
    rules : {
      [ruleName] : [ 'hover' ],
    },
  };

  const code = '';

  return standalone({code, config}).then((output) => {
    const result = output.results[0];

    expect(result.deprecations).toHaveLength(1);
    expect(result.deprecations[0].text)
        .toEqual(
            `'${ruleName}' has been deprecated. Instead use 'selector-pseudo-class-allowed-list'.`,
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
  config : [ 'hover', 'nth-child', 'root', 'placeholder', 'has' ],
  skipBasicChecks : true,

  accept : [
    {
      code : 'a {}',
    },
    {
      code : 'a:hover {}',
    },
    {
      code : 'a:nth-child(5) {}',
    },
    {
      code : ':root {}',
    },
    {
      code : 'a:has(#id) {}',
    },
    {
      code : 'a:hover, a:nth-child(5) {}',
    },
    {
      code : 'a::before {}',
    },
    {
      code : 'a:nth-child(5)::before {}',
    },
    {
      code : 'a:-moz-placeholder {}',
    },
    {
      code : ':root { --foo: 1px; }',
      description : 'custom property in root',
    },
    {
      code : 'html { --foo: 1px; }',
      description : 'custom property in selector',
    },
    {
      code : ':root { --custom-property-set: {} }',
      description : 'custom property set in root',
    },
    {
      code : 'html { --custom-property-set: {} }',
      description : 'custom property set in selector',
    },
  ],

  reject : [
    {
      code : 'a:HOVER {}',
      message : messages.rejected('HOVER'),
      line : 1,
      column : 2,
    },
    {
      code : 'a:-MOZ-PLACEholder {}',
      message : messages.rejected('-MOZ-PLACEholder'),
      line : 1,
      column : 2,
    },
    {
      code : 'a:focus {}',
      message : messages.rejected('focus'),
      line : 1,
      column : 2,
    },
    {
      code : 'div:nth-LAST-child {}',
      message : messages.rejected('nth-LAST-child'),
      line : 1,
      column : 4,
    },
    {
      code : 'a,\n:global {}',
      message : messages.rejected('global'),
      line : 2,
      column : 1,
    },
    {
      code : 'input:-ms-input-placeholder {}',
      message : messages.rejected('-ms-input-placeholder'),
      line : 1,
      column : 6,
    },
    {
      code : 'input:-Ms-INPUT-placeholder {}',
      message : messages.rejected('-Ms-INPUT-placeholder'),
      line : 1,
      column : 6,
    },
    {
      code : 'a:not(::selection) {}',
      message : messages.rejected('not'),
      line : 1,
      column : 2,
    },
  ],
});

testRule({
  ruleName,
  config : [ [ '/^nth/' ] ],
  skipBasicChecks : true,

  accept : [
    {
      code : 'a {}',
    },
    {
      code : 'a:nth-child(5) {}',
    },
    {
      code : 'a:nth-LAST-child {}',
    },
  ],

  reject : [
    {
      code : 'a:hover {}',
      message : messages.rejected('hover'),
      line : 1,
      column : 2,
    },
  ],
});

testRule({
  ruleName,
  config : [ [ /^nth/] ],
  skipBasicChecks : true,

  accept : [
    {
      code : 'a {}',
    },
  ],

  reject : [
    {
      code : 'a:hover {}',
      message : messages.rejected('hover'),
      line : 1,
      column : 2,
    },
  ],
});

testRule({
  ruleName,
  config : [ 'hover' ],
  skipBasicChecks : true,
  syntax : 'scss',

  accept : [
    {
      code : ':#{$variable} {}',
    },
    {
      code : ':#{$VARIABLE} {}',
    },
    {
      code : 'a:#{$variable} {}',
    },
  ],
});
