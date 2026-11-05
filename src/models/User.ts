import mongoose, { Document, Schema } from 'mongoose';

// Define the allowed roles in the system as per the ERD
export type UserRole = 'client' | 'company' | 'admin';

// TypeScript interface for User document
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: UserRole;
  authProvider: string;
  authUid?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema definition
const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false, // Optional if social / third-party auth is used later
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Security: Do not return password by default in queries
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['client', 'company', 'admin'],
      default: 'client',
      required: true,
    },
    authProvider: {
      type: String,
      default: 'local',
    },
    authUid: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

export const User = mongoose.model<IUser>('User', userSchema);
