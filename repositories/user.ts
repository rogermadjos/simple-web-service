/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

export interface User {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
}

type UserDocument = Document<string> & User;

const schema = new Schema<UserDocument>({
  _id: {
    type: String,
    default: () => crypto.randomBytes(16).toString('hex'),
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
}, { _id: false });

schema.index({ username: 1 }, { unique: true });

const model = mongoose.model<UserDocument>('User', schema);

export default {
  async findById(id: string): Promise<User | null> {
    return model.findOne({ _id: id });
  },
  async findByUsername(username: string): Promise<User | null> {
    return model.findOne({ username });
  },
};
