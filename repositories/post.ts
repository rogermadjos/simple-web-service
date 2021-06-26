import mongoose, { Document, Schema } from 'mongoose';
import crypto from 'crypto';

export interface Post {
  id: string;
  creator: string;
  message: string;
  createdAt: Date;
}

type PostDocument = Document<string> & Post;

const schema = new Schema({
  _id: {
    type: String,
    default: () => crypto.randomBytes(16).toString('hex'),
  },
  creator: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
}, { _id: false });

schema.index({ creator: 1 });
schema.index({ createdAt: 1 });

const model = mongoose.model<PostDocument>('Post', schema);

export default {
  async create(params: {
    creator: string;
    message: string;
  }) {
    try {
      return await model.create(params);
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw Object.assign(new Error(err.message), {
          code: 'BAD_USER_INPUT',
        });
      }

      throw err;
    }
  },
  async findOne(params: { id: string; creator: string }): Promise<Post | null> {
    return model.findOne({
      _id: params.id,
      creator: params.creator,
    }).sort({ createdAt: 1 });
  },
  async find(params: { creator: string }): Promise<Post[] | null> {
    return model.find({
      creator: params.creator,
    }).sort({ createdAt: 1 });
  },
};
