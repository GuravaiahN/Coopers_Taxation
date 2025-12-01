import mongoose, { Schema, Document } from 'mongoose';

// RefundRequest interface
export interface IRefundRequest extends Document {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  documents: { _id: string; filename: string }[];
  additionalDocuments?: { _id: string; filename: string }[];
  isAdmin?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
}

const RefundRequestSchema: Schema = new Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
  documents: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'documents',
        required: true,
      },
      filename: { type: String, required: true },
    },
  ],
  additionalDocuments: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: 'documents' },
      filename: { type: String },
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
}, {
  collection: 'refundrequests'
});

RefundRequestSchema.index({ email: 1 });
RefundRequestSchema.index({ status: 1 });
RefundRequestSchema.index({ createdAt: 1 });

const RefundRequest = mongoose.models.RefundRequest || mongoose.model<IRefundRequest>('RefundRequest', RefundRequestSchema);

export default RefundRequest;