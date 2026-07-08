# Portfólio v2 — João Victor Maccagnan

Segunda versão do portfólio: mais seções, mais animações e efeitos que funcionam em qualquer dispositivo (inclusive celular, onde não existe mouse).

## O que tem de novo em relação ao v1

- **Fundo com vida própria**: blobs de luz animados em CSS puro — funcionam hospedado, no celular, em qualquer lugar. O spotlight que segue o mouse continua existindo como bônus no desktop.
- **Cursor customizado** (bolinha + anel que reage a links) — só desktop.
- **Efeito "decode"** nos títulos: as letras embaralham e se resolvem.
- **Typewriter** no hero: "Eu construo → sistemas fullstack / APIs em Python / ...".
- **Terminal animado** ao lado da foto digitando comandos.
- **Barra de progresso de scroll** no topo.
- **Seções novas**: "O que eu faço" (serviços) e "Jornada" (timeline que se preenche com o scroll).
- **Contadores animados** nas estatísticas do "Sobre".
- **Tilt 3D** na foto e nos cards + botões magnéticos.
- Sem favicon de bolinha (agora é um "J" discreto) e sem a pill verde de disponível — isso virou uma linha discreta na seção de contato.

## Estrutura

```
portfolio-v2/
├── index.html      → página única
├── css/style.css   → estilos e animações
├── js/main.js      → todas as interações
└── assets/
    └── foto.jpg    → SUA FOTO VAI AQUI
```

## Sua foto

Salve como `assets/foto.jpg` (vertical, proporção 4:5, mínimo 640px de largura).

## Como abrir

Duplo clique no `index.html`, ou:

```
python -m http.server 4174
```

## Observação sobre a "luz que some" hospedado

No v1 a luz dependia 100% do mouse — no celular (sem mouse) ela ficava parada.
No v2 o fundo tem animação própria via CSS, então sempre há movimento;
o efeito de seguir o mouse é um extra apenas para desktop.
