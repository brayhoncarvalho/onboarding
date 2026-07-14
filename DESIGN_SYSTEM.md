# Dock Landing Page — Design System Specification

> **Versão:** 1.0.0 | **Última atualização:** 2026-05-20 | **Breaking changes:** ver [CHANGELOG.md](./CHANGELOG.md)
>
> **Referência Figma:** https://www.figma.com/design/ENnwAECm4eFvT0pLXRVQXd/Dock?node-id=10025-108646&m=dev
> Este documento é a fonte de verdade para implementação visual. **Nenhum estilo deve ser inventado.**

---

## 1. Cores (Tokens)

| Token              | Hex       | Uso                                                  |
| ------------------- | --------- | ---------------------------------------------------- |
| `--color-primary`   | `#00d8d8` | Cor principal — títulos, botões CTA, ícones, circles |
| `--color-tertiary`  | `#1cc0c0` | Fundo do bloco hero, fundo do simulador              |
| `--color-yellow`    | `#eeff88` | Destaque — parcela selecionada, campo de valor       |
| `--color-btn-dark`  | `#444746` | Botão cinza escuro (variantes)                       |
| `--color-white`     | `#ffffff` | Fundo geral, cards, textos sobre fundo colorido      |
| `--color-black`     | `#000000` | Fundo do footer (barra superior)                     |
| `--color-text-dark` | `#242424` | Texto corpo dentro dos cards de benefícios           |
| `--color-text-gray` | `#5c5c5c` | Descrições de passos "Como funciona"                 |
| `--color-text-muted`| `#777777` | Textos do footer (corpo, copyright)                  |
| `--color-bg-light`  | `#e6e6e6` | Fundo da seção "Atendendo suas necessidades"         |
| `--color-slider-bg` | `#b9b9b9` | Trilha inativa do slider                             |

---

## 2. Tipografia

### Fontes

| Fonte            | Uso                                          |
| ---------------- | -------------------------------------------- |
| **Roboto**       | Fonte principal — títulos, corpo, labels      |
| **Red Hat Display** | Botões CTA, textos do footer               |

### Importação

```css
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Red+Hat+Display:wght@400;600;700&display=swap');
```

### Escala tipográfica

| Elemento                       | Font-family      | Size  | Weight | Extras                              |
| ------------------------------ | ---------------- | ----- | ------ | ----------------------------------- |
| Título de seção (h2)           | Roboto           | 26px  | 700    | `color: #00d8d8`                    |
| Subtítulo hero                 | Roboto           | 22px  | 700    | `letter-spacing: -0.06em`, `line-height: 24px`, `uppercase` |
| Label hero (feito de pessoas)  | Roboto           | 18px  | 500    | `uppercase`                         |
| Título de passo                | Roboto           | 19px  | 700    | `color: #00d8d8`                    |
| Descrição de passo             | Roboto           | 16px  | 300    | `letter-spacing: 0.03-0.04em`, `color: #5c5c5c` |
| Corpo / body                   | Roboto           | 18px  | 400    | —                                   |
| Valor simulador                | Roboto           | 30px  | 500    | `color: #00d8d8`                    |
| Parcela número                 | Roboto           | 30px  | 500    | branco ou `#00d8d8` se selecionado  |
| Taxa / parcela label           | Roboto           | 26px  | 300/500| —                                   |
| Título benefício (card)        | Roboto           | 17px  | 700    | `color: #00d8d8`                    |
| Descrição benefício (card)     | Roboto           | 14px  | 300    | `color: #242424`                    |
| Botão CTA texto                | Red Hat Display  | 18px  | 600    | `color: #fff`, `uppercase`          |
| Footer — links                 | Roboto           | 12px  | 400    | `color: #fff`                       |
| Footer — corpo                 | Red Hat Display  | 12px  | 400/700| `color: #777`                       |
| Disclaimer simulador           | Roboto           | 16px  | 400    | `color: #fff`                       |
| Label campo proposta           | Roboto           | 13px  | 400    | `color: #495057`                    |
| Título proposta (h1)           | Roboto           | 26px  | 500    | `color: #00d8d8`                    |

---

## 3. Componentes

### 3.1. Botão CTA (principal)

```
width: 317px
height: 60px
border-radius: 3px
background: #00d8d8
font-family: 'Red Hat Display'
font-size: 18px
font-weight: 600
color: #fff
text-align: center
uppercase
cursor: pointer
```

### 3.2. Indicador de passo (circle)

```
width: 33px
height: 34px
border-radius: 50%
background: #00d8d8
font-size: 24px (número dentro)
color: #fff
text-align: center
```

### 3.3. Card de benefício (minibox)

```
width: 147px
height: 234px
background: #fff
(sem border-radius no Figma)
```

### 3.4. Parcela (botão de seleção)

