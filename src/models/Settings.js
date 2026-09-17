import mongoose, { Schema } from 'mongoose';

// =============================================
// Settings Model (Database Schema)
// =============================================
// This model stores platform-wide configuration settings.
// There should only be ONE settings document in the database.
//
// These settings control:
// - Platform name
// - Points system (earn rate, redeem rate)
// - Payment gateway keys (Razorpay, Stripe)
// - Support email

const SettingsSchema = new Schema(
  {
    platformName: { type: String, default: 'LearnForge PDF Academy' },         // Name of the platform
    pointsEarnRate: { type: Number, default: 10 },      // 10 = users earn 10% of purchase as points
    pointsRedeemRate: { type: Number, default: 0.5 },    // 0.5 = 1 point = ₹0.50 discount
    razorpayKeyId: { type: String, default: '' },        // Razorpay API key
    razorpayKeySecret: { type: String, default: '' },    // Razorpay secret key
    razorpayEnabled: { type: Boolean, default: false },  // Is Razorpay payment enabled?
    stripePublishableKey: { type: String, default: '' }, // Stripe public key
    stripeSecretKey: { type: String, default: '' },      // Stripe secret key
    stripeEnabled: { type: Boolean, default: false },    // Is Stripe payment enabled?
    testGatewayEnabled: { type: Boolean, default: true },// Is test/demo payment enabled?
    supportEmail: { type: String, default: 'support@learnforge.io' }, // Support contact email
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Create the model (or reuse if already exists)
const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export default Settings;
