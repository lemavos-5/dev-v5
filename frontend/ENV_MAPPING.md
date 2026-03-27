# Environment Variables Mapping - Continuum Frontend

## Variáveis de Ambiente Obrigatórias (VITE_*)

### API & Backend
```
VITE_FRONTEND_FORGE_API_URL
  Descrição: Base URL do backend Spring Boot
  Padrão: http://localhost:8080
  Exemplo: https://api.continuum.com
  Tipo: URL
```

### Google Maps
```
VITE_FRONTEND_FORGE_API_KEY
  Descrição: Chave de API do Google Maps
  Padrão: (obrigatório)
  Exemplo: AIzaSyD...
  Tipo: String
```

### OAuth & Autenticação
```
VITE_OAUTH_PORTAL_URL
  Descrição: URL do servidor OAuth
  Padrão: https://oauth.example.com
  Exemplo: https://oauth.staging.example.com
  Tipo: URL

VITE_APP_ID
  Descrição: ID da aplicação registrada no OAuth server
  Padrão: (obrigatório)
  Exemplo: continuum-app-123
  Tipo: String
```

### Branding & Configuração
```
VITE_APP_TITLE
  Descrição: Título da aplicação
  Padrão: Continuum
  Exemplo: Continuum PKM
  Tipo: String

VITE_APP_LOGO
  Descrição: URL CDN do logo da aplicação
  Padrão: (opcional)
  Exemplo: https://cdn.example.com/logo.png
  Tipo: URL
```

### Analytics
```
VITE_ANALYTICS_ENDPOINT
  Descrição: Endpoint de analytics (Umami)
  Padrão: (opcional)
  Exemplo: https://analytics.example.com
  Tipo: URL

VITE_ANALYTICS_WEBSITE_ID
  Descrição: ID do website no Umami
  Padrão: (opcional)
  Exemplo: a1b2c3d4-e5f6-7890-abcd-ef1234567890
  Tipo: String (UUID)
```

## Variáveis Internas

Estas variáveis são gerenciadas pelo ambiente de deploy e não devem ser editadas diretamente no código:

- `BUILT_IN_FORGE_API_KEY` - Chave interna do Forge
- `BUILT_IN_FORGE_API_URL` - URL interna do Forge
- `JWT_SECRET` - Secret para validação JWT
- `OAUTH_SERVER_URL` - URL do servidor OAuth interno
- `OWNER_NAME` - Nome do proprietário da app
- `OWNER_OPEN_ID` - OpenID do proprietário

## Arquivos Que Usam Variáveis de Ambiente

### client/src/services/api.ts
```typescript
const API_BASE_URL = import.meta.env.VITE_FRONTEND_FORGE_API_URL || "http://localhost:8080";
```
- Usa: `VITE_FRONTEND_FORGE_API_URL`

### client/src/components/Map.tsx
```typescript
const API_KEY = import.meta.env.VITE_FRONTEND_FORGE_API_KEY;
const FORGE_BASE_URL = import.meta.env.VITE_FRONTEND_FORGE_API_URL || "https://forge.butterfly-effect.dev";
const MAPS_PROXY_URL = `${FORGE_BASE_URL}/v1/maps/proxy`;
```
- Usa: `VITE_FRONTEND_FORGE_API_KEY`, `VITE_FRONTEND_FORGE_API_URL`
- ⚠️ Hardcode: `https://forge.butterfly-effect.dev` (fallback)
- ⚠️ Hardcode: `mapId: "DEMO_MAP_ID"` (linha 141)

### client/src/const.ts
```typescript
const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
const appId = import.meta.env.VITE_APP_ID;
const redirectUri = `${window.location.origin}/api/oauth/callback`;
```
- Usa: `VITE_OAUTH_PORTAL_URL`, `VITE_APP_ID`
- ✅ `redirectUri` é dinâmico (OK)

## Hardcodes Identificados

| Arquivo | Linha | Hardcode | Solução |
|---------|-------|----------|---------|
| Map.tsx | 92 | `https://forge.butterfly-effect.dev` | Usar `VITE_FRONTEND_FORGE_API_URL` |
| Map.tsx | 141 | `mapId: "DEMO_MAP_ID"` | Criar `VITE_GOOGLE_MAP_ID` |

## Checklist de Segurança

- [x] Nenhuma chave Stripe (pk_test_*, sk_*) hardcoded
- [x] Nenhuma chave de API privada exposta
- [x] Nenhuma URL de backend hardcoded (exceto fallback)
- [x] Nenhuma URL de app hardcoded
- [x] Todos os endpoints são relativos (via Axios baseURL)
- [x] OAuth redirect URI é dinâmico
- [x] Tokens JWT armazenados em localStorage (seguro)

## Como Usar

### Desenvolvimento Local
```bash
# Copiar template
cp .env.example .env.local

# Editar com valores locais
VITE_FRONTEND_FORGE_API_URL=http://localhost:8080
VITE_FRONTEND_FORGE_API_KEY=AIzaSyD...
VITE_OAUTH_PORTAL_URL=http://localhost:3001
VITE_APP_ID=local-app-123
```

### Produção
Todas as variáveis são injetadas automaticamente pelo ambiente de deploy (Vercel, Render, etc.).

## Validação de Env (Recomendado)

Criar `src/config/env.ts`:
```typescript
export const env = {
  API_BASE_URL: import.meta.env.VITE_FRONTEND_FORGE_API_URL || "http://localhost:8080",
  GOOGLE_MAPS_API_KEY: import.meta.env.VITE_FRONTEND_FORGE_API_KEY,
  OAUTH_PORTAL_URL: import.meta.env.VITE_OAUTH_PORTAL_URL,
  APP_ID: import.meta.env.VITE_APP_ID,
  GOOGLE_MAP_ID: import.meta.env.VITE_GOOGLE_MAP_ID || "DEMO_MAP_ID",
} as const;

// Validar na inicialização
if (!env.GOOGLE_MAPS_API_KEY) {
  throw new Error("VITE_FRONTEND_FORGE_API_KEY não configurada");
}
```
