import mongoose, { Schema, Document, Model, models } from 'mongoose';

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'user' | 'admin';
  image?: string;
  isAdmin: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    image: { type: String, default: null },
    isAdmin: { type: Boolean, default: false },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
