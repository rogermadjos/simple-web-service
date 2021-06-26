import mongoose from 'mongoose';
import ms from 'ms';

async function start(host?: string) {
  await mongoose.connect(host || 'mongodb://localhost/main', {
    readPreference: 'secondaryPreferred',
    poolSize: parseInt(process.env.MONGODB_POOL_SIZE || '5', 10),
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    socketTimeoutMS: ms('5m'),
  });
}

async function stop() {
  await mongoose.disconnect();
}

export default {
  start,
  stop,
};
