import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
  company: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  description: string;
  techStack: string[];
  location?: string;
  companyUrl?: string;
  order: number;
  companyLogo?: string;
}

const ExperienceSchema = new Schema<IExperience>(
  {
    company: { type: String, required: true, trim: true, maxlength: 150 },
    role: { type: String, required: true, trim: true, maxlength: 150 },
    startDate: { type: String, required: true },
    endDate: { type: String, default: null },
    current: { type: Boolean, default: false },
    description: { type: String, trim: true, maxlength: 2000 },
    techStack: { type: [String], default: [] },
    location: { type: String, trim: true, maxlength: 150 },
    companyUrl: { type: String, trim: true },
    order: { type: Number, default: 0 },
    companyLogo: { type: String, trim: true },
  },
  { timestamps: true }
);

ExperienceSchema.index({ startDate: -1 });

export const Experience = mongoose.model<IExperience>('Experience', ExperienceSchema);
