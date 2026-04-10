import mongoose, { Document, Schema } from 'mongoose';

export interface ICertification extends Document {
  name: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date | null;
  credentialId?: string;
  credentialUrl?: string;
  badgeUrl?: string;
}

const CertificationSchema = new Schema<ICertification>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    issuer: { type: String, required: true, trim: true, maxlength: 200 },
    issueDate: { type: Date, required: true },
    expiryDate: { type: Date, default: null },
    credentialId: { type: String, trim: true, maxlength: 200 },
    credentialUrl: { type: String, trim: true },
    badgeUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

CertificationSchema.index({ issueDate: -1 });

export const Certification = mongoose.model<ICertification>('Certification', CertificationSchema);
