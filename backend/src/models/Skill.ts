import mongoose, { Document, Schema } from 'mongoose';

export type SkillCategory =
  | 'Testing'
  | 'Automation'
  | 'Languages'
  | 'Tools'
  | 'Frameworks'
  | 'Cloud'
  | 'CI/CD'
  | 'Databases'
  | 'Other';

export type Proficiency = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | string;

export interface ISkill extends Document {
  name: string;
  category: SkillCategory;
  proficiency?: Proficiency;
  iconUrl?: string;
  order: number;
}

const SkillSchema = new Schema<ISkill>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    category: {
      type: String,
      required: true,
    },
    proficiency: {
      type: String,
      required: false,
    },
    iconUrl: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SkillSchema.index({ category: 1, order: 1 });

export const Skill = mongoose.model<ISkill>('Skill', SkillSchema);
