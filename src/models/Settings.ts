import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
  platformName: string;
  pointsEarnRate: number; // e.g. 10 means 10 points per ₹100 spent (i.e. 10% value back in points)
  pointsRedeemRate: number; // e.g. 1 means 1 point = ₹1 discount (or 0.5 = ₹0.5 discount)
  razorpayKeyId: string;
  razorpayKeySecret: string;
  razorpayEnabled: boolean;
  stripePublishableKey: string;
  stripeSecretKey: string;
  stripeEnabled: boolean;
  testGatewayEnabled: boolean;
  supportEmail: string;
  updatedAt: Date;
}

const SettingsSchema = new Schema<ISettings>(
  {
    platformName: { type: String, default: 'LearnForge PDF Academy' },
    pointsEarnRate: { type: Number, default: 10 }, // 10% cashback in points
    pointsRedeemRate: { type: Number, default: 0.5 }, // 1 pt = ₹0.50
    razorpayKeyId: { type: String, default: '' },
    razorpayKeySecret: { type: String, default: '' },
    razorpayEnabled: { type: Boolean, default: false },
    stripePublishableKey: { type: String, default: '' },
    stripeSecretKey: { type: String, default: '' },
    stripeEnabled: { type: Boolean, default: false },
    testGatewayEnabled: { type: Boolean, default: true },
    supportEmail: { type: String, default: 'support@learnforge.io' },
  },
  { timestamps: true }
);

export const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
