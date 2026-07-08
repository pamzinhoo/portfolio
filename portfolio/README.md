# Portfólio — João Victor Maccagnan

Portfólio pessoal com visual inspirado em **Raycast** (dark, glow, glassmorphism) e **Nothing** (tipografia dot-matrix, vermelho, grid pontilhado).

## Estrutura

```
portfolio/
├── index.html      → página única com todas as seções
├── css/style.css   → todo o estilo e animações CSS
├── js/main.js      → boot sequence, glow orb e interações
└── assets/
    └── foto.jpg    → SUA FOTO VAI AQUI (não incluída)
```

## Sua foto

Coloque uma foto sua em `assets/` com o nome exato **`foto.jpg`**.
Formato ideal: vertical (proporção 4:5), pelo menos 640px de largura.
Enquanto a foto não existir, o site mostra um placeholder "JV" no lugar.

## Como abrir

Basta abrir o `index.html` no navegador (duplo clique), ou rodar um servidor local:

```
python -m http.server 4173
```

e acessar http://localhost:4173

## Publicar de graça

- **GitHub Pages**: suba a pasta num repositório e ative Pages nas configurações.
- **Netlify / Vercel**: arraste a pasta no painel deles e pronto.
