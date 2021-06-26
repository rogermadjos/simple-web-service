import { Context } from 'koa';
import PostRepository from '../repositories/post';

export default async function createPost(ctx: Context) {
  await PostRepository.create({
    ...ctx.request.body as { message: string },
    creator: ctx.state.user.id,
  });

  ctx.status = 200;
}
