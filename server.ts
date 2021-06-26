import { Server } from 'http';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import basicAuth from 'basic-auth';
import { promisify } from 'util';
import Router from '@koa/router';
import createPost from './handlers/create-post';
import retrievePost from './handlers/retrieve-post';
import retrievePosts from './handlers/retrieve-posts';
import authenticate from './library/authenticate';
import mongoose from './library/mongoose';

const app = new Koa();

app.use(
  bodyParser({
    jsonLimit: '2mb',
  }),
);

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.code === 'NOT_FOUND') {
      ctx.status = 404;
    } else if (err.code === 'BAD_USER_INPUT') {
      ctx.status = 400;
    } else {
      ctx.status = 500;
    }
  }
});

app.use(async (ctx, next) => {
  const credentials = basicAuth(ctx.req);

  const generate401Response = () => {
    ctx.status = 401;
    ctx.set('WWW-Authenticate', 'Basic realm="Simple Web Service"');
  };

  if (!credentials) {
    generate401Response();
    return;
  }

  const user = await authenticate({ username: credentials.name, password: credentials.pass });

  if (!user) {
    generate401Response();
    return;
  }

  ctx.state.user = user;

  await next();
});

const router = new Router();

router.get('/posts', retrievePosts);
router.get('/posts/:id', retrievePost);
router.post('/posts', createPost);

app.use(router.middleware());
app.use(router.allowedMethods());

let server: Server;

async function start() {
  await mongoose.start(process.env.MONGODB_URI);

  server = app.listen(parseInt(process.env.PORT || '8080', 10));
}

async function stop() {
  await promisify(server.close).apply(server);

  await mongoose.stop();
}

export default {
  start,
  stop,
};
