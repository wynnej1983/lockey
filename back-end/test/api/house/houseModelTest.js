import House from '../../../src/api/house/model';
import Lock from '../../../src/api/lock/model';

describe('House Model', () => {
    describe('all', () => {
        it('should retrieve all houses', () => {
            const houses = House.all();
            houses.should.be.an('array');
            houses.forEach((house) => {
                house.should.be.an('object');
                house.should.be.instanceof(House);
            });
        });
    });
    describe('get', () => {
        it('should retrieve house object', () => {
            const house = House.get(1);
            house.should.be.an('object');
            house.should.be.instanceof(House);
        });
    });
    describe('locks', () => {
        it('should retrieve an array of locks', () => {
            const house = House.get(1);
            house.locks.should.be.an('array');
            house.locks.forEach((lock) => {
                lock.should.be.an('object');
                lock.should.be.instanceof(Lock);
            });
        })
    });
    describe('getLock', () => {
        it('should retrieve an instance of lock', () => {
            const house = House.get(1);
            const lock = house.getLock(1);
            lock.should.be.an('object');
            lock.should.be.instanceof(Lock);
        })
    });
})