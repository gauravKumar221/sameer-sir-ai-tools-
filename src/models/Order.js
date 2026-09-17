import mongoose, { Schema } from 'mongoose';

// =============================================
// Order Model (Database Schema)
// =============================================
// This model defines how purchase orders are stored in MongoDB.
// Every time a user buys a course, an order record is created.
//
// Order flow:
// 1. User clicks "Buy" → Order created with status "pending"
// 2. Payment is verified → Status changes to "success"
// 3. User gets access to the course PDF

const OrderSchema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true },                  // e.g., "ORD-1694000000-1234"
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },     // Who placed the order
    guideId: { type: Schema.Types.ObjectId, ref: 'Guide', required: true, index: true },   // Which course was bought
    guideTitle: { type: String, required: true },                                 // Course title (for quick display)
    guideCover: { type: String, required: true },                                 // Course cover image URL
    amount: { type: Number, required: true },                                     // Final amount paid (₹)
    originalPrice: { type: Number, required: true },                              // Original course price
    discountAmount: { type: Number, default: 0 },                                // Total discount applied
    pointsRedeemed: { type: Number, default: 0 },                                // Points used for discount
    pointsEarned: { type: Number, default: 0 },                                  // Points earned from this purchase
    couponCode: { type: String, default: '' },                                    // Coupon used (if any)
    paymentGateway: { type: String, enum: ['razorpay', 'stripe', 'test'], default: 'test' }, // Payment method
    paymentGatewayOrderId: { type: String },                                      // Payment gateway's order ID
    paymentGatewayPaymentId: { type: String },                                    // Payment gateway's payment ID
    paymentGatewaySignature: { type: String },                                    // Payment verification signature
    status: { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending', index: true },
    customerDetails: {
      name: { type: String, required: true },                                     // Buyer's name
      email: { type: String, required: true },                                    // Buyer's email
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

// Create the model (or reuse if already exists)
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);

export default Order;
