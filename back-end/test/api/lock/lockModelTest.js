import smartLock from '../../../src/libraries/smartLock';
import Lock from '../../../src/api/lock/model';
import chai from 'chai';
import sinon from 'sinon';

chai.should();

const lock = new Lock({
    "id": 1, 
    "category": "house",
    "name": "Front door",
    "status": "locked",
    "houseId": "1"
});

const sandbox = sinon.createSandbox();

describe('Lock Model', () => {
    afterEach(function () {
        sandbox.restore();
    });
    beforeEach(function () {
        sandbox.stub(smartLock, 'locking').callsFake((lockGuid, status) => {
            return new Promise((resolve)=>{
                setTimeout(()=>{
                    resolve({ok:true});
                }, Math.random()*1000);
            });
        });
    });
    describe('updateStatus', () => {
        it('should update the lock status', async () => {
            lock.status.should.be.equal('locked');
            const lockStatus = await lock.setStatus("unlocked");
            lock.status.should.be.equal('unlocked');
            lock.status.should.be.equal(lockStatus.data.newStatus);
        });
        it('should return false on invalid value', async () => {
            const lockStatus = await lock.setStatus("invalid value");
            lockStatus.ok.should.be.false;
        });
    });
})