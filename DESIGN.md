---
name: ControlaÊ — Painel CEO
description: Um painel executivo luminoso para operar estabelecimentos com clareza, confiança e ritmo.
colors:
  rail-deep: "#24135d"
  rail-mid: "#302075"
  primary: "#6438de"
  primary-action: "#6b2ee1"
  primary-hover: "#5425c6"
  primary-soft: "#eee9ff"
  crown-orange: "#ff6b00"
  ink: "#101338"
  muted: "#64698f"
  canvas: "#f6f7ff"
  panel: "rgba(255, 255, 255, 0.88)"
  border: "#dbdded"
  focus: "#6c36df"
  success: "#0abf78"
  info: "#3c5ce8"
  warning: "#ee8b10"
  danger: "#eb3f49"
typography:
  display:
    fontFamily: "Manrope Variable, Segoe UI, sans-serif"
    fontSize: "clamp(30px, 3vw, 38px)"
    fontWeight: 820
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Manrope Variable, Segoe UI, sans-serif"
    fontSize: "21px"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Manrope Variable, Segoe UI, sans-serif"
    fontSize: "19px"
    fontWeight: 820
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Manrope Variable, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope Variable, Segoe UI, sans-serif"
    fontSize: "13px"
    fontWeight: 730
    lineHeight: 1.2
    letterSpacing: "normal"
rounded:
  control-sm: "9px"
  control: "11px"
  control-lg: "12px"
  card: "18px"
  panel: "24px"
  pill: "999px"
spacing:
  compact: "7px"
  sm: "10px"
  md: "14px"
  lg: "18px"
  xl: "24px"
  page: "34px"
components:
  button-primary:
    backgroundColor: "{colors.primary-action}"
    textColor: "#ffffff"
    typography: "{typography.label}"
    rounded: "{rounded.control-lg}"
    padding: "0 21px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "#ffffff"
  button-secondary:
    backgroundColor: "#f0eff9"
    textColor: "#555b7c"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 18px"
    height: "44px"
  field:
    backgroundColor: "rgba(255, 255, 255, 0.92)"
    textColor: "#171a3a"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "0 13px"
    height: "45px"
  panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "24px"
  status-pill:
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "5px 9px"
---

# Design System: ControlaÊ — Painel CEO

## Overview

**Creative North Star: "A Sala de Comando Luminosa"**

O Painel CEO combina a autoridade de uma sala de comando com a leveza de um ambiente luminoso. O rail violeta profundo ancora a navegação e separa o plano de controle da área operacional; a tela principal usa branco translúcido, lilás frio e uma paisagem geométrica muito suave para manter densidade sem peso.

A identidade aparece em poucos gestos memoráveis: a coroa laranja, gradientes violetas direcionais, números tabulares e superfícies em camadas. O sistema é expressivo nos marcos de orientação e contido onde o CEO precisa comparar estados, valores e ações rapidamente. Ele preserva o comportamento de negócio e nunca usa decoração para esconder pré-condições ou consequências.

**Key Characteristics:**

- Rail violeta profundo como âncora permanente no desktop.
- Canvas branco-lilás com paisagem de gradientes em baixa opacidade.
- Coroa laranja reservada à identidade, não a ações comuns.
- Painéis brancos translúcidos, bordas claras e sombras ambientais.
- Densidade operacional alta, organizada por blocos curtos e escaneáveis.
- Estados, foco, placeholders e reorganização mobile sempre legíveis.

## Colors

A paleta contrapõe violetas reais e profundos a uma base fria, luminosa e quase branca; o laranja entra como assinatura de marca e as cores semânticas aparecem apenas onde carregam significado operacional.

### Primary

- **Violeta de Comando:** conduz ações primárias, estados ativos, links em interação e destaques de prontidão.
- **Violeta do Rail:** cria o campo escuro de navegação e sustenta contraste branco sem competir com o conteúdo.
- **Lilás de Contexto:** colore fundos de ícones, chips de prontidão e camadas discretas.

### Secondary

- **Laranja da Coroa:** identifica o ControlaÊ em marcas e avatares de estabelecimento; sua raridade preserva sua força.

### Tertiary

- **Verde Operacional, Azul Informativo, Âmbar de Atenção e Vermelho Crítico:** diferenciam métricas e estados. A cor sempre acompanha texto ou ícone; nunca é a única pista.

### Neutral

