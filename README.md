# Calculadora

Calculadora no navegador com teclado visual, operações aritméticas e limpeza do visor.

## Funcionalidades verificadas

- Teclado numérico e operadores.
- Visor editável.
- Limpeza e avaliação da expressão.

## Operação e arquitetura verificadas

Página estática home/index.html, estilos em styles e funções DOM em js/index.js. Não há backend ou dependências de build.

Arquivos principais: `home/index.html`, `js/index.js`.

### Requisitos e execução

Navegador moderno; sem instalação.

Abra home/index.html no navegador.

### Testes e estado

Não foi identificada uma suíte automatizada específica para os fluxos descritos; valide a execução e os casos de borda antes de publicar.

Estado: projeto de estudo/experimental. Deploy ativo não foi confirmado nesta revisão.

### Limitações conhecidas

- A avaliação ainda utiliza eval; substituir por parser aritmético antes de integrar conteúdo não confiável.
- Expressões inválidas não têm tratamento de erro.

### Licença e manutenção

Nenhum arquivo de licença foi identificado nesta revisão; não foi adicionada uma nova licença. Atualize comandos e limitações quando houver mudança de comportamento.
