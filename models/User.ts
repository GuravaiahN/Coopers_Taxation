// import mongoose, { Schema, Document, Model, models } from 'mongoose';

// // Extend the IUser interface to include isAdmin
// interface IUser extends Document {
//   email: string;
//   password: string;
//   phone: string;
//   role: 'user' | 'admin';
//   image?: string; // Optional image field
//   isAdmin: boolean; // Add isAdmin field here
// }

// const UserSchema: Schema<IUser> = new Schema<IUser>(
//   {
//     email: { type: String, unique: true, required: true },
//     password: { type: String, required: true },
//     phone: { type: String, required: true },
//     role: { type: String, enum: ['user', 'admin'], default: 'user' },
//     image: { type: String, default: null },
//     isAdmin: { type: Boolean, default: false }, // Define isAdmin field in schema
//   },
//   { timestamps: true }
// );

// const User: Model<IUser> =
//   models.User || mongoose.model<IUser>('User', UserSchema);

// export default User;

import mongoose, { Schema, Document, Model, models } from 'mongoose';

// Extend the IUser interface to include resetPassword fields and name
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