- **Tinta Executiva:** texto principal, títulos e valores que exigem leitura imediata.
- **Cinza Lilás:** explicações, metadados e rótulos secundários.
- **Canvas Nebuloso:** fundo geral frio, com gradientes atmosféricos discretos.
- **Vidro Branco:** painéis principais e superfícies de conteúdo.
- **Borda de Névoa:** delimitação de campos, cartões e divisões internas.

**The Crown Reserve Rule.** O laranja pertence à identidade da marca; ações rotineiras permanecem violetas.

**The Semantic Pairing Rule.** Verde, azul, âmbar e vermelho devem sempre reforçar um rótulo, ícone ou mensagem explícita.

## Typography

**Display Font:** Manrope Variable (com Segoe UI e sans-serif como fallback)
**Body Font:** Manrope Variable (com Segoe UI e sans-serif como fallback)
**Label/Mono Font:** Manrope Variable; tokens técnicos usam a pilha monoespaçada nativa do sistema.

**Character:** Manrope dá ao painel uma voz contemporânea, precisa e amigável. Pesos fortes e tracking negativo comprimem títulos com autoridade; corpo e rótulos mantêm abertura suficiente para leitura rápida.

### Hierarchy

- **Display** (820, fluido entre 30px e 38px, 1.08): título principal da superfície.
- **Headline** (800, 21px, 1.2): títulos de painéis e formulários.
- **Title** (820, 19px, 1.2): nome de estabelecimento e títulos locais de alta prioridade.
- **Body** (400, 15px, 1.55): orientação e explicações; prefira linhas curtas em vez de blocos extensos.
- **Label** (730, 13px, 1.2): campos e controles. Metadados podem descer a 10–12px somente quando o contraste e o espaço forem preservados.

**The Numeric Calm Rule.** Valores, contagens e cobranças usam algarismos tabulares para permanecer alinhados durante atualização.

**The Weight Before Size Rule.** A hierarquia cresce primeiro por peso e contraste; tamanhos muito grandes não pertencem a esta interface operacional.

## Layout

No desktop, o shell reserva um rail fixo de 250px e entrega o restante a um canvas fluido. O conteúdo central tem largura máxima de 1480px e respiro de página de 34px. Cabeçalho, métricas e clientes compartilham o mesmo eixo, enquanto cartões de cliente distribuem identidade, cobrança e ações em três zonas claramente separadas.

O ritmo usa intervalos compactos de 7–14px dentro de controles e grupos, 18–24px entre blocos internos e 25–34px entre seções. Isso mantém as ações densas sem parecerem apertadas. As métricas formam cinco colunas no desktop, três em telas intermediárias e duas no mobile; cartões de clientes quebram de três zonas para duas e finalmente para uma coluna.

Abaixo de 980px, o rail torna-se um cabeçalho de altura natural e a navegação perde elementos não essenciais. Abaixo de 720px, cabeçalhos, busca, formulários, cobrança e ações empilham; abaixo de 430px, a prioridade passa a ser nome, estado e próxima ação. Nenhuma ação pode depender de hover, e alvos interativos importantes preservam cerca de 44–48px de altura.

**The Scan Lane Rule.** Identidade, situação financeira e ações ocupam zonas previsíveis; não misture controles entre essas faixas no desktop.

**The Stack, Don't Shrink Rule.** No mobile, reorganize blocos e expanda botões em vez de comprimir texto e alvos.

## Elevation & Depth

O sistema usa profundidade em camadas: gradientes amplos definem a paisagem, painéis translúcidos com blur separam áreas e sombras violetas de baixa opacidade criam elevação ambiental. Sombras mais concentradas ficam reservadas a ações primárias e à coroa; cartões comuns devem parecer pousados, não flutuantes.

### Shadow Vocabulary

- **Rail:** (`12px 0 38px rgba(44, 28, 112, .15)`) separa a navegação do canvas.
- **Panel Ambient:** (`0 18px 46px rgba(68, 54, 146, .1)`) sustenta painéis grandes translúcidos.
- **Card Rest:** (`0 9px 24px rgba(65, 50, 130, .055)`) diferencia clientes sem criar ruído.
- **Primary Action:** (`0 11px 25px rgba(104, 48, 221, .28)`) dá presença controlada aos CTAs.
- **Crown Glow:** (`0 10px 24px rgba(255, 91, 0, .27)`) acompanha exclusivamente a assinatura laranja.

**The Ambient Depth Rule.** Profundidade padrão é difusa e violeta; sombras escuras e duras quebram a atmosfera luminosa.

**The Two-Layer Limit.** Dentro de um painel elevado, cartões filhos recebem apenas elevação baixa; não empilhe múltiplos glows fortes.

## Shapes

