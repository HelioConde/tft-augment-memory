# TFT Augment Memory

Produto TFT do **Ideias IA Lab** para transformar o histórico recente de augments em memória pessoal útil.

## Estado atual

MVP funcional iniciado em 07/10/2026.

## O que já funciona

- busca por Riot ID + servidor;
- backend gamer compartilhado via \`riot-legacy-tft-profile\`;
- períodos de 7 dias, 30 dias e Set atual;
- frequência por augment;
- colocação média;
- taxa de Top 4;
- última aparição;
- combinações/parceiros mais recorrentes;
- ordenação por frequência, média e Top 4;
- detalhe de augment;
- linha do tempo por partida;
- buscas recentes em localStorage;
- deep link com Riot ID, servidor e período;
- PT-BR principal + inglês;
- páginas Sobre, Privacidade e Termos;
- mobile;
- SEO básico;
- espaço preparado para anúncios;
- Static QA.

## Interpretação

O produto é um **histórico pessoal**, não uma tier list.

Colocação média e Top 4 descrevem apenas a amostra do jogador. Elas não provam que o augment causou o resultado e devem ser lidas junto de patch, comp, lobby, itens e decisões.

## Backend

Fonte:

\`https://bieihhaobdztjyoweewa.supabase.co/functions/v1/riot-legacy-tft-profile\`

A integração Riot continua server-side.

## QA

Execute:

\`npm run check\`

## Deploy

O workflow **Deploy GitHub Pages** está preparado.

Caso o Pages ainda não esteja habilitado:

1. Settings → Pages
2. Build and deployment
3. Source → GitHub Actions

## Gate antes de expandir

- [x] proposta de valor clara;
- [x] histórico real de TFT;
- [x] fluxo principal;
- [x] 7D / 30D / Set;
- [x] detalhe de augment;
- [x] PT-BR/EN;
- [x] mobile;
- [x] páginas institucionais;
- [x] QA estático;
- [ ] GitHub Pages confirmado;
- [x] Browser E2E;
- [ ] validar com 3+ Riot IDs;
- [ ] validar contas com poucos jogos;
- [ ] validar nomes reais de augments;
- [ ] revisar 404/429/timeout;
- [ ] revisar desktop/mobile publicado.


> Browser E2E automatizado no GitHub Actions foi adicionado em 07/10/2026. O que resta neste gate é validação publicada/real e revisão dos casos específicos listados abaixo.

## V2 — somente após validação

- memória por patch;
- busca por augment;
- comparação entre dois augments;
- evolução ao longo do tempo;
- filtros por comp/trait;
- card compartilhável;
- sincronização de favoritos/notas.

## Compliance

Produto independente e não endossado pela Riot Games.

Teamfight Tactics e Riot Games são marcas de seus respectivos titulares.

Planejamento geral:

https://github.com/HelioConde/ideias-ia-lab
