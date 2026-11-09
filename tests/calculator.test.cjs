const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { calculateExpression } = require('../js/index.js');

test('arithmetic honors precedence, signs, parentheses and decimal separators', () => {
  for (const [expression, expected] of [['2+3*4', 14], ['(2+3)*4', 20], ['-2*-3', 6], ['1,5 + .5', 2], ['0.1+0.2', 0.3], ['1e+3/2', 500], ['1234567890123+1', 1234567890124], ['-0', 0]]) {
    assert.equal(calculateExpression(expression), expected);
  }
});

test('invalid arithmetic and division by zero are rejected', () => {
  for (const expression of ['', '1/0', '1+', '(1+2', '1 2', '1,2.3', 'Infinity', '1e999', '2**3', '('.repeat(40) + '1' + ')'.repeat(40), '1'.repeat(257)]) {
    assert.throws(() => calculateExpression(expression), Error, expression);
  }
});

test('untrusted input cannot execute JavaScript', () => {
  globalThis.calculatorExecuted = false;
  for (const expression of ['globalThis.calculatorExecuted=true', 'process.exit()', 'alert(1)', '1;globalThis.calculatorExecuted=true', 'constructor.constructor("return process")()']) {
    assert.throws(() => calculateExpression(expression));
  }
  assert.equal(globalThis.calculatorExecuted, false);
  delete globalThis.calculatorExecuted;
});

test('DOM controls recover after an error and support chained calculations', () => {
  const input = { value: '1/0', validity: '', setCustomValidity(v) { this.validity = v; }, setAttribute() {}, removeAttribute() {} };
  const context = { document: { getElementById: () => input } };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../js/index.js'), 'utf8'), context);
  assert.equal(context.solucao(), null);
  assert.equal(input.value, 'Erro');
  context.display('2');
  context.display('+');
  context.display('3');
  assert.equal(context.solucao(), 5);
  context.display('*');
  context.display('2');
  assert.equal(context.solucao(), 10);
  context.display('7');
  assert.equal(input.value, '7');
  context.clearScreen();
  assert.equal(input.value, '');
  assert.equal(input.validity, '');
});
