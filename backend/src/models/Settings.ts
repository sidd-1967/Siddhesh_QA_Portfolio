import mongoose, { Document, Schema } from 'mongoose';

export interface ISectionHeader {
  title: string;
  subtitle: string;
}

export interface ISettings extends Document {
  skillCategories: string[];
  skillProficiencies: string[];
  sectionHeaders: {
    hero: ISectionHeader;
    about: ISectionHeader;
    skills: ISectionHeader;
    experience: ISectionHeader;
    projects: ISectionHeader;
    education: ISectionHeader;
    certifications: ISectionHeader;
    contact: ISectionHeader;
  };
}

const SectionHeaderSchema = new Schema({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
}, { _id: false });

const SettingsSchema = new Schema<ISettings>(
  {
    skillCategories: { type: [String], default: ['Testing', 'Automation', 'Languages', 'Tools', 'Frameworks', 'CI/CD', 'Cloud', 'Databases', 'Other'] },
    skillProficiencies: { type: [String], default: ['Beginner', 'Intermediate', 'Advanced', 'Expert'] },
    sectionHeaders: {
      hero: { type: SectionHeaderSchema, default: { title: 'Hi, I\'m {name}', subtitle: 'QA Engineer | Test Automation Specialist' } },
      about: { type: SectionHeaderSchema, default: { title: 'Passion for Quality', subtitle: 'About Me' } },
      skills: { type: SectionHeaderSchema, default: { title: 'What I Work With', subtitle: 'Skills & Tech Stack' } },
      experience: { type: SectionHeaderSchema, default: { title: 'Work History', subtitle: 'Experience' } },
      projects: { type: SectionHeaderSchema, default: { title: 'Featured Work', subtitle: 'Projects' } },
      education: { type: SectionHeaderSchema, default: { title: 'Education', subtitle: 'Background' } },
      certifications: { type: SectionHeaderSchema, default: { title: 'Certifications', subtitle: 'Credentials' } },
      contact: { type: SectionHeaderSchema, default: { title: 'Contact Me', subtitle: 'Get in Touch' } },
    },
  },
  { timestamps: true }
);

// Ensure only one settings document exists
export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);
