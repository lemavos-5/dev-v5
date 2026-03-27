/**
 * Tipos TypeScript gerados a partir do Swagger/OpenAPI do Continuum
 * Estes tipos definem a estrutura de dados retornada pela API
 */

// ============================================================================
// AUTENTICAÇÃO
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserContextResponse;
}

// ============================================================================
// USUÁRIO & CONTA
// ============================================================================

export interface UserContextResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  active: boolean;
  plan: PlanType;
  subscriptionStatus: SubscriptionStatus;
  maxEntities: number;
  maxNotes: number;
  maxHabits: number;
  maxVaultMB: number;
  historyDays: number;
  advancedMetrics: boolean;
  dataExport: boolean;
  calendarSync: boolean;
  subscriptionEndsAt: string | null;
  cancelAtPeriodEnd: boolean;
}

export type PlanType = "FREE" | "PLUS" | "PRO" | "GOLD";
export type SubscriptionStatus = "ACTIVE" | "CANCELED" | "PAST_DUE" | "TRIAL";

// ============================================================================
// NOTAS
// ============================================================================

export interface NoteCreateRequest {
  title: string;
  content: string;
  folderId?: string;
}

export interface NoteUpdateRequest {
  title?: string;
  content?: string;
  folderId?: string;
}

export interface NoteResponse {
  id: string;
  userId: string;
  folderId: string;
  title: string;
  content: string;
  entityIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface NoteSummaryDTO {
  id: string;
  title: string;
  content: string;
  folderId: string;
  entityIds: string[];
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// ENTIDADES (KNOWLEDGE GRAPH)
// ============================================================================

export type EntityType = "PERSON" | "PROJECT" | "CONCEPT" | "HABIT";

export interface EntityCreateRequest {
  title: string;
  type: EntityType;
  description?: string;
}

export interface EntityUpdateRequest {
  title?: string;
  type?: EntityType;
  description?: string;
}

export interface EntityResponse {
  id: string;
  userId: string;
  vaultId: string;
  title: string;
  type: EntityType;
  description: string;
  createdAt: string;
  trackingDates?: string[];
}

export interface EntityContextResponse {
  entity: EntityResponse;
  relatedEntities: EntityResponse[];
  relatedNotes: NoteSummaryDTO[];
  metadata: Record<string, unknown>;
}

// ============================================================================
// TRACKING DE HÁBITOS
// ============================================================================

export interface TrackEventRequest {
  date: string; // YYYY-MM-DD
}

export interface TrackingEvent {
  id: string;
  entityId: string;
  date: string;
  createdAt: string;
}

export interface TrackingStats {
  totalDays: number;
  completedDays: number;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  lastTracked: string | null;
}

// ============================================================================
// KNOWLEDGE GRAPH
// ============================================================================

export interface NodeDTO {
  id: string;
  label: string;
  type: EntityType;
  size?: number;
  color?: string;
}

export interface LinkDTO {
  source: string;
  target: string;
  weight?: number;
}

export interface GraphDTO {
  nodes: NodeDTO[];
  links: LinkDTO[];
}

// ============================================================================
// MÉTRICAS & DASHBOARD
// ============================================================================

export interface TopEntity {
  id: string;
  title: string;
  type: EntityType;
  count: number;
}

export interface DashboardMetrics {
  uniquePeople: number;
  uniqueProjects: number;
  uniqueHabits: number;
  totalMentions: number;
  totalNotes: number;
  totalEntities: number;
  topMentions: TopEntity[];
  topPeople: TopEntity[];
  topProjects: TopEntity[];
  topHabits: TopEntity[];
  habitsCompletedToday: string[];
  weeklyAverageCompletionRate: number;
  globalHeatmap: Record<string, number>;
}

export interface EntityTimeline {
  entityId: string;
  events: TimelineEvent[];
}

export interface TimelineEvent {
  date: string;
  count: number;
  type: "mention" | "tracking";
}

// ============================================================================
// PLANOS & BILLING
// ============================================================================

export interface PlanLimits {
  maxNotes: number;
  maxEntities: number;
  maxHabits: number;
  advancedMetrics: boolean;
  dataExport: boolean;
  calendarSync: boolean;
}

export interface PlanInfo {
  plan: PlanType;
  limits: PlanLimits;
  priceId: string;
  monthlyPrice?: number;
  yearlyPrice?: number;
}

export interface SubscriptionDTO {
  id: string;
  userId: string;
  effectivePlan: PlanType;
  status: SubscriptionStatus;
  maxEntities: number;
  maxNotes: number;
  maxHabits: number;
  advancedMetrics: boolean;
  dataExport: boolean;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  inGracePeriod: boolean;
}

export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

// ============================================================================
// BUSCA
// ============================================================================

export interface SearchResultNoteDTO {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface SearchResultEntityDTO {
  id: string;
  title: string;
  type: EntityType;
  description: string;
}

export interface SearchResponseDTO {
  notes: SearchResultNoteDTO[];
  entities: SearchResultEntityDTO[];
}

// ============================================================================
// PASTAS
// ============================================================================

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FolderCreateRequest {
  name: string;
  parentId?: string;
}

// ============================================================================
// ERROS
// ============================================================================

export interface ApiError {
  status: number;
  message: string;
  details?: Record<string, unknown>;
}

export class ApiErrorClass extends Error implements ApiError {
  status: number;
  details?: Record<string, unknown>;

  constructor(status: number, message: string, details?: Record<string, unknown>) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = "ApiError";
  }
}
