import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  orderNumber: string;
  userId: mongoose.Types.ObjectId;
  guideId: mongoose.Types.ObjectId;
  guideTitle: string;
  guideCover: string;
  amount: number;
  originalPrice: number;
  discountAmount: number;
  pointsRedeemed: number;
  pointsEarned: number;
  couponCode?: string;
  paymentGateway: 'razorpay' | 'stripe' | 'test';
  paymentGatewayOrderId?: string;
  paymentGatewayPaymentId?: string;
  paymentGatewaySignature?: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  customerDetails: {
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    guideId: { type: Schema.Types.ObjectId, ref: 'Guide', required: true, index: true },
    guideTitle: { type: String, required: true },
    guideCover: { type: String, required: true },
    amount: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discountAmount: { type: Number, default: 0 },
    pointsRedeemed: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 },
    couponCode: { type: String, default: '' },
    paymentGateway: { type: String, enum: ['razorpay', 'stripe', 'test'], default: 'test' },
    paymentGatewayOrderId: { type: String },
    paymentGatewayPaymentId: { type: String },
    paymentGatewaySignature: { type: String },
    status: { type: String, enum: ['pending', 'success', 'failed', 'refunded'], default: 'pending', index: true },
    customerDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
