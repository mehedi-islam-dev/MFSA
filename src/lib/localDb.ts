import Dexie, { Table } from 'dexie';

// ==========================================
// 1. ROBUST TYPESCRIPT INTERFACES & SCHEMAS
// ==========================================

export interface StockAssessment {
  id?: number; // Auto-incremented primary key
  species: string;
  region: string;
  biomassIndex: number;
  spr: number;
  timestamp: string;
}

export interface MicroplasticsData {
  id?: number;
  sampleLocation: string;
  concentration: number;
  polymerType: 'PE' | 'PP' | 'PS' | 'PVC' | 'Other';
  toxicityLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  timestamp: string;
}

export interface PolicyReport {
  id?: number;
  title: string;
  templateType: string;
  content: string; // Serialized JSON string of paragraphs/metrics
  status: 'Draft' | 'Approved' | 'Archived';
  timestamp: string;
  syncStatus: 'Local' | 'Synced';
}

// ==========================================
// 2. DEXIE.JS DATABASE CONFIGURATION
// ==========================================

export class MarineAnalyticaDB extends Dexie {
  stockAssessments!: Table<StockAssessment, number>;
  microplasticsData!: Table<MicroplasticsData, number>;
  policyReports!: Table<PolicyReport, number>;

  constructor() {
    super('MarineAnalyticaDB');
    
    // Define schema: primary keys and indexed fields for fast querying
    this.version(1).stores({
      stockAssessments: '++id, species, region, spr, timestamp',
      microplasticsData: '++id, sampleLocation, polymerType, toxicityLevel, timestamp',
      policyReports: '++id, title, templateType, status, syncStatus, timestamp'
    });
  }
}

export const db = new MarineAnalyticaDB();

// ==========================================
// 3. ASYNC CRUD OPERATIONS ENGINE
// ==========================================

export const LocalDB = {
  // --- Stock Assessments ---
  async saveStockAssessment(data: Omit<StockAssessment, 'id'>): Promise<number> {
    return await db.stockAssessments.add(data);
  },
  
  async getStockAssessmentsByRegion(region: string): Promise<StockAssessment[]> {
    return await db.stockAssessments
      .where('region').equals(region)
      .reverse()
      .sortBy('timestamp');
  },

  // --- Microplastics Data ---
  async saveMicroplasticsData(data: Omit<MicroplasticsData, 'id'>): Promise<number> {
    return await db.microplasticsData.add(data);
  },

  async getCriticalToxicityZones(): Promise<MicroplasticsData[]> {
    return await db.microplasticsData
      .where('toxicityLevel').anyOf(['High', 'Critical'])
      .reverse()
      .sortBy('timestamp');
  },

  // --- Policy Reports ---
  async savePolicyReport(data: Omit<PolicyReport, 'id'>): Promise<number> {
    return await db.policyReports.add(data);
  },

  async getAllPolicyReports(): Promise<PolicyReport[]> {
    return await db.policyReports.orderBy('timestamp').reverse().toArray();
  },

  async getUnsyncedReports(): Promise<PolicyReport[]> {
    return await db.policyReports
      .where('syncStatus').equals('Local')
      .toArray();
  },

  async markReportAsSynced(id: number): Promise<number> {
    return await db.policyReports.update(id, { syncStatus: 'Synced' });
  },

  async deletePolicyReport(id: number): Promise<void> {
    await db.policyReports.delete(id);
  }
};
