/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable func-names */
import sinon from 'sinon';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { expect } from 'chai';
import chance from '../helpers/chance';
import request from '../helpers/request';
import UserRepository from '../../repositories/user';
import PostRepository from '../../repositories/post';

describe('POST /posts', () => {
  beforeEach(function () {
    this.username = chance.first().toLowerCase();
    this.password = chance.word().toLowerCase();

    this.stub = sinon.stub(UserRepository, 'findByUsername').callsFake(async (username: string) => ({
      id: crypto.randomBytes(16).toString('hex'),
      username,
      password: await bcrypt.hash(this.password, 8),
      createdAt: new Date(),
    }));
  });

  afterEach(function () {
    this.stub.restore();
  });

  describe('valid parameters', () => {
    it('should respond with 200', async function () {
      const spy = sinon.spy(PostRepository, 'create');

      await request
        .post('/posts')
        .set('Authorization', `Basic ${Buffer.from(`${this.username}:${this.password}`, 'utf8').toString('base64')}`)
        .send({
          message: chance.sentence(),
        })
        .expect(200);

      expect(spy.calledOnce).to.be.true;
    });
  });

  describe('invalid parameters', () => {
    it('should respond with 400', async function () {
      await request
        .post('/posts')
        .set('Authorization', `Basic ${Buffer.from(`${this.username}:${this.password}`, 'utf8').toString('base64')}`)
        .send({
          messages: chance.sentence(),
        })
        .expect(400);
    });
  });
});
