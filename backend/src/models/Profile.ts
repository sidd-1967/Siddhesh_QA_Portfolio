import mongoose, { Document, Schema } from 'mongoose';

export interface ISocialLinks {
  linkedin?: string;
  github?: string;
  twitter?: string;
  website?: string;
}

export interface IProfile extends Document {
  fullName: string;
  headline: string;
  bio: string;
  email: string;
  phone?: string;
  location: string;
  avatarUrl?: string;
  resumeUrl?: string;
  socialLinks: ISocialLinks;
  yearsOfExperience?: number;
  heroBio?: string;
  openToWork: boolean;
}

const ProfileSchema = new Schema<IProfile>(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 100 },
    headline: { type: String, required: true, trim: true, maxlength: 200 },
    bio: { type: String, trim: true, maxlength: 3000 },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    location: { type: String, trim: true, maxlength: 150 },
    avatarUrl: { type: String, trim: true },
    resumeUrl: { type: String, trim: true },
    socialLinks: {
      linkedin: { type: String, trim: true },
      github: { type: String, trim: true },
      twitter: { type: String, trim: true },
      website: { type: String, trim: true },
    },
    yearsOfExperience: { type: Number, min: 0 },
    heroBio: { type: String, trim: true, maxlength: 500 },
    openToWork: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Profile = mongoose.model<IProfile>('Profile', ProfileSchema);
