# Calculadora

Calculadora estática no navegador, com teclado visual, visor editável e parser aritmético próprio. Não executa código JavaScript digitado no visor.

Abra `index.html` ou `home/index.html` em um navegador moderno. Não há instalação ou backend. O layout responsivo segue os frames de resultado, erro e mobile criados no Figma; fontes DM Sans e Space Grotesk são locais, com licenças OFL.

## Operações

- Soma, subtração, multiplicação e divisão, respeitando precedência.
- Parênteses e sinais unários em expressões digitadas.
- Ponto ou vírgula como separador decimal; notação científica.
- **Enter / =** no visor calcula; **Escape** ou o botão **C** limpa.
- Teclas de parênteses, separador decimal e apagar; seleção do visor pode ser substituída ou removida.
- Expressões incompletas, caracteres não permitidos e divisão por zero mostram erro; o próximo número inicia uma nova expressão.
- Após um resultado, digitar um operador permite continuar a conta.

`js/index.js` contém o parser e as funções de controle. O parser limita a expressão a 256 caracteres e a profundidade de agrupamento; não usa `eval`, `Function` ou acesso a propriedades. HTML sem handlers inline, estilos com tokens em `styles/` e assets locais em `assets/` formam a aplicação. O visor tem rótulo, histórico da expressão, mensagens de erro anunciadas e foco visível.

```sh
node --test tests/calculator.test.cjs
node tools/build.mjs
```

Quatro testes cobrem precedência, decimais, sinais, parênteses, inteiros grandes, erros, recuperação do visor e tentativas de executar JavaScript. A avaliação usa números de precisão dupla do JavaScript; resultados fracionários são apresentados com até doze dígitos significativos. Não é uma biblioteca de aritmética decimal exata.

O build opcional copia somente os arquivos de runtime revisados para `dist/` e rejeita arquivos estranhos já presentes nesse destino. `home/index.html` permanece compatível. Nenhum serviço externo ou variável de ambiente é necessário.

Licença MIT em `LICENSE`. Licenças das fontes ficam em `assets/fonts/`. Memória técnica: `docs/ai-context/QUALITY_REFRESH.md`.
