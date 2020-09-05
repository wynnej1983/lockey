import housesController from '../../../src/api/house/index';
import smartLock from '../../../src/libraries/smartLock';
import House from '../../../src/api/house/model';
import httpMocks from 'node-mocks-http';
import sinon from 'sinon';

const buildResponse = () => {
  return httpMocks.createResponse();
};
const sandbox = sinon.createSandbox();

describe('Houses Controller', () => {
  afterEach(function() {
    sandbox.restore();
  });
  beforeEach(function() {
    sandbox.stub(House, 'all').callsFake(() => {
      return [
        new House({
          id: 1,
          guid: '6a746faeaa5456104ea42abd94d48824',
          name: 'Grafton',
          locks: [
            {
              id: 1,
              guid: '5ce77cb3b229188d057524cb0de4f9a6',
              category: 'house',
              name: 'Front door',
              status: 'locked',
            },
          ],
        }),
        new House({
          id: 11,
          guid: '6a746faeaa5456104ea42abd94d48824',
          name: 'Grafton',
          locks: [
            {
              id: 2,
              guid: '5ce77cb3b229188d057524cb0de4f9a6',
              category: 'house',
              name: 'Front door',
              status: 'offline',
            },
          ],
        }),
      ];
    });

    sandbox.stub(smartLock, 'locking').callsFake((lockGuid, status) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ok: true });
        }, Math.random() * 1000);
      });
    });
  });
  describe('houses_get_all', () => {
    it('should retrieve an array of houses', () => {
      const req = {};
      const res = buildResponse();
      housesController.houses_get_all(req, res);
      const houses = res._getJSONData();
      houses.should.be.an('array');
      houses.forEach((house) => {
        house.should.be.an('object');
        house.should.have.property('id');
      });
    });
  });

  describe('houses_get', () => {
    it('should retrieve a house', () => {
      const req = httpMocks.createRequest({
        params: {
          houseId: '1',
        },
      });
      const res = buildResponse();
      housesController.houses_get(req, res);
      const house = res._getJSONData();
      house.should.be.an('object');
      house.should.have.property('id');
    });
  });

  describe('houses_get', () => {
    it('should return 404 when not found', () => {
      const req = httpMocks.createRequest({
        params: {
          houseId: 'xxx',
        },
      });
      const res = buildResponse();
      housesController.houses_get(req, res);
      res.statusCode.should.equal(404);
    });
  });

  describe('houses_get_locks', () => {
    it('should retrieve an array of locks', () => {
      const req = httpMocks.createRequest({
        params: {
          houseId: '1',
        },
      });
      const res = buildResponse();
      housesController.houses_get_locks(req, res);
      const locks = res._getJSONData();
      locks.should.be.an('array');
      locks.forEach((lock) => {
        lock.should.be.an('object');
        lock.should.have.property('id');
      });
    });
  });

  describe('houses_get_locks', () => {
    it('should return 404 when not found', () => {
      const req = httpMocks.createRequest({
        params: {
          houseId: '133333',
        },
      });
      const res = buildResponse();
      housesController.houses_get_locks(req, res);
      res.statusCode.should.equal(404);
    });
  });

  describe('houses_get_lock', () => {
    it('should retrieve a lock', () => {
      const req = httpMocks.createRequest({
        params: {
          houseId: '1',
          lockId: '1',
        },
      });
      const res = buildResponse();
      housesController.houses_get_lock(req, res);
      const lock = res._getJSONData();
      lock.should.be.an('object');
      lock.should.have.property('id');
    });
  });

  describe('houses_get_lock', () => {
    it('should return 404 when house not found', () => {
      const req = httpMocks.createRequest({
        params: {
          houseId: 'erferf',
          lockId: '1',
        },
      });
      const res = buildResponse();
      housesController.houses_get_lock(req, res);
      res.statusCode.should.equal(404);
    });
  });

  describe('houses_get_lock', () => {
    it('should return 404 when lock not found', () => {
      const req = httpMocks.createRequest({
        params: {
          houseId: '1',
          lockId: 'asdfsadf',
        },
      });
      const res = buildResponse();
      housesController.houses_get_lock(req, res);
      res.statusCode.should.equal(404);
    });
  });

  describe('houses_update_lock', () => {
    it('should lock or unlock a specific lock', async () => {
      const newStatus = 'unlocked';

      const req = httpMocks.createRequest({
        params: {
          houseId: '1',
          lockId: '1',
        },
        body: {
          status: newStatus,
        },
        app: {
          get: (field) => {
            if (field === 'io')
              return {
                emit: () => {},
              };
          },
        },
      });
      const res = buildResponse();
      await housesController.houses_update_lock(req, res);
      res.statusCode.should.equal(200);
      const lock = res._getJSONData();
      lock.status.should.equal(newStatus);
    });
  });

  describe('houses_update_lock', () => {
    it('should return 404 when lock not found', async () => {
      const req = httpMocks.createRequest({
        params: {
          houseId: '1',
          lockId: 'asdfsadf',
        },
        body: {
          status: 'unlocked',
        },
      });
      const res = buildResponse();
      await housesController.houses_update_lock(req, res);
      res.statusCode.should.equal(404);
    });
  });
  describe('houses_update_lock', () => {
    it('should return 404 when house not found', async () => {
      const req = httpMocks.createRequest({
        params: {
          houseId: '3333',
          lockId: '1',
        },
        body: {
          status: 'unlocked',
        },
      });
      const res = buildResponse();
      await housesController.houses_update_lock(req, res);
      res.statusCode.should.equal(404);
    });
  });
  describe('houses_update_lock', () => {
    it('should return 400 when status is invalid', async () => {
      const req = httpMocks.createRequest({
        params: {
          houseId: '1',
          lockId: '1',
        },
        body: {
          status: 'anystatus',
        },
      });
      const res = buildResponse();
      await housesController.houses_update_lock(req, res);
      res.statusCode.should.equal(400);
    });
  });
  describe('houses_update_lock', () => {
    it('should return 503 when status offline', async () => {
      const req = httpMocks.createRequest({
        params: {
          houseId: '11',
          lockId: '2',
        },
        body: {
          status: 'opened',
        },
      });
      const res = buildResponse();
      await housesController.houses_update_lock(req, res);
      res.statusCode.should.equal(503);
    });
  });
});

// sinon.restore();
