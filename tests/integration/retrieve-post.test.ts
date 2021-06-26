/* eslint-disable func-names */
import sinon from 'sinon';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import chance from '../helpers/chance';
import request from '../helpers/request';
import UserRepository from '../../repositories/user';
import PostRepository from '../../repositories/post';

describe('GET /posts/:id', () => {
  beforeEach(function () {
    this.username = chance.first().toLowerCase();
    this.password = chance.word().toLowerCase();
    this.creator = crypto.randomBytes(16).toString('hex');

    this.stubOne = sinon.stub(UserRepository, 'findByUsername').callsFake(async (username: string) => ({
      id: this.creator,
      username,
      password: await bcrypt.hash(this.password, 8),
      createdAt: new Date(),
    }));
  });

  afterEach(function () {
    this.stubOne.restore();
  });

  describe('post exists', () => {
    beforeEach(function () {
      this.stubTwo = sinon.stub(PostRepository, 'findOne').callsFake(async (params) => ({
        ...params,
        message: chance.sentence(),
        createdAt: new Date(),
      }));
    });

    afterEach(function () {
      this.stubTwo.restore();
    });

    it('should respond with 200', async function () {
      await request
        .get(`/posts/${crypto.randomBytes(16).toString('hex')}`)
        .set('Authorization', `Basic ${Buffer.from(`${this.username}:${this.password}`, 'utf8').toString('base64')}`)
        .expect(200);
    });
  });

  describe('post does not exist', () => {
    beforeEach(function () {
      this.stubTwo = sinon.stub(PostRepository, 'findOne').callsFake(async () => null);
    });

    afterEach(function () {
      this.stubTwo.restore();
    });

    it('should respond with 404', async function () {
      await request
        .get(`/posts/${crypto.randomBytes(16).toString('hex')}`)
        .set('Authorization', `Basic ${Buffer.from(`${this.username}:${this.password}`, 'utf8').toString('base64')}`)
        .expect(404);
    });
  });
});
