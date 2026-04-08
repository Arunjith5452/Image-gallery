import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  phone: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  }
}, { timestamps: true });

export default mongoose.model<IUser>('User', userSchema);