```
width: 83px
height: 65px
border: 1px solid #fff
-- estado normal:
   background: #00d8d8
   color: #fff
   font-weight: 500
-- estado selecionado:
   background: #eeff88
   color: #00d8d8
   font-weight: 500
```

### 3.5. Campo de valor (simulador)

```
width: 229px
height: 81px
background: #eeff88
border: 1px solid #fff
font-size: 30px
font-weight: 500
color: #00d8d8
```

### 3.6. Slider control (+/-)

```
width: 29px
height: 29px
background: #00d8d8
font-size: 24px
font-weight: 500
color: #fff
```

**POSIÇÃO OBRIGATÓRIA:**
- Botão **`-`** (decrementar) fica à **ESQUERDA** (lado do min do range)
- Botão **`+`** (incrementar) fica à **DIREITA** (lado do max do range)
- Isso garante que o slider acompanha a direção natural do `<input type="range">`:
  - Arrastar para a **esquerda** → valor diminui (direção do `-`)
  - Arrastar para a **direita** → valor aumenta (direção do `+`)
- **NUNCA** inverter a posição dos botões.

### 3.7. Slider track (funcional)

**OBRIGATÓRIO:** O slider DEVE usar `<input type="range">` nativo estilizado.
O usuário deve conseguir arrastar o thumb para mudar o valor.

```
elemento: <input type="range">
min: 1000
max: 200000
step: 1000
v-model: valorEmprestimo

Track: #b9b9b9 (cor única, sem diferença ativo/inativo)
Track height: 10px
border-radius: 0 (track sem arredondamento)

Thumb: #ffffff (branco puro)
Thumb tamanho: 24x24px
Thumb formato: quadrado (border-radius: 0)
Thumb border: none
Thumb box-shadow: none
Thumb cursor: pointer
```

