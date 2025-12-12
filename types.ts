export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  DRAFT = 'DRAFT',
  ENDED = 'ENDED'
}

export enum CampaignType {
  SEARCH = 'Search',
  DISPLAY = 'Display',
  SOCIAL = 'Social',
  VIDEO = 'Video',
  AFFILIATE = 'Affiliate'
}

export interface AdCreative {
  headline: string;
  description: string;
  keywords: string[];
}

export interface DailySchedule {
  start: string;
  end: string;
  active: boolean;
}

export interface AdSchedule {
  type: '24/7' | 'custom';
  days: Record<string, DailySchedule>;
}

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  startDate: string;
  creatives?: AdCreative[];
  adSchedule?: AdSchedule;
  // Persisted form data for editing
  productName?: string;
  productDescription?: string;
  targetAudience?: string;
  landingPageUrl?: string;
  negativeKeywords?: string;
}

export interface MetricData {
  name: string;
  value: number;
  date: string;
}

export interface GeneratedAdContent {
  headlines: string[];
  descriptions: string[];
  keywords: string[];
  strategyAdvice: string;
}

export interface ScannedWebsiteData {
  productName: string;
  productDescription: string;
  targetAudience: string;
  sources?: string[];
}

export interface Audience {
  id: string;
  name: string;
  description: string;
  size: string; // e.g., "1.2M - 1.5M"
  type: 'Custom' | 'Lookalike' | 'Saved';
}

export interface Asset {
  id: string;
  name: string;
  type: 'Image' | 'Video' | 'Logo';
  url: string;
  uploadDate: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}