Controles usam cantos suavemente arredondados de 9–12px, cartões operacionais usam 16–18px e painéis de seção chegam a 23–24px. Pílulas são totalmente arredondadas e reservadas a estados compactos. A coroa aparece em quadrados arredondados com gradiente, criando uma silhueta constante entre marca e clientes.

Bordas são claras, finas e frias. A geometria de fundo pode usar arcos e diagonais grandes em baixa opacidade, mas o conteúdo permanece ortogonal e previsível. Evite misturar cantos retos, círculos decorativos e raios aleatórios no mesmo componente.

**The Radius Ladder Rule.** Controle, cartão e painel devem subir de forma reconhecível na escala de raio; o tamanho do contêiner determina a curvatura.

## Components

### Buttons

- **Shape:** controles firmes e arredondados, normalmente com 11–12px de raio e altura mínima de 44–48px.
- **Primary:** texto branco sobre gradiente violeta, peso forte, ícone opcional e espaçamento horizontal confortável.
- **Hover / Focus:** hover sobe 1px e intensifica sombra/gradiente; foco por teclado usa contorno violeta de 3px com offset de 3px. Movimento é praticamente removido quando o sistema solicita redução.
- **Secondary / Ghost:** secundários usam lilás-neutro e texto escuro; ações textuais ficam transparentes. Estados desabilitados reduzem opacidade e removem deslocamento.

### Chips

- **Style:** pílulas compactas com fundo tonal e texto semântico escuro; um ponto ou ícone reforça o significado.
- **State:** prontidão usa violeta, proteção usa azul e pendência usa âmbar. Status de acesso mantém seu próprio rótulo textual.

### Cards / Containers

- **Corner Style:** 18px para cartões de cliente e 23–24px para painéis agregadores.
- **Background:** branco quase opaco nos cartões; vidro branco translúcido nos painéis.
- **Shadow Strategy:** use Panel Ambient no contêiner e Card Rest nos filhos.
- **Border:** linha fria de 1px; bordas brancas translúcidas reforçam painéis de vidro.
- **Internal Padding:** 20–24px em cartões e formulários; painéis de lista podem usar uma moldura compacta de 10px.

### Inputs / Fields

- **Style:** fundo branco translúcido, borda fria de 1px, raio de 11–12px e altura de 43–45px.
- **Focus:** borda muda para violeta claro com halo externo suave, além do contorno global visível por teclado.
- **Placeholder / Disabled:** placeholders mantêm contraste legível; desabilitado nunca depende apenas de cor e deve preservar o rótulo.

### Navigation

O rail usa branco e lavanda sobre violeta profundo. A opção ativa recebe gradiente violeta mais claro, peso alto e relevo interno sutil; hover clareia texto e superfície. Em mobile, o rail vira cabeçalho e elementos secundários desaparecem antes que a navegação seja comprimida.

### Metric Card

Cada métrica combina ícone em bloco tonal, número forte tabular e rótulo curto. Uma forma curva suave no canto inferior adiciona identidade sem competir com o dado. O tom semântico varia, mas estrutura, espaçamento e contraste permanecem constantes.

### Client Action Grid

A grade de ações usa botões compactos, igualmente distribuídos e com ícone acima do rótulo. A ação de acesso é a única ação preenchida e se estende para formar uma saída visual clara; no mobile, ela ocupa a largura total da grade.

## Do's and Don'ts

### Do:

- **Do** mantenha o rail violeta e a coroa laranja como âncoras reconhecíveis do ControlaÊ.
- **Do** agrupe ações por estabelecimento e preserve separadores claros entre identidade, cobrança e operação.
- **Do** use superfícies translúcidas sobre o canvas lilás somente quando texto e bordas mantiverem contraste.
- **Do** apresente estados críticos com texto, cor e, quando útil, ícone.
- **Do** empilhe conteúdo responsivamente e preserve alvos de toque confortáveis.
- **Do** mantenha foco visível, placeholders legíveis e suporte a movimento reduzido.

### Don't:

- **Don't** transforme o laranja da coroa em cor genérica de CTA ou de status.
- **Don't** use sombras pretas duras, glassmorphism excessivo ou blur que prejudique a leitura.
- **Don't** esconda pré-condições de ativação, estados de carregamento ou feedback de ações.
- **Don't** reduza cartões complexos até virarem linhas ilegíveis no mobile; reorganize-os em blocos.
- **Don't** introduza uma segunda família tipográfica ou pesos leves em dados operacionais.
- **Don't** altere comportamento de API, regras de negócio ou conteúdo real para acomodar a composição visual.
