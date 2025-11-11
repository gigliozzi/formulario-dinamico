# Formulário com Visualizador de Impressão em Tempo Real

Projeto front‑end simples (HTML + Tailwind via CDN + Vue 3) que implementa:

- Layout 40%/60% (Formulário / Visualizador)
- Atualização em tempo real do “PDF” de visualização por meio de placeholders `{{campo}}`
- Botões: Salvar (localStorage), Imprimir, Imprimir em branco e Novo formulário
- Mock de "endpoint" para Templates usando `localStorage` (crie novos modelos pelo botão "Novo Template")

## Como executar

- Opção 1: abrir `index.html` diretamente no navegador.
- Opção 2 (recomendado para evitar restrições de `fetch`): servir a pasta com um servidor simples, por exemplo:
  - Node: `npx http-server .` ou `npx serve .`
  - Python: `python -m http.server`

## Estrutura

- `index.html` – Página principal
- `src/styles.css` – Estilos da folha (A4) e regras de impressão
- `src/templates.js` – Templates de documento + Mock API (localStorage)
- `src/app.js` – Lógica reativa (Vue 3) e renderização do template

## Templates

- Placeholders simples: `{{campo}}`
- Checkbox: `{{#check:campoBooleano}}`
- Radio: `{{#radio:grupo|valor}}`
- Condicional: `{{#if:campo|valor}} ... {{/if}}`

Crie novos templates pelo botão "Novo Template" (abre um editor para colar JSON). Os modelos ficam salvos em `localStorage` sob a chave `trf.templates.v1`.

## Impressão

- O CSS de `@media print` oculta o formulário e imprime apenas a "folha" do visualizador (`#print-area`).
- Página configurada como A4 com margens de 12 mm.

