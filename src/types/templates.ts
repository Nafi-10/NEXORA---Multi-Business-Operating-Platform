import { BusinessType } from './entity';

export interface IndustryTemplate {
  id: string;
  name: string;
  businessType: BusinessType;
  description: string;
  defaultCurrency: string;
  standardModules: string[];
  recommendedChartAccountsCount: number;
  tags: string[];
  sampleRoles: string[];
}

export interface BusinessOnboardingInput {
  name: string;
  code: string;
  type: BusinessType;
  currency: string;
  country: string;
  taxId: string;
  fiscalYearStart: string;
  templateId: string;
  adminEmail: string;
  initialCashUSD: number;
}
