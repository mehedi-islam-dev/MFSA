import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFishSample extends Document {
  userId: string;
  totalLength: number;
  forkLength?: number;
  standardLength?: number;
  weight: number;
  sex?: "M" | "F" | "U";
  maturityStage?: 1 | 2 | 3 | 4 | 5;
  collectionDate?: Date;
  location?: string;
  notes?: string;
  species?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FishSampleSchema = new Schema<IFishSample>(
  {
    userId: { type: String, required: true, index: true },
    totalLength: { type: Number, required: true, min: 0 },
    forkLength: { type: Number, min: 0 },
    standardLength: { type: Number, min: 0 },
    weight: { type: Number, required: true, min: 0 },
    sex: { type: String, enum: ["M", "F", "U"] },
    maturityStage: { type: Number, enum: [1, 2, 3, 4, 5] },
    collectionDate: { type: Date },
    location: { type: String, trim: true },
    notes: { type: String, trim: true },
    species: { type: String, trim: true, default: "Unknown" },
  },
  { timestamps: true }
);

// Compound index for efficient user + species queries
FishSampleSchema.index({ userId: 1, species: 1, createdAt: -1 });

const FishSampleModel: Model<IFishSample> =
  mongoose.models.FishSample ??
  mongoose.model<IFishSample>("FishSample", FishSampleSchema);

export default FishSampleModel;
