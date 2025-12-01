import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  path: string;
  status: 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  uploadedBy: mongoose.Types.ObjectId; 
  sharedBy?: mongoose.Types.ObjectId; 
  isShared: boolean;
  sharedAt?: Date;
  userId: mongoose.Types.ObjectId;
  description?: string; 
  createdAt: Date;
  updatedAt: Date;
}

const DocumentSchema: Schema<IDocument> = new Schema<IDocument>(
  {
    filename: { type: String, required: true },
    originalName: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
    path: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['UPLOADED', 'PROCESSING', 'COMPLETED', 'REJECTED'], 
      default: 'UPLOADED' 
    },
    uploadedBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true 
    },
    sharedBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User'
    },
    isShared: { type: Boolean, default: false },
    sharedAt: { type: Date },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User',
      required: true
    },
    description: { 
      type: String,
      default: null 
    },
  },
  { 
    timestamps: true,
    collection: 'documents'
  }
);

DocumentSchema.index({ userId: 1 });
DocumentSchema.index({ uploadedBy: 1 });
DocumentSchema.index({ status: 1 });
DocumentSchema.index({ isShared: 1 });

const DocumentModel = mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema);

export default DocumentModel;