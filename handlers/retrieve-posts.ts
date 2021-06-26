import { Context } from 'koa';
import PostRepository from '../repositories/post';

export default async function retrievePosts(ctx: Context) {
  ctx.body = await PostRepository.find({ creator: ctx.state.user.id });
}
