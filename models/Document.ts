import mongoose, { Schema, Document } from 'mongoose'

export interface IDocument extends Document {
  fileId?: mongoose.Types.ObjectId // GridFS file ID
  filename?: string // Legacy field for backward compatibility
  originalName: string
  mimeType: string // Updated field name for consistency
  mimetype?: string // Legacy field for backward compatibility
  size: number
  path?: string // Legacy field for backward compatibility
  status: 'UPLOADED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED'
  uploadedBy?: mongoose.Types.ObjectId // Legacy field
  sharedBy?: mongoose.Types.ObjectId
  isShared: boolean
  sharedAt?: Date
  userId: mongoose.Types.ObjectId
  taxYear?: string
  notes?: string
  clientInfo?: {
    name?: string
    email?: string
    phone?: string
  }
  description?: string // Legacy field
  createdAt: Date
  updatedAt: Date
}

const DocumentSchema: Schema<IDocument> = new Schema<IDocument>(
  {
    fileId: { type: Schema.Types.ObjectId }, // GridFS file ID
    filename: { type: String }, // Legacy field
    originalName: { type: String, required: true },
    mimeType: { type: String }, // New field
    mimetype: { type: String }, // Legacy field for backward compatibility
    size: { type: Number, required: true },
    path: { type: String }, // Legacy field
    status: { 
      type: String, 
      enum: ['UPLOADED', 'PROCESSING', 'COMPLETED', 'REJECTED'], 
      default: 'UPLOADED' 
    },
    uploadedBy: { 
      type: Schema.Types.ObjectId, 
      ref: 'User'
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
    taxYear: { type: String },
    notes: { type: String },
    clientInfo: {
      name: { type: String },
      email: { type: String },
      phone: { type: String }
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
)

DocumentSchema.index({ userId: 1 })
DocumentSchema.index({ uploadedBy: 1 })
DocumentSchema.index({ status: 1 })
DocumentSchema.index({ isShared: 1 })

const DocumentModel = mongoose.models.Document || mongoose.model<IDocument>('Document', DocumentSchema)

export default DocumentModel