**REGRAS CRÍTICAS DO THUMB:**
1. O thumb DEVE ser **branco puro (#ffffff)** — sem amarelo, sem accent color, sem decoração interna.
2. O thumb DEVE estar **centralizado verticalmente** na track. Para WebKit, usar `margin-top: -7px` no `::-webkit-slider-thumb` (calculado: `-(thumbHeight - trackHeight) / 2`).
3. Usar `appearance: none` + `box-shadow: none` + `border: none` para remover qualquer estilização padrão do browser.
4. **NUNCA** usar `#eeff88` (amarelo) no thumb do slider.

Estilização via `<style scoped>`:
```css
.slider-range {
  -webkit-appearance: none;
  appearance: none;
  height: 10px;
  background: #b9b9b9;
  outline: none;
  border-radius: 0;
}

.slider-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 24px;
  height: 24px;
  background: #ffffff;
  cursor: pointer;
  border: none;
  border-radius: 0;
  box-shadow: none;
  margin-top: -7px; /* centralizar no track de 10px */
}

.slider-range::-moz-range-thumb {
  width: 24px;
  height: 24px;
  background: #ffffff;
  cursor: pointer;
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.slider-range::-webkit-slider-runnable-track {
  height: 10px;
  background: #b9b9b9;
  border-radius: 0;
}

.slider-range::-moz-range-track {
  height: 10px;
  background: #b9b9b9;
  border-radius: 0;
}
```

### 3.8. Input campo proposta

```
height: 40px (aprox)
border: 1px solid #b8b8b8
font-size: 13px
color: #495057
focus border: #00d8d8
```

---

## 4. Seções (Layout — Mobile 375-414px)

### 4.1. Header
- Logo Dock à esquerda
- Menu hamburger à direita
- Height: 63px
- Background: white (landing) / #efefef (proposta)

### 4.2. Hero Section
- Bloco verde (`#1cc0c0`), `border-radius: 34px`, `259x154px`
- Texto "FEITO DE PESSOAS, PARA PESSOAS." — 18px, 500, uppercase
- Texto "EMPRÉSTIMO ONLINE, RÁPIDO E SEGURO." — 22px, bold, uppercase, `letter-spacing: -0.06em`
- Imagem hero sobreposta (overlap de ~210px sobre o bloco)
- Top: 83px do topo
- **Sobreposição hero → simulador:** a imagem hero invade visualmente o topo da seção do simulador. Usar `margin-top` negativo na imagem (`-mt-[210px]`) para criar esse efeito de overlap.

### 4.3. Simulador Section
- Fundo: `#1cc0c0` (full width)
- **Transição visual com hero:** a seção do simulador começa imediatamente após a imagem hero, sem gap branco entre eles.
- Título "De quanto você precisa?" — 26px, bold
- Campo valor — background `#eeff88`
- Parcelas em grid 3x2
- Informações de parcela e taxa
- Botão "SOLICITE AGORA"
- Disclaimer abaixo

### 4.4. Como Funciona Section
- Fundo: branco
- Título "Como funciona?" — 26px, bold, `#00d8d8`
- 3 passos com circles numerados
- Botão "CONTRATE" — CTA padrão

### 4.5. Benefícios / "Atendendo suas necessidades"
- Fundo: `#e6e6e6`
- Título: 26px, bold, `#00d8d8`
- Grid 2x2 de cards (147x234px cada)
- Ícones + título + descrição em cada card

### 4.6. Footer
- Barra superior: `#000`, 84px height
  - "Plataforma operada por Dock" — 12px, Roboto
  - "política de privacidade e cookies" — 12px, Roboto
- Corpo: fundo branco
  - Texto institucional — 12px, Red Hat Display, `#777`
  - Copyright — 12px, `#777`

---

## 5. Espaçamentos entre seções

| Transição                    | Comportamento                                         |
| ----------------------------- | ----------------------------------------------------- |
| Header → Hero                 | Header 63px, hero começa logo abaixo, mt-[20px]       |
| Hero → Simulador              | Sem gap — imagem hero sobreposta com -mt-[210px], simulador colado |
| Simulador → Como Funciona     | Sem gap — seções coladas (branco após teal)            |
| Como Funciona → Benefícios    | Sem gap — seções coladas (cinza após branco)           |
| Benefícios → Footer           | Sem gap — footer colado                                |

---

## 6. Regras de Funcionalidade

1. **Slider do simulador** — DEVE usar `<input type="range">` nativo. O usuário deve poder arrastar.
2. **Botões +/-** — devem alterar `valorEmprestimo` (ref reativo).
3. **Parcelas** — clicar em uma parcela deve mudar o state `parcelasSelecionada` e refletir visualmente.
4. **Valores calculados** — parcela mensal e taxa devem atualizar em tempo real via `computed`.
5. **Formulário proposta** — todos os inputs devem ter `v-model` vinculado a state reativo.
6. **Nenhum componente pode ser "só visual"** — se parece interativo, DEVE funcionar.

---

## 7. Imagens e Ícones

Todas as imagens devem ser salvas na pasta `public/`.

| Imagem             | Pasta     | Descrição                        |
| ------------------ | --------- | -------------------------------- |
| `dock.png`         | `public/` | Logo Dock (header)               |
| `image-header.png` | `public/` | Imagem principal do hero         |

> **REGRA IMAGENS:** Quando uma nova imagem for necessária, solicite ao usuário para salvar o arquivo na pasta `public/` e informe o nome esperado. Depois peça confirmação antes de usar no layout.

> **REGRA ÍCONES:** Quando o design exigir ícones, **pergunte ao usuário** antes de criar:
> - "Você quer fornecer os ícones (exportar do Figma e salvar em `public/`)?"
> - "Ou prefere que eu crie SVGs inline baseados no design?"
> Nunca crie ícones silenciosamente.

---

## 8. Regras obrigatórias

1. **NÃO inventar estilos.** Usar EXATAMENTE os valores do Figma descritos neste documento.
2. **Se o Figma mostra texto em 2 linhas, implementar em 2 linhas** (usar `<br/>` ou controle de largura).
3. **Negrito onde o Figma indica negrito** — respeitar `font-weight` fielmente.
4. **Fontes:** usar Roboto para tudo exceto botões CTA e footer corpo (Red Hat Display).
5. **Cores:** nunca substituir por "algo parecido". Usar os hex exatos.
6. **Tamanhos de fonte:** seguir a escala tipográfica acima sem arredondar.
7. **Espaçamentos:** manter fidelidade ao Figma (valores em px do CSS gerado).
8. **Imagens:** sempre em `public/`. Pedir ao usuário para salvar e confirmar antes de usar.
9. **Mobile-first:** o design base é mobile (375-414px de largura).
10. **CSS Modules ou Tailwind:** o projeto usa Tailwind CSS. Manter consistência com tokens Tailwind configurados em `tailwind.config.js`.
11. **Funcionalidade:** todo componente interativo DEVE funcionar (slider arrastando, botões clicando, valores atualizando).
12. **Ícones:** nunca criar ícones sem perguntar ao usuário primeiro.
13. **Backgrounds full-width:** seções com fundo colorido (teal, cinza, preto) DEVEM ter o background estendendo até as bordas do container, sem margens laterais. Usar `html, body { margin: 0; padding: 0; width: 100%; overflow-x: hidden; }` no CSS global. O container raiz deve usar `w-full` e as seções devem ter `width: 100%` implícito (sem `mx-*` no wrapper da seção).
14. **Slider — posição dos botões +/-:** o botão `-` fica à ESQUERDA e o `+` à DIREITA, seguindo a direção natural do `<input type="range">` (esquerda=min, direita=max). NUNCA inverter.
15. **Slider — thumb branco puro:** o thumb do slider DEVE ser `#ffffff` sem decoração interna (sem amarelo, sem accent color). Centralizar verticalmente com `margin-top` negativo no WebKit.
