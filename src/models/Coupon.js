import mongoose, { Schema } from 'mongoose';

// =============================================
// Coupon Model (Database Schema)
// =============================================
// This model defines how discount coupons are stored in MongoDB.
// Coupons can give flat discounts (e.g., ₹50 off) or
// percentage discounts (e.g., 20% off).
//
// Example coupon: "WELCOME50" → ₹50 flat discount on orders above ₹299

// Define the structure (schema) for coupon documents
const CouponSchema = new Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },   // e.g., "WELCOME50"
    discountType: { type: String, enum: ['percentage', 'flat'], default: 'percentage' }, // Type of discount
    discountValue: { type: Number, required: true, min: 0 },      // How much discount (50 = ₹50 or 50%)
    minOrderAmount: { type: Number, default: 0 },                 // Minimum order to use this coupon
    maxDiscount: { type: Number },                                // Maximum discount cap (for percentage type)
    expiresAt: { type: Date },                                    // When does the coupon expire?
    usageLimit: { type: Number, default: 1000 },                  // How many times can it be used total?
    usedCount: { type: Number, default: 0 },                      // How many times has it been used?
    isActive: { type: Boolean, default: true },                   // Is the coupon currently active?
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create the model (or reuse if it already exists — important for Next.js hot reload)
const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);

export default Coupon;
