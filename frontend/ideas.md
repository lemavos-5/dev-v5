# Design Ideas for Continuum PKM

## Response 1: Minimalist Dark Tech (Probability: 0.08)

**Design Movement**: Modern Minimalism + Brutalist Tech
- Inspiração: Obsidian, Linear, Notion Dark Mode
- Foco em clareza, densidade informacional e eficiência

**Core Principles**:
1. **Negative Space**: Amplo espaçamento entre elementos, respiração visual
2. **Monochromatic Base**: Cinzas neutros com acentos seletivos (cyan/blue)
3. **Typography as Hierarchy**: Contraste forte entre weights (300 vs 700)
4. **Functional Minimalism**: Cada elemento serve um propósito, sem ornamentação

**Color Philosophy**:
- Background: `#0a0a0a` (quase preto)
- Text Primary: `#e8e8e8` (cinza claro)
- Accent: `#00d9ff` (cyan vibrante) - para CTAs e highlights
- Secondary: `#6b7280` (cinza médio) - para texto secundário
- Reasoning: Reduz fadiga ocular, aumenta foco no conteúdo

**Layout Paradigm**:
- Sidebar esquerda (navegação) com ícones minimais
- Conteúdo principal com max-width 1200px, centralizado
- Cards com borders sutis (1px #1a1a1a)
- Grid assimétrico: 2/3 conteúdo, 1/3 painel lateral (entidades/contexto)

**Signature Elements**:
1. **Dividers Geométricos**: Linhas horizontais com gradiente sutil (fade in/out)
2. **Icon Badges**: Ícones em pequenos círculos para tipos de entidades (PERSON, PROJECT, HABIT)
3. **Pulse Animation**: Elementos ativos pulsam levemente (opacity 0.8 → 1.0)

**Interaction Philosophy**:
- Hover: Fundo muda para `#1a1a1a`, sem transição (snap)
- Click: Feedback imediato com scale 0.98
- Transitions: Todas com `cubic-bezier(0.4, 0, 0.2, 1)` (material easing)
- Modais: Backdrop blur com overlay escuro

**Animation**:
- Entrada de elementos: fade + slide-up (200ms)
- Hover em cards: background shift + subtle lift (shadow)
- Loading: Spinner minimalista (apenas stroke, sem preenchimento)
- Transição entre páginas: Fade (150ms)

**Typography System**:
- Display: `Geist Mono` 700 (28px) - títulos de página
- Heading: `Inter` 600 (20px) - títulos de seção
- Body: `Inter` 400 (14px) - conteúdo principal
- Code: `Geist Mono` 400 (12px) - snippets Markdown

---

## Response 2: Glassmorphism + Gradient Accents (Probability: 0.07)

**Design Movement**: Contemporary Glassmorphism + Neumorphism Hints
- Inspiração: Apple Design, Figma, Framer
- Foco em profundidade, transparência e movimento fluido

**Core Principles**:
1. **Layered Depth**: Múltiplas camadas com blur e transparência
2. **Gradient Accents**: Gradientes dinâmicos em CTAs e highlights
3. **Soft Shadows**: Sombras difusas para criar profundidade
4. **Micro-interactions**: Movimento em resposta a cada ação

**Color Philosophy**:
- Background: `#0f172a` (azul-escuro profundo)
- Glass Layer: `rgba(255, 255, 255, 0.05)` com backdrop-filter
- Accent Gradient: `from-violet-500 via-purple-500 to-pink-500`
- Secondary Gradient: `from-cyan-400 to-blue-500`
- Reasoning: Cria sensação de profundidade e modernidade

**Layout Paradigm**:
- Sidebar flutuante com glass effect
- Cards em grid 3 colunas com gaps generosos
- Conteúdo principal com gradiente sutil de fundo
- Modal com glass effect e blur backdrop

**Signature Elements**:
1. **Gradient Borders**: Cards com border gradiente (2px)
2. **Floating Elements**: Cards levemente elevadas com shadow dinâmica
3. **Animated Backgrounds**: Gradientes que mudam sutilmente (8s loop)

**Interaction Philosophy**:
- Hover: Aumenta blur e eleva elemento
- Click: Pulse com glow effect
- Transitions: Smooth (300ms) com easing `ease-out`
- Feedback: Glow ao redor de elementos interativos

**Animation**:
- Entrada: Scale + fade com spring easing
- Hover: Lift + glow (300ms)
- Loading: Rotating gradient spinner
- Transição: Fade com scale (200ms)

**Typography System**:
- Display: `Space Grotesk` 700 (32px) - títulos
- Heading: `Space Grotesk` 600 (22px) - seções
- Body: `Poppins` 400 (15px) - conteúdo
- Code: `Fira Code` 400 (13px) - snippets

---

## Response 3: Data Visualization Focus + Warm Accents (Probability: 0.06)

**Design Movement**: Data-Driven Design + Warm Minimalism
- Inspiração: Retool, Grafana, Tableau
- Foco em legibilidade de dados, charts e informações contextuais

**Core Principles**:
1. **Data Hierarchy**: Informações ordenadas por importância
2. **Warm Palette**: Acentos em laranja/amber para ação
3. **Grid-Based**: Layout estruturado em grid 12 colunas
4. **Contextual Information**: Tooltips e badges informativos

**Color Philosophy**:
- Background: `#0d1117` (cinza-escuro neutro)
- Text: `#c9d1d9` (cinza claro)
- Accent Primary: `#fb8500` (laranja vibrante) - CTAs
- Accent Secondary: `#ffb703` (amber) - highlights
- Chart Colors: Palette divergente (azul → laranja)
- Reasoning: Laranja é energético e chama atenção, melhor para CTAs

**Layout Paradigm**:
- Dashboard com grid 4 colunas
- Cards de métrica com números grandes
- Gráficos ocupam 2-3 colunas
- Sidebar colapsável com filtros

**Signature Elements**:
1. **Metric Cards**: Números grandes com ícone e trend indicator (↑/↓)
2. **Chart Containers**: Cards com título, legenda e tooltip
3. **Progress Bars**: Indicadores de uso (notas, entidades, etc.)

**Interaction Philosophy**:
- Hover: Background muda, mostra tooltip
- Click: Abre detalhes em modal ou nova página
- Transitions: Rápidas (150ms)
- Feedback: Toast notifications para ações

**Animation**:
- Entrada: Fade + slide (150ms)
- Hover: Background shift + scale 1.02
- Loading: Skeleton screens (shimmer effect)
- Chart: Animação de barras ao carregar (500ms)

**Typography System**:
- Display: `IBM Plex Mono` 700 (28px) - títulos
- Heading: `IBM Plex Sans` 600 (18px) - seções
- Body: `IBM Plex Sans` 400 (14px) - conteúdo
- Code: `IBM Plex Mono` 400 (12px) - snippets

---

## Decision: Minimalist Dark Tech (Response 1)

**Por quê?**
- Alinha perfeitamente com o propósito de PKM (foco no conteúdo)
- Cyan accent é moderno e diferencia do padrão purple/blue
- Minimalismo reduz distrações em um app de produtividade
- Fácil de implementar com Tailwind + shadcn/ui
- Suporta bem a visualização de Knowledge Graph
- Cyan é excelente para destacar entidades e conexões

**Implementação**:
- Tailwind config customizado com palette cyan/slate
- Componentes shadcn/ui com overrides de cor
- Animações sutis com Framer Motion
- Typography: Geist Mono + Inter
