import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPdfFile {
  fileName: string;
  fileKey: string; // Relative storage path or secure S3/Cloudinary ID (never raw public URL)
  fileSize?: number;
  pageCount?: number;
  order: number;
}

export interface IGuide extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  coverImage: string;
  price: number;
  originalPrice?: number;
  category: string;
  tags: string[];
  previewPages: number; // Number of pages available for unpurchased preview
  pdfFiles: IPdfFile[];
  isActive: boolean;
  isFeatured: boolean;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  highlights: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PdfFileSchema = new Schema<IPdfFile>({
  fileName: { type: String, required: true },
  fileKey: { type: String, required: true },
  fileSize: { type: Number, default: 0 },
  pageCount: { type: Number, default: 1 },
  order: { type: Number, default: 0 },
});

const GuideSchema = new Schema<IGuide>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true },
    coverImage: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, min: 0 },
    category: { type: String, required: true, index: true },
    tags: [{ type: String, trim: true }],
    previewPages: { type: Number, default: 2 },
    pdfFiles: [PdfFileSchema],
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false, index: true },
    rating: { type: Number, default: 4.8 },
    reviewsCount: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels'], default: 'All Levels' },
    highlights: [{ type: String }],
  },
  { timestamps: true }
);

export const Guide: Model<IGuide> =
  mongoose.models.Guide || mongoose.model<IGuide>('Guide', GuideSchema);

export default Guide;
