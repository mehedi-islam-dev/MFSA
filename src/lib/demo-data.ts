import { FishSample } from "@/types";
import { v4 as uuidv4 } from "uuid";

// ============================================================
// Realistic Barramundi (Lates calcarifer) Demo Dataset
// Based on published LWR: a=0.00861, b=3.05 (Fishbase)
// 50 samples with natural variation (±8%)
// ============================================================

const barramundiBase: Omit<FishSample, "id">[] = [
  { totalLength: 18.2, weight: 58.4, sex: "U", maturityStage: 1, collectionDate: "2024-03-01", location: "Cochin Estuary", species: "Lates calcarifer" },
  { totalLength: 20.5, weight: 79.2, sex: "U", maturityStage: 1, collectionDate: "2024-03-01", location: "Cochin Estuary", species: "Lates calcarifer" },
  { totalLength: 22.1, weight: 99.6, sex: "M", maturityStage: 2, collectionDate: "2024-03-02", location: "Cochin Estuary", species: "Lates calcarifer" },
  { totalLength: 24.8, weight: 138.5, sex: "M", maturityStage: 2, collectionDate: "2024-03-02", location: "Vembanad Lake", species: "Lates calcarifer" },
  { totalLength: 26.3, weight: 165.2, sex: "M", maturityStage: 2, collectionDate: "2024-03-03", location: "Vembanad Lake", species: "Lates calcarifer" },
  { totalLength: 28.7, weight: 213.8, sex: "M", maturityStage: 2, collectionDate: "2024-03-03", location: "Vembanad Lake", species: "Lates calcarifer" },
  { totalLength: 30.1, weight: 247.6, sex: "F", maturityStage: 3, collectionDate: "2024-03-05", location: "Periyar River", species: "Lates calcarifer" },
  { totalLength: 32.4, weight: 305.4, sex: "F", maturityStage: 3, collectionDate: "2024-03-05", location: "Periyar River", species: "Lates calcarifer" },
  { totalLength: 34.9, weight: 380.1, sex: "F", maturityStage: 3, collectionDate: "2024-03-06", location: "Periyar River", species: "Lates calcarifer" },
  { totalLength: 36.2, weight: 418.7, sex: "F", maturityStage: 3, collectionDate: "2024-03-06", location: "Vembanad Lake", species: "Lates calcarifer" },
  { totalLength: 38.5, weight: 503.2, sex: "F", maturityStage: 3, collectionDate: "2024-03-07", location: "Vembanad Lake", species: "Lates calcarifer" },
  { totalLength: 40.1, weight: 568.9, sex: "F", maturityStage: 4, collectionDate: "2024-03-07", location: "Cochin Estuary", species: "Lates calcarifer" },
  { totalLength: 42.3, weight: 658.4, sex: "F", maturityStage: 4, collectionDate: "2024-03-08", location: "Cochin Estuary", species: "Lates calcarifer" },
  { totalLength: 44.8, weight: 778.6, sex: "F", maturityStage: 4, collectionDate: "2024-03-09", location: "Ponnani", species: "Lates calcarifer" },
  { totalLength: 46.5, weight: 870.3, sex: "F", maturityStage: 4, collectionDate: "2024-03-09", location: "Ponnani", species: "Lates calcarifer" },
  { totalLength: 48.2, weight: 970.1, sex: "F", maturityStage: 4, collectionDate: "2024-03-10", location: "Ponnani", species: "Lates calcarifer" },
  { totalLength: 50.6, weight: 1112.5, sex: "F", maturityStage: 5, collectionDate: "2024-03-10", location: "Kozhikode", species: "Lates calcarifer" },
  { totalLength: 52.1, weight: 1218.7, sex: "F", maturityStage: 5, collectionDate: "2024-03-11", location: "Kozhikode", species: "Lates calcarifer" },
  { totalLength: 54.7, weight: 1404.8, sex: "F", maturityStage: 5, collectionDate: "2024-03-12", location: "Kozhikode", species: "Lates calcarifer" },
  { totalLength: 56.3, weight: 1532.6, sex: "F", maturityStage: 5, collectionDate: "2024-03-12", location: "Kannur", species: "Lates calcarifer" },
  { totalLength: 58.9, weight: 1748.3, sex: "F", maturityStage: 5, collectionDate: "2024-03-13", location: "Kannur", species: "Lates calcarifer" },
  { totalLength: 60.4, weight: 1889.6, sex: "F", maturityStage: 5, collectionDate: "2024-03-14", location: "Kannur", species: "Lates calcarifer" },
  { totalLength: 25.6, weight: 154.3, sex: "M", maturityStage: 2, collectionDate: "2024-03-15", location: "Cochin Estuary", species: "Lates calcarifer" },
  { totalLength: 29.4, weight: 238.1, sex: "M", maturityStage: 2, collectionDate: "2024-03-15", location: "Cochin Estuary", species: "Lates calcarifer" },
  { totalLength: 33.7, weight: 346.9, sex: "F", maturityStage: 3, collectionDate: "2024-03-16", location: "Vembanad Lake", species: "Lates calcarifer" },
  { totalLength: 37.8, weight: 472.5, sex: "F", maturityStage: 3, collectionDate: "2024-03-16", location: "Vembanad Lake", species: "Lates calcarifer" },
  { totalLength: 43.1, weight: 685.2, sex: "F", maturityStage: 4, collectionDate: "2024-03-17", location: "Periyar River", species: "Lates calcarifer" },
  { totalLength: 47.9, weight: 952.7, sex: "F", maturityStage: 4, collectionDate: "2024-03-17", location: "Periyar River", species: "Lates calcarifer" },
  { totalLength: 53.5, weight: 1310.4, sex: "F", maturityStage: 5, collectionDate: "2024-03-18", location: "Kozhikode", species: "Lates calcarifer" },
  { totalLength: 57.2, weight: 1612.8, sex: "F", maturityStage: 5, collectionDate: "2024-03-18", location: "Kozhikode", species: "Lates calcarifer" },
  { totalLength: 19.8, weight: 70.1, sex: "U", maturityStage: 1, collectionDate: "2024-03-19", location: "Ponnani", species: "Lates calcarifer" },
  { totalLength: 23.5, weight: 118.6, sex: "U", maturityStage: 1, collectionDate: "2024-03-19", location: "Ponnani", species: "Lates calcarifer" },
  { totalLength: 27.6, weight: 195.4, sex: "M", maturityStage: 2, collectionDate: "2024-03-20", location: "Ponnani", species: "Lates calcarifer" },
  { totalLength: 31.9, weight: 278.3, sex: "F", maturityStage: 3, collectionDate: "2024-03-20", location: "Vembanad Lake", species: "Lates calcarifer" },
  { totalLength: 35.5, weight: 397.2, sex: "F", maturityStage: 3, collectionDate: "2024-03-21", location: "Vembanad Lake", species: "Lates calcarifer" },
  { totalLength: 39.7, weight: 542.8, sex: "F", maturityStage: 4, collectionDate: "2024-03-21", location: "Cochin Estuary", species: "Lates calcarifer" },
  { totalLength: 45.3, weight: 820.5, sex: "F", maturityStage: 4, collectionDate: "2024-03-22", location: "Cochin Estuary", species: "Lates calcarifer" },
  { totalLength: 49.8, weight: 1065.2, sex: "F", maturityStage: 5, collectionDate: "2024-03-22", location: "Kannur", species: "Lates calcarifer" },
  { totalLength: 55.1, weight: 1458.9, sex: "F", maturityStage: 5, collectionDate: "2024-03-23", location: "Kannur", species: "Lates calcarifer" },
  { totalLength: 61.8, weight: 2012.4, sex: "F", maturityStage: 5, collectionDate: "2024-03-24", location: "Kozhikode", species: "Lates calcarifer" },
  { totalLength: 21.3, weight: 88.9, sex: "U", maturityStage: 1, collectionDate: "2024-03-25", location: "Periyar River", species: "Lates calcarifer" },
  { totalLength: 26.8, weight: 182.1, sex: "M", maturityStage: 2, collectionDate: "2024-03-25", location: "Periyar River", species: "Lates calcarifer" },
  { totalLength: 34.1, weight: 358.7, sex: "F", maturityStage: 3, collectionDate: "2024-03-26", location: "Periyar River", species: "Lates calcarifer" },
  { totalLength: 41.6, weight: 622.3, sex: "F", maturityStage: 4, collectionDate: "2024-03-26", location: "Vembanad Lake", species: "Lates calcarifer" },
  { totalLength: 51.4, weight: 1168.5, sex: "F", maturityStage: 5, collectionDate: "2024-03-27", location: "Vembanad Lake", species: "Lates calcarifer" },
  { totalLength: 59.3, weight: 1795.6, sex: "F", maturityStage: 5, collectionDate: "2024-03-27", location: "Kannur", species: "Lates calcarifer" },
  { totalLength: 28.1, weight: 204.7, sex: "M", maturityStage: 2, collectionDate: "2024-03-28", location: "Cochin Estuary", species: "Lates calcarifer" },
  { totalLength: 38.0, weight: 483.6, sex: "F", maturityStage: 3, collectionDate: "2024-03-28", location: "Cochin Estuary", species: "Lates calcarifer" },
  { totalLength: 47.2, weight: 912.4, sex: "F", maturityStage: 4, collectionDate: "2024-03-29", location: "Ponnani", species: "Lates calcarifer" },
  { totalLength: 63.5, weight: 2198.7, sex: "F", maturityStage: 5, collectionDate: "2024-03-30", location: "Kozhikode", species: "Lates calcarifer" },
];

export const DEMO_DATA: FishSample[] = barramundiBase.map((s) => ({
  ...s,
  id: uuidv4(),
}));

export const DEMO_SPECIES = "Lates calcarifer";
export const DEMO_LOCATION = "Kerala Coastal Waters, India";
export const DEMO_REPORT_META = {
  title: "Length-Weight Relationship Analysis",
  species: "Barramundi (Lates calcarifer)",
  author: "Marine Analytica Demo",
  institution: "Demo Institution",
  date: new Date().toISOString().split("T")[0],
  location: "Kerala Coastal Waters, India",
};
