import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/app';

chai.use(chaiHttp);
chai.should();

describe('Integration', () => {
  const prefix = '/api/v1';
  describe('GET /houses', () => {
    it('should return an array of houses', async () => {
      const res = await chai.request(app).get(`${prefix}/houses`);
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.forEach((house) => {
        house.should.be.an('object');
        house.should.have.property('name');
      });
    });
  });
  describe('GET /houses/:houseId', () => {
    it('should return a house object', async () => {
      const res = await chai.request(app).get(`${prefix}/houses/1`);
      res.should.have.status(200);
      res.body.should.be.an('object');
      res.body.should.have.property('name');
    });
  });
  describe('GET /houses/:houseId', () => {
    it('should return 404 if house does not exist', async () => {
      const res = await chai.request(app).get(`${prefix}/houses/11111`);
      res.should.have.status(404);
    });
  });
  describe('GET /houses/:houseId/locks', () => {
    it('should return an array of locks', async () => {
      const res = await chai.request(app).get(`${prefix}/houses/1/locks`);
      res.should.have.status(200);
      res.body.should.be.a('array');
      res.body.forEach((lock) => {
        lock.should.be.an('object');
        lock.should.have.property('name');
        lock.should.have.property('status');
        lock.should.have.property('category');
      });
    });
  });
  describe('GET /houses/:houseId/locks/:lockId', () => {
    it('should return a lock object', async () => {
      const res = await chai.request(app).get(`${prefix}/houses/1/locks/1`);
      res.should.have.status(200);
      res.body.should.be.a('object');
      res.body.should.have.property('status');
      res.body.should.have.property('name');
      res.body.should.have.property('category');
    });
  });
  describe('GET /houses/:houseId/locks/:lockId', () => {
    it('should return 404 if lock does not exist', async () => {
      const res = await chai.request(app).get(`${prefix}/houses/1/locks/1555`);
      res.should.have.status(404);
    });
  });
  describe("PATCH /houses/:houseId/locks/:lockId/locking {status: 'locked'}", () => {
    it('should return a status object or a valid error response if failed', async () => {
      const newStatus = 'locked';
      const res = await chai
        .request(app)
        .patch(`${prefix}/houses/1/locks/1/locking`)
        .send({ status: newStatus });
      res.should.have.property('status');
      res.status.should.be.oneOf([200, 404, 500]);
      if (res.status === 200) {
        res.body.should.be.an('object');
        res.body.should.have.property('id');
        res.body.should.have.property('category');
        res.body.should.have.property('name');
        res.body.should.have.property('status');
        res.body.status.should.equal(newStatus);
      }
    });
  });
  describe("PATCH /houses/:houseId/locks/:lockId/locking {status: 'unlocked'}", () => {
    it('should return a status object or a valid error response if failed', async () => {
      const newStatus = 'unlocked';
      const res = await chai
        .request(app)
        .patch(`${prefix}/houses/1/locks/1/locking`)
        .send({ status: newStatus });
      res.should.have.property('status');
      res.status.should.be.oneOf([200, 404, 500]);
      if (res.status === 200) {
        res.body.should.be.an('object');
        res.body.should.have.property('id');
        res.body.should.have.property('category');
        res.body.should.have.property('name');
        res.body.should.have.property('status');
        res.body.status.should.equal(newStatus);
      }
    });
  });
  describe('PATCH /houses/:houseId/locks/:lockId/locking', () => {
    it('should return 400 if status is invalid', async () => {
      const res = await chai
        .request(app)
        .patch(`${prefix}/houses/1/locks/1/locking`)
        .send({ status: 'invalid status' });
      res.should.have.status(400);
    });
  });
});

