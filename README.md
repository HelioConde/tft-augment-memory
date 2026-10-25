<div align="center">
  <h1>🧩 TFT Augment Memory</h1>
  <p><strong>Revise os aprimoramentos que apareceram nas suas partidas recentes de Teamfight Tactics.</strong></p>
  <p><img alt="Status" src="https://img.shields.io/badge/status-MVP%20em%20valida%C3%A7%C3%A3o-64748b"></p>
</div>

## O que a ferramenta mostra

Pesquise pelo Riot ID e visualize o histórico de **augments** da sua própria conta, com indicadores como frequência, colocação média, Top 4, última aparição e combinações recorrentes.

| Painel | Leitura |
| --- | --- |
| Frequência | Quantas vezes um augment aparece no recorte |
| Resultados | Colocação média e porcentagem de Top 4 |
| Combinações | Aprimoramentos encontrados juntos |
| Linha do tempo | Aparições por partida consultada |
| Período | Filtros de 7 dias, 30 dias e Set |
| Histórico de busca | Riot ID e filtros locais |

O frontend depende do endpoint gamer configurado em `backend-config.js`; **a chave privada Riot não fica no navegador**. Se o backend não responder, informações reais podem estar indisponíveis.

## Como interpretar

O produto reúne **seu histórico pessoal**, não uma classificação universal de melhores augments. Um aprimoramento associado a partidas bem colocadas pode refletir composição, economia, patch, lobby e decisões, sem ser a causa do resultado.

**Períodos são filtros sobre a amostra recuperada**, não acesso ilimitado ao histórico completo.

## Executar localmente

```bash
git clone https://github.com/HelioConde/tft-augment-memory.git
cd tft-augment-memory
python -m http.server 8000
```

Acesse `http://localhost:8000`. Para testes:

```bash
npm install
npm run check
npm run test:e2e
```

## Situação atual

**MVP implementado e em validação.** A prioridade é conferir resultados em contas e dispositivos adicionais, garantir amostras claras e manter os dados alinhados às limitações da Riot API.

Projeto não oficial, sem afiliação à Riot Games. Desenvolvido por [Hélio Conde](https://github.com/HelioConde).
