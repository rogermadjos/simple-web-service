import { RouterContext } from '@koa/router';
import PostRepository from '../repositories/post';

export default async function retrievePost(ctx: RouterContext) {
  const post = await PostRepository.findOne({
    id: ctx.params.id,
    creator: ctx.state.user.id,
  });

  if (!post) {
    ctx.status = 404;
    return;
  }

  ctx.body = post;
}
