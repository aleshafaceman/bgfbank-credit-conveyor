import { create } from 'zustand';
import type { User, Application, Property, PackageOption, AppState } from '../types';

interface AppStore extends AppState {
  // User state
  user: User | null;
  
  // Applications
  applications: Application[];
  selectedApplicationId: string | null;
  
  // Properties
  properties: Property[];
  
  // Packages
  packages: PackageOption[];
  selectedPackage: PackageOption | null;
  
  // UI state
  currentPage: string;
  isSidebarOpen: boolean;
  isChatOpen: boolean;
  
  // Actions
  setUser: (user: User | null) => void;
  setApplications: (apps: Application[]) => void;
  setSelectedApplication: (id: string | null) => void;
  setProperties: (props: Property[]) => void;
  setPackages: (pkgs: PackageOption[]) => void;
  setSelectedPackage: (pkg: PackageOption | null) => void;
  setCurrentPage: (page: string) => void;
  toggleSidebar: () => void;
  toggleChat: () => void;
  
  // Conveyor actions
  setDesiredAmount: (amount: number) => void;
  setDesiredTerm: (term: number) => void;
  setSelectedCollateral: (id: string | null) => void;
  setFlowType: (type: 'esia' | 'manual') => void;
  acceptOffer: () => void;
  resetConveyor: () => void;
}

const initialState: AppState = {
  desiredAmount: 5000000,
  desiredTerm: 15,
  collateralValue: 8500000,
  baseLTV: 0.60,
  currentLTV: 0.60,
  baseRate: 12.5,
  currentRate: 12.5,
  baseLimit: 5400000,
  currentLimit: 5400000,
  basePayment: 54000,
  currentPayment: 54000,
  baseTerm: 15,
  currentTerm: 15,
  hasCoBorrower: false,
  flowType: 'esia',
  selectedCollateralId: null,
  selectedPackageId: 'PKG_RECOMMENDED',
  packageModifiers: {
    ltvBoost: false,
    coBorrower: false,
    fixedRate: false,
  },
  offerValidUntil: null,
  offerAccepted: false,
  conveyorAppId: null,
};

export const useAppStore = create<AppStore>((set) => ({
  ...initialState,
  
  // User state
  user: null,
  
  // Applications
  applications: [],
  selectedApplicationId: null,
  
  // Properties
  properties: [],
  
  // Packages
  packages: [],
  selectedPackage: null,
  
  // UI state
  currentPage: 'dashboard',
  isSidebarOpen: true,
  isChatOpen: false,
  
  // Actions
  setUser: (user) => set({ user }),
  setApplications: (apps) => set({ applications: apps }),
  setSelectedApplication: (id) => set({ selectedApplicationId: id }),
  setProperties: (props) => set({ properties: props }),
  setPackages: (pkgs) => set({ packages: pkgs }),
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
  setCurrentPage: (page) => set({ currentPage: page }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),
  
  // Conveyor actions
  setDesiredAmount: (amount) => set({ 
    desiredAmount: amount,
    currentLimit: Math.min(amount, Math.floor(8500000 * 0.6))
  }),
  setDesiredTerm: (term) => set({ desiredTerm: term, currentTerm: term }),
  setSelectedCollateral: (id) => set({ selectedCollateralId: id }),
  setFlowType: (type) => set({ flowType: type }),
  acceptOffer: () => set({ offerAccepted: true }),
  resetConveyor: () => set({
    ...initialState,
    selectedCollateralId: null,
    selectedPackageId: 'PKG_RECOMMENDED',
    offerAccepted: false,
  }),
}));
