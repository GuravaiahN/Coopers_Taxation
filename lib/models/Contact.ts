import mongoose, { Schema, Document } from 'mongoose';

// Contact interface
export interface IContact extends Document {
  name: string;
  email: string;
  phone: string;
  message: string;
  createdAt: Date;
}

const ContactSchema: Schema = new Schema<IContact>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
  },
  { 
    timestamps: true,
    collection: 'contacts'
  }
);

ContactSchema.index({ email: 1 });
ContactSchema.index({ createdAt: 1 });

const Contact = mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;