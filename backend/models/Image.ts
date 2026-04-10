import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IImage extends Document {
  title: string;
  cloudinaryPublicId: string;
  imageUrl: string;
  mimetype?: string;
  order: number;
  user: mongoose.Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const imageSchema = new Schema<IImage>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  cloudinaryPublicId: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
  },
  order: {
    type: Number,
    default: 0,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

export default mongoose.model<IImage>('Image', imageSchema);
