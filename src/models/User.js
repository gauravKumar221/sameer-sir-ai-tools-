import mongoose, { Schema } from 'mongoose';

// =============================================
// User Model (Database Schema)
// =============================================
// This model defines how user accounts are stored in MongoDB.
//
// Each user has:
// - Basic info (name, email, password hash)
// - Role: "user" (student) or "admin"
// - Points system (earn points on purchases, redeem for discounts)
// - List of purchased course guides
//
// IMPORTANT: We never store plain passwords!
// We store a "hash" (encrypted version) of the password.

// Sub-schema: Tracks which courses the user has purchased
const PurchasedGuideSchema = new Schema({
  guideId: { type: Schema.Types.ObjectId, ref: 'Guide', required: true },   // Which course
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },   // Which order
  purchasedAt: { type: Date, default: Date.now },                           // When was it bought
  lastReadPage: { type: Number, default: 1 },                               // Last page the user read
});

// Sub-schema: Tracks points history (earned, redeemed, adjusted by admin)
const PointsHistorySchema = new Schema({
  type: { type: String, enum: ['earned', 'redeemed', 'adjusted'], required: true },  // What happened
  amount: { type: Number, required: true },          // How many points
  reason: { type: String, required: true },           // Why (e.g., "Earned from purchase of...")
  date: { type: Date, default: Date.now },            // When
});

// Main User schema
const UserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },                          // User's full name
    email: { type: String, required: true, unique: true, lowercase: true, trim: true }, // Email (unique, lowercase)
    passwordHash: { type: String, required: true },                              // Encrypted password
    role: { type: String, enum: ['user', 'admin'], default: 'user' },            // User role
    avatar: { type: String, default: '' },                                       // Profile picture URL
    purchasedGuides: [PurchasedGuideSchema],                                     // Courses this user owns
    points: { type: Number, default: 0 },                                        // Current points balance
    pointsHistory: [PointsHistorySchema],                                        // Points transaction log
    resetPasswordToken: { type: String },                                        // For password reset
    resetPasswordExpire: { type: Date },                                         // Token expiry
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Create an index on the 'role' field for faster queries
UserSchema.index({ role: 1 });

// Create the model (or reuse if already exists)
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User;
