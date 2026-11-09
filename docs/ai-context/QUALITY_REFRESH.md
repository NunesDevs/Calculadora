# Memória técnica — revisão de qualidade

Revisão: 2026-11-08. Este arquivo descreve o código validado nesta rodada; inventários automáticos anteriores registram estados históricos.

Interface estática aplicada dos frames Figma 45:272 (resultado), 45:422 (erro) e 45:560 (mobile); Key 45:271. Fontes locais DM Sans/Space Grotesk sob OFL e ícone vetorial exportado do Figma. Parser recursivo próprio (sem eval/Function), precedência, sinais, parênteses e decimais; limite 256 caracteres/profundidade 32, divisão por zero e resultados não finitos rejeitados. Precisão dupla JS; fracionários apresentados com 12 dígitos significativos. Teclado, seleção, apagar, continuação do resultado e mensagens anunciadas funcionam. Quatro testes Node e passagem real Playwright em oito larguras passaram. Ambas entradas index.html e home/index.html verificadas. Build opcional copia só allowlist para dist; sem dependências de produção ou serviços externos. Destino web público pode usar GitHub Pages.

Validações: comandos de teste do README, execução local sem dados reais, git diff --check e revisão dos arquivos antes do commit. Push/integração/publicação têm autorização explícita do titular nesta sessão. Nenhuma migração, seed ou serviço de produção foi executado.
