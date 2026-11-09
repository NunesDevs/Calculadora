'use strict';

function calculateExpression(expression) {
    if (typeof expression !== 'string' || expression.length > 256) throw new Error('Expressão muito longa');
    const tokens = [];
    const pattern = /\s*(?:(\d+(?:[.,]\d*)?|[.,]\d+)(?:[eE]([+-]?\d+))?|([()+\-*/]))/y;
    let offset = 0;
    while (offset < expression.length) {
        if (!expression.slice(offset).trim()) break;
        pattern.lastIndex = offset;
        const token = pattern.exec(expression);
        if (!token) throw new Error('Use apenas números e operadores aritméticos');
        offset = pattern.lastIndex;
        tokens.push(token[1] ? Number(token[1].replace(',', '.') + (token[2] ? 'e' + token[2] : '')) : token[3]);
    }
    if (!tokens.length) throw new Error('Digite uma expressão');
    let index = 0;
    function finite(value) {
        if (!Number.isFinite(value)) throw new Error('Resultado fora do limite numérico');
        return value;
    }
    function factor(depth) {
        if (depth > 32) throw new Error('Expressão muito complexa');
        const token = tokens[index++];
        if (typeof token === 'number') return finite(token);
        if (token === '+' || token === '-') return finite((token === '-' ? -1 : 1) * factor(depth + 1));
        if (token === '(') {
            const value = sum(depth + 1);
            if (tokens[index++] !== ')') throw new Error('Feche os parênteses');
            return value;
        }
        throw new Error('Expressão incompleta');
    }
    function product(depth) {
        let value = factor(depth);
        while (tokens[index] === '*' || tokens[index] === '/') {
            const operator = tokens[index++];
            const right = factor(depth);
            if (operator === '/' && right === 0) throw new Error('Não é possível dividir por zero');
            value = finite(operator === '*' ? value * right : value / right);
        }
        return value;
    }
    function sum(depth) {
        let value = product(depth);
        while (tokens[index] === '+' || tokens[index] === '-') {
            const operator = tokens[index++];
            const right = product(depth);
            value = finite(operator === '+' ? value + right : value - right);
        }
        return value;
    }
    const result = sum(0);
    if (index !== tokens.length) throw new Error('Separe os números com um operador');
    // Preserve integer results; trim display noise only for fractional results.
    if (Object.is(result, -0)) return 0;
    return Number.isInteger(result) ? result : Number(result.toPrecision(12));
}

let finished = false;
function feedback(message, expression = null) {
    const status = document.getElementById('feedback');
    const history = document.getElementById('history');
    if (status) status.textContent = message;
    if (history && expression !== null) history.textContent = expression.replaceAll('*', '×').replaceAll('/', '÷') + (expression ? ' =' : '');
}
function clearValidity(input) {
    input.setCustomValidity('');
    input.removeAttribute('aria-invalid');
}
function display(value) {
    const input = document.getElementById('result');
    if (!/^[0-9.,()+\-*/]$/.test(value)) return;
    if (finished && /^[0-9.,(]$/.test(value)) input.value = '';
    if (input.value === 'Erro') input.value = '';
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    if (input.value.length - (end - start) < 256) {
        if (input.setRangeText) input.setRangeText(value, start, end, 'end');
        else input.value += value;
    }
    finished = false;
    clearValidity(input);
    feedback('Digite a expressão e calcule.');
    return value;
}
function solucao() {
    const input = document.getElementById('result');
    const expression = input.value;
    try {
        const result = calculateExpression(expression);
        input.value = String(result).replace('.', ',');
        clearValidity(input);
        feedback('Resultado calculado: ' + input.value + '.', expression);
        finished = true;
        return result;
    } catch (error) {
        input.value = 'Erro';
        input.setCustomValidity(error.message);
        input.setAttribute('aria-invalid', 'true');
        feedback(error.message + '.', expression);
        finished = true;
        return null;
    }
}
function clearScreen() {
    const input = document.getElementById('result');
    input.value = '';
    clearValidity(input);
    finished = false;
    feedback('Digite a expressão e calcule.', '');
}
function backspace() {
    const input = document.getElementById('result');
    if (finished || input.value === 'Erro') { clearScreen(); return; }
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    if (input.setRangeText) input.setRangeText('', start === end ? Math.max(0, start - 1) : start, end, 'end');
    else input.value = input.value.slice(0, -1);
    clearValidity(input);
    feedback('Digite a expressão e calcule.');
}
if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('DOMContentLoaded', () => {
        const input = document.getElementById('result');
        input.maxLength = 256;
        input.addEventListener('input', () => { finished = false; clearValidity(input); feedback('Digite a expressão e calcule.'); });
        document.querySelector('.keys').addEventListener('click', event => {
            const button = event.target.closest('button');
            if (!button) return;
            if (button.dataset.action === 'clear') clearScreen();
            else if (button.dataset.action === 'backspace') backspace();
            else if (button.dataset.action === 'calculate') solucao();
            else display(button.dataset.value);
        });
        input.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === '=') { event.preventDefault(); solucao(); }
            if (event.key === 'Escape') { event.preventDefault(); clearScreen(); }
        });
        document.addEventListener('keydown', event => {
            if (event.target === input || event.ctrlKey || event.metaKey || event.altKey) return;
            if (/^[0-9.,()+\-*/]$/.test(event.key)) { event.preventDefault(); input.focus(); display(event.key); }
            else if (event.key === 'Escape') { event.preventDefault(); clearScreen(); }
        });
    });
}
if (typeof module !== 'undefined' && module.exports) module.exports = { calculateExpression };
