import server from '../server';

before(async () => {
  await server.start();
});

after(async () => {
  await server.stop();
});
