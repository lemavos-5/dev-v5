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
  token: string;
  userId: string;
  username: string;
  email: string;
  plan: Plan;
}

export type Plan = 'FREE' | 'PLUS' | 'PRO' | 'VISION';
export type SubscriptionStatus = 'ACTIVE' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE' | 'TRIALING' | 'UNPAID';

export interface UserContext {
  id: string;
  username: string;
  email: string;
  role: string;
  active: boolean;
  plan: Plan;
  subscriptionStatus: SubscriptionStatus;
  maxEntities: number;
  maxNotes: number;
  maxHabits: number;
  historyDays: number;
  advancedMetrics: boolean;
  dataExport: boolean;
  calendarSync: boolean;
  subscriptionEndsAt: string | null;
  cancelAtPeriodEnd: boolean;
}

export interface NoteMetadata {
  id: string;
  userId: string;
  title: string;
  entityIds: string[];
  createdAt: string;
  updatedAt: string;
  content?: string;
}

export interface Entity {
  id: string;
  userId: string;
  name: string;
  type: EntityType;
  description: string;
}

export interface NoteResponse extends NoteMetadata {
  content: string;
}

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

export type EntityType = 'PERSON' | 'TECH' | 'PROJECT' | 'CONCEPT';

export interface Entity {
  id: string;
  userId: string;
  name: string;
  type: EntityType;
  description: string;
}

export interface EntityCreateRequest {
  name: string;
  description?: string;
  type?: EntityType;
}

export interface EntityUpdateRequest {
  name?: string;
  description?: string;
  type?: EntityType;
}

export interface Folder {
  id: string;
  userId: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionDTO {
  id: string;
  userId: string;
  effectivePlan: Plan;
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
  sessionId: string;
  url: string;
}

export interface PlanInfo {
  plan: Plan;
  limits: {
    maxEntities: number;
    maxNotes: number;
    maxHabits: number;
    maxHistoryDays: number;
    maxMetadataSizeKb: number;
    advancedMetrics: boolean;
    dataExport: boolean;
    calendarSync: boolean;
  };
  priceId: string | null;
}

export interface DashboardMetrics {
  uniquePeople: number;
  uniqueProjects: number;
  uniqueHabits: number;
  totalMentions: number;
  totalNotes: number;
  totalEntities: number;
  topMentions: EntityMention[];
  topPeople: EntityMention[];
  topProjects: EntityMention[];
  topHabits: EntityMention[];
  habitsCompletedToday: string[];
  weeklyAverageCompletionRate: number;
  globalHeatmap: Record<string, number>;
}

export interface EntityMention {
  entityId: string;
  title: string;
  count: number;
  lastMentionedAt: string;
}

export interface TrackingEvent {
  id: string;
  entityId: string;
  userId: string;
  date: string;
  value: number;
  decimalValue: number | null;
  note: string | null;
  createdAt: string;
}

export interface TrackingStats {
  totalEvents: number;
  currentStreak: number;
  longestStreak: number;
  averageValue: number;
}

export interface ApiError {
  status: number;
  error: string;
  message?: string;
  fields?: Record<string, string>;
  timestamp: string;
}

// Mention and annotation types
export interface Mention {
  entityId: string;
  entityTitle: string;
  entityType?: EntityType;
  position: number;
  length: number;
}

export interface NoteWithMentions extends Note {
  mentions?: Mention[];
}

export interface EntitySearchResult {
  id: string;
  title: string;
  type?: EntityType;
  description?: string;
}

