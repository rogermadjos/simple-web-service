/* eslint-disable func-names */
import sinon from 'sinon';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import chance from '../helpers/chance';
import UserRepository from '../../repositories/user';
import request from '../helpers/request';

describe('Authentication', () => {
  describe('valid username and password', () => {
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

    it('should respond with 200', async function () {
      await request
        .get('/posts')
        .set('Authorization', `Basic ${Buffer.from(`${this.username}:${this.password}`, 'utf8').toString('base64')}`)
        .expect(200);
    });
  });

  describe('invalid username', () => {
    beforeEach(function () {
      this.username = chance.first().toLowerCase();
      this.password = chance.word().toLowerCase();

      this.stub = sinon.stub(UserRepository, 'findByUsername').callsFake(async () => null);
    });

    afterEach(function () {
      this.stub.restore();
    });

    it('should respond with 401', async function () {
      await request
        .get('/posts')
        .set('Authorization', `Basic ${Buffer.from(`${this.username}:${this.password}`, 'utf8').toString('base64')}`)
        .expect(401);
    });
  });

  describe('invalid password', () => {
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

    it('should respond with 401', async function () {
      await request
        .get('/posts')
        .set('Authorization', `Basic ${Buffer.from(`${this.username}:${chance.word().toLowerCase()}`, 'utf8').toString('base64')}`)
        .expect(401);
    });
  });
});
