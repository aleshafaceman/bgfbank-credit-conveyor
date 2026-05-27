export interface User {
  phone: string;
  name: string;
  isAuthenticated: boolean;
  isTwoFactorEnabled: boolean;
}

export interface Application {
  id: string;
  client: string;
  phone: string;
  product: string;
  amount: number;
  term: number;
  rate: number | null;
  payment: number | null;
  collateralAddress: string;
  collateralValue: number;
  status: 'new' | 'processing' | 'valuation' | 'prescoring' | 'approved' | 'rejected';
  statusLabel: string;
  date: string;
  documents: DocumentStatus[];
  history: HistoryItem[];
}

export interface DocumentStatus {
  name: string;
  status: 'missing' | 'uploaded' | 'verified';
  statusLabel: string;
}

export interface HistoryItem {
  text: string;
  date: string;
  current: boolean;
}

export interface Property {
  id: string;
  type: 'flat' | 'apartment' | 'house';
  typeLabel: string;
  address: string;
  cadastral?: string;
  area: number;
  floor?: string;
  year?: number;
  material?: 'brick' | 'panel' | 'monolith';
  materialLabel?: string;
  valuation: number | null;
  valuationDate?: string | null;
  status: 'ready' | 'partial';
  documents: string[];
}

export interface PackageOption {
  id: string;
  label: string;
  rate: number;
  payment: number;
  maxAmount: number;
  ltv: number;
  insurance: boolean;
  commission: number;
  features: string[];
  recommended?: boolean;
}

export interface AppState {
  desiredAmount: number;
  desiredTerm: number;
  collateralValue: number;
  baseLTV: number;
  currentLTV: number;
  baseRate: number;
  currentRate: number;
  baseLimit: number;
  currentLimit: number;
  basePayment: number;
  currentPayment: number;
  baseTerm: number;
  currentTerm: number;
  hasCoBorrower: boolean;
  flowType: 'esia' | 'manual';
  selectedCollateralId: string | null;
  selectedPackageId: string;
  packageModifiers: {
    ltvBoost: boolean;
    coBorrower: boolean;
    fixedRate: boolean;
  };
  offerValidUntil: string | null;
  offerAccepted: boolean;
  conveyorAppId: string | null;
}
