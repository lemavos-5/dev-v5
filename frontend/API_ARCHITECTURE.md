# Continuum API Architecture

## Overview
O Continuum é um ecossistema de Personal Knowledge Management (PKM) que integra:
- **Notas** com suporte a Markdown
- **Entidades** (Pessoas, Projetos, Hábitos) em um Knowledge Graph
- **Sistema de Planos** (FREE, PLUS, PRO, GOLD) com limites dinâmicos
- **Tracking de Hábitos** com heatmaps e estatísticas
- **Integração Stripe** para pagamentos

## Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Registro com verificação de email
- `POST /api/auth/login` - Login com JWT
- `POST /api/auth/refresh` - Refresh token (token rotation)
- `POST /api/auth/google/callback` - OAuth Google
- `POST /api/auth/logout` - Logout e revogação de tokens

### Notas
- `GET /api/notes` - Listar todas as notas
- `POST /api/notes` - Criar nota (com limite por plano)
- `GET /api/notes/{id}` - Obter nota com conteúdo completo
- `PUT /api/notes/{id}` - Atualizar nota
- `DELETE /api/notes/{id}` - Deletar nota

### Entidades (Knowledge Graph)
- `GET /api/entities` - Listar todas as entidades
- `POST /api/entities` - Criar entidade (Pessoa, Projeto, Hábito)
- `GET /api/entities/{id}` - Obter detalhes da entidade
- `GET /api/entities/{id}/connections` - Entidades conectadas
- `GET /api/entities/{id}/notes` - Notas que mencionam a entidade
- `GET /api/entities/{id}/context` - Contexto completo da entidade

### Tracking de Hábitos
- `POST /api/entities/{entityId}/track` - Registrar ocorrência de hábito
- `DELETE /api/entities/{entityId}/track` - Remover tracking
- `GET /api/entities/{entityId}/stats` - Estatísticas de tracking
- `GET /api/entities/{entityId}/heatmap` - Heatmap de atividade
- `GET /api/tracking/today` - Hábitos rastreados hoje

### Métricas & Dashboard
- `GET /api/metrics/dashboard` - Estatísticas gerais (notas, entidades, hábitos)
- `GET /api/metrics/entities/{entityId}/timeline` - Timeline de uma entidade
- `GET /api/graph/data` - Dados do Knowledge Graph para visualização

### Planos & Billing
- `GET /api/plans` - Listar planos disponíveis
- `GET /api/subscriptions/me` - Obter plano atual do usuário
- `POST /api/subscriptions/checkout` - Iniciar checkout Stripe
- `POST /api/subscriptions/cancel` - Cancelar assinatura

### Conta & Perfil
- `GET /api/account/me` - Dados do usuário (com limites de plano)
- `PATCH /api/account/me` - Atualizar perfil
- `POST /api/account/password/change` - Mudar senha
- `POST /api/account/password/forgot` - Solicitar reset de senha
- `DELETE /api/account/me` - Deletar conta

### Busca
- `GET /api/search?q=termo` - Buscar notas e entidades

## Modelos de Dados Principais

### User Context (Autenticação)
```typescript
{
  id: string
  username: string
  email: string
  plan: "FREE" | "PLUS" | "PRO" | "GOLD"
  maxNotes: number
  maxEntities: number
  maxHabits: number
  advancedMetrics: boolean
  subscriptionEndsAt: string
}
```

### Note
```typescript
{
  id: string
  title: string
  content: string (Markdown)
  folderId: string
  entityIds: string[] (Entidades mencionadas)
  createdAt: string
  updatedAt: string
}
```

### Entity (Knowledge Graph Node)
```typescript
{
  id: string
  title: string
  type: "PERSON" | "PROJECT" | "CONCEPT" | "HABIT"
  description: string
  trackingDates: string[] (para hábitos)
  createdAt: string
}
```

### Subscription
```typescript
{
  id: string
  effectivePlan: "FREE" | "PLUS" | "PRO" | "GOLD"
  status: "ACTIVE" | "CANCELED" | "PAST_DUE"
  maxNotes: number
  maxEntities: number
  advancedMetrics: boolean
  currentPeriodEnd: string
  cancelAtPeriodEnd: boolean
}
```

