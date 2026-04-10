import mongoose, { Document, Schema } from 'mongoose';

export interface IEducation extends Document {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number | null;
  grade?: string;
  description?: string;
  logoUrl?: string;
}

const EducationSchema = new Schema<IEducation>(
  {
    institution: { type: String, required: true, trim: true, maxlength: 200 },
    degree: { type: String, required: true, trim: true, maxlength: 200 },
    field: { type: String, trim: true, maxlength: 200 },
    startYear: { type: Number, required: true, min: 1950, max: 2100 },
    endYear: { type: Number, default: null, min: 1950, max: 2100 },
    grade: { type: String, trim: true, maxlength: 50 },
    description: { type: String, trim: true, maxlength: 1000 },
    logoUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

EducationSchema.index({ startYear: -1 });

export const Education = mongoose.model<IEducation>('Education', EducationSchema);
