import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  company?: string;
  domain?: string;
  period?: string;
  description: string;
  topMetric?: string;
  achievements?: string[];
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  testReportUrl?: string;
  imageUrl?: string;
  featured: boolean;
  order: number;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    company: { type: String, trim: true, maxlength: 150 },
    domain: { type: String, trim: true, maxlength: 100 },
    period: { type: String, trim: true, maxlength: 100 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    topMetric: { type: String, trim: true, maxlength: 200 },
    achievements: [{ type: String, trim: true }],
    techStack: [{ type: String, trim: true }],
    githubUrl: { type: String, trim: true },
    liveUrl: { type: String, trim: true },
    testReportUrl: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProjectSchema.index({ order: 1, createdAt: -1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
