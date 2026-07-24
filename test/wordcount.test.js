'use strict';

const assert = require('assert');
const { countWords, countCharacters, analyse, stripComment } = require('../wordcount');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ok  ${name}`);
  } catch (err) {
    failed++;
    console.error(`FAIL  ${name}`);
    console.error(`      ${err.message}`);
  }
}

test('counts plain words', () => {
  assert.strictEqual(countWords('one two three'), 3);
});

test('ignores line comments', () => {
  assert.strictEqual(countWords('hello world % this is ignored'), 2);
});

test('keeps escaped percent signs', () => {
  assert.strictEqual(countWords('a 50\\% increase'), 3);
});

test('does not count commands', () => {
  assert.strictEqual(countWords('\\textbf hello'), 1);
});

test('counts braced argument text by default', () => {
  assert.strictEqual(countWords('\\section{Introduction to LaTeX}'), 3);
});

test('drops braced argument text when disabled', () => {
  assert.strictEqual(
    countWords('\\section{Introduction to LaTeX} body', {
      countBracedArguments: false,
    }),
    1
  );
});

test('ignores optional command arguments', () => {
  assert.strictEqual(countWords('\\documentclass[12pt]{article} text'), 1);
});

test('ignores inline maths', () => {
  assert.strictEqual(countWords('the value $x = y + 1$ here'), 3);
});

test('ignores display maths', () => {
  assert.strictEqual(countWords('before \\[ a + b = c \\] after'), 2);
});

test('ignores verbatim environments', () => {
  const src = 'text \\begin{verbatim}\nlots of code here\n\\end{verbatim} more';
  assert.strictEqual(countWords(src), 2);
});

test('handles a small document', () => {
  const src = [
    '\\documentclass{article}',
    '% a comment line',
    '\\begin{document}',
    'Hello there, brave new world.',
    '\\end{document}',
  ].join('\n');
  assert.strictEqual(countWords(src), 5);
});

test('ignores labels, refs and citations', () => {
  assert.strictEqual(
    countWords('See \\ref{fig:one} in \\cite{smith2020} please'),
    3
  );
});

test('does not count package or class names', () => {
  assert.strictEqual(
    countWords('\\documentclass{article}\\usepackage{amsmath}text'),
    1
  );
});

test('keeps the text argument of two-argument commands', () => {
  assert.strictEqual(countWords('\\textcolor{red}{very important text}'), 3);
});

test('counts characters without spaces', () => {
  // "hello" (5) + "world" (5) = 10, command and comment excluded.
  assert.strictEqual(countCharacters('\\textbf hello world % x'), 10);
});

test('character count keeps punctuation', () => {
  // "Hi," -> H i , = 3, "there." -> t h e r e . = 6  => 9
  assert.strictEqual(countCharacters('Hi, there.'), 9);
});

test('analyse returns both counts from one pass', () => {
  assert.deepStrictEqual(analyse('one two three'), {
    words: 3,
    characters: 11,
  });
});

test('stripComment leaves escaped percent alone', () => {
  assert.strictEqual(stripComment('100\\% done % note'), '100\\% done ');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed === 0 ? 0 : 1);