## Fluxos Principais

### 1. Autenticação
1. Usuário faz login → recebe `accessToken` + `refreshToken`
2. Token armazenado em localStorage (seguro com HttpOnly em produção)
3. Axios interceptor adiciona `Authorization: Bearer {token}` em todas as requisições
4. Se 401 → usar `refreshToken` para obter novo `accessToken`
5. Se refresh falhar → redirecionar para login

### 2. Criação de Nota
1. Usuário clica "Nova Nota"
2. Frontend valida limite: `currentNotes < maxNotes`
3. Se limite atingido → mostrar modal de upgrade
4. Se OK → abrir editor
5. Ao salvar → `POST /api/notes` com conteúdo Markdown
6. Backend extrai entidades automaticamente
7. Frontend atualiza lista de notas

### 3. Knowledge Graph
1. Ao abrir uma nota → buscar entidades relacionadas
2. Ao criar entidade → mostrar conexões (outras entidades mencionadas nas mesmas notas)
3. Visualização com `react-force-graph` ou similar
4. Clique em nó → abrir detalhes da entidade

### 4. Tracking de Hábitos
1. Usuário marca hábito como completo hoje
2. `POST /api/entities/{id}/track` registra a data
3. Heatmap atualiza em tempo real
4. Estatísticas recalculadas

### 5. Upgrade de Plano
1. Usuário tenta exceder limite → modal com planos disponíveis
2. Clica em plano → `POST /api/subscriptions/checkout`
3. Recebe `checkoutUrl` do Stripe
4. Redireciona para Stripe
5. Após pagamento → webhook atualiza plano no backend
6. Frontend detecta mudança e recarrega limites

## Segurança

- **JWT com Refresh Token**: Implementar token rotation
- **CORS**: Backend deve estar configurado para aceitar requisições do frontend
- **XSS Protection**: Sanitizar conteúdo Markdown antes de renderizar
- **CSRF**: Usar SameSite cookies e validar origem
- **Rate Limiting**: Implementado no backend

## Estrutura de Pastas (Frontend)

```
client/src/
├── pages/
│   ├── Auth/
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ForgotPassword.tsx
│   ├── Dashboard.tsx
│   ├── NoteEditor.tsx
│   ├── KnowledgeGraph.tsx
│   ├── Settings.tsx
│   └── NotFound.tsx
├── components/
│   ├── ui/ (shadcn/ui)
│   ├── Layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── MainLayout.tsx
│   ├── Notes/
│   │   ├── NoteList.tsx
│   │   ├── NoteCard.tsx
│   │   └── MarkdownEditor.tsx
│   ├── Entities/
│   │   ├── EntityCard.tsx
│   │   ├── EntityList.tsx
│   │   └── EntityForm.tsx
│   ├── Modals/
│   │   ├── UpgradeModal.tsx
│   │   └── ConfirmDialog.tsx
│   └── Graph/
│       └── GraphVisualization.tsx
├── services/
│   ├── api.ts (Axios instance com interceptors)
│   ├── auth.ts
│   ├── notes.ts
│   ├── entities.ts
│   ├── subscriptions.ts
│   └── metrics.ts
├── stores/
│   ├── authStore.ts (Zustand)
│   ├── notesStore.ts
│   └── uiStore.ts
├── types/
│   ├── api.ts (tipos gerados do Swagger)
│   └── entities.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useNotes.ts
│   └── useProtectedRoute.ts
├── lib/
│   ├── markdown.ts
│   └── utils.ts
└── App.tsx
```

## Próximas Etapas

1. ✅ Análise do Swagger
2. Implementar tipos TypeScript baseados no Swagger
3. Configurar Axios com interceptors JWT
4. Implementar Zustand stores para Auth e UI
5. Construir sistema de autenticação
6. Construir Dashboard
7. Construir Editor de Notas
8. Construir Knowledge Graph
9. Integrar Stripe
10. Polish visual e testes
