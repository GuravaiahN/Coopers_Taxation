import mongoose, { Schema, Document } from 'mongoose';

// User interface - compatible with both existing MongoDB structure and new requirements
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string; 
  mobile?: string; 
  role: 'user' | 'admin' | 'CLIENT' | 'ADMIN'; 
  image?: string; 
  isAdmin: boolean; 
  resetPasswordToken?: string; 
  resetPasswordExpires?: Date; 
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String }, 
    mobile: { type: String }, 
    role: { 
      type: String, 
      enum: ['user', 'admin', 'CLIENT', 'ADMIN'], 
      default: 'CLIENT' 
    },
    image: { type: String, default: null },
    isAdmin: { type: Boolean, default: false },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { 
    timestamps: true,
    collection: 'users' 
  }
);

// Create indexes for better performance
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;