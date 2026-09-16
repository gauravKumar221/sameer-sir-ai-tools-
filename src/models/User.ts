import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPurchasedGuide {
  guideId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  purchasedAt: Date;
  lastReadPage?: number;
}

export interface IPointsHistory {
  type: 'earned' | 'redeemed' | 'adjusted';
  amount: number;
  reason: string;
  date: Date;
}

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  role: 'user' | 'admin';
  avatar?: string;
  purchasedGuides: IPurchasedGuide[];
  points: number;
  pointsHistory: IPointsHistory[];
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PurchasedGuideSchema = new Schema<IPurchasedGuide>({
  guideId: { type: Schema.Types.ObjectId, ref: 'Guide', required: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  purchasedAt: { type: Date, default: Date.now },
  lastReadPage: { type: Number, default: 1 },
});

const PointsHistorySchema = new Schema<IPointsHistory>({
  type: { type: String, enum: ['earned', 'redeemed', 'adjusted'], required: true },
  amount: { type: Number, required: true },
  reason: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: String, default: '' },
    purchasedGuides: [PurchasedGuideSchema],
    points: { type: Number, default: 0 },
    pointsHistory: [PointsHistorySchema],
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  { timestamps: true }
);

// Indexes
UserSchema.index({ role: 1 });

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
