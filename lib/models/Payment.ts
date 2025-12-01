import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  stripeId?: string;
  paymentMethod?: string;
  isCustomAmount: boolean;
  userId: mongoose.Types.ObjectId;
  serviceId?: mongoose.Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema<IPayment> = new Schema<IPayment>(
  {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    status: { 
      type: String, 
      enum: ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'], 
      default: 'PENDING' 
    },
    stripeId: { type: String, unique: true, sparse: true },
    paymentMethod: { type: String },
    isCustomAmount: { type: Boolean, default: false },
    userId: { 
      type: Schema.Types.ObjectId, 
      required: true,
      ref: 'User'
    },
    serviceId: { 
      type: Schema.Types.ObjectId,
      ref: 'Service'
    },
  },
  { 
    timestamps: true,
    collection: 'payments'
  }
);

PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ serviceId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ stripeId: 1 });

const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default Payment;