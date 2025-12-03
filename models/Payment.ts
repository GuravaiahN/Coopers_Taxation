import mongoose, { Schema, Document, Model, models } from 'mongoose';

interface IPayment extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paymentMethod: 'card' | 'bank_transfer' | 'paypal' | 'other';
  stripePaymentIntentId?: string;
  serviceName: string;
  serviceDescription?: string;
  paymentDate: Date;
  refundAmount?: number;
  refundDate?: Date;
  metadata?: Record<string, any>;
}

const PaymentSchema: Schema<IPayment> = new Schema<IPayment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    status: { 
      type: String, 
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paymentMethod: { 
      type: String, 
      enum: ['card', 'bank_transfer', 'paypal', 'other'],
      default: 'card'
    },
    stripePaymentIntentId: { type: String },
    serviceName: { type: String, required: true },
    serviceDescription: { type: String },
    paymentDate: { type: Date, default: Date.now },
    refundAmount: { type: Number, default: 0 },
    refundDate: { type: Date },
    metadata: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

PaymentSchema.index({ userId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ paymentDate: -1 });

const PaymentModel: Model<IPayment> = 
  models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);

export default PaymentModel;