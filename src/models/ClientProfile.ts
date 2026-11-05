import mongoose, { Document, Schema } from 'mongoose';

// TypeScript interface for ClientProfile document
export interface IClientProfile extends Document {
  userId: mongoose.Types.ObjectId;
  businessName: string;
  entityType?: string;
  panGstin?: string;
  address?: string;
  kycStatus: 'pending' | 'submitted' | 'verified' | 'rejected';
  profileFields?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose schema definition
const clientProfileSchema = new Schema<IClientProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId reference to User model is required'],
      unique: true, // Strict 1:1 relationship as per the ERD
    },
    businessName: {
      type: String,
      required: [true, 'Business / Company name is required'],
      trim: true,
    },
    entityType: {
      type: String,
      trim: true,
    },
    panGstin: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    kycStatus: {
      type: String,
      enum: ['pending', 'submitted', 'verified', 'rejected'],
      default: 'pending',
    },
    profileFields: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

export const ClientProfile = mongoose.model<IClientProfile>('ClientProfile', clientProfileSchema);
