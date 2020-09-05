import 'mocha-sinon';
import Lock from '../../src/api/Lock/model';
import eventsManager from '../../src/events/eventsManager';

const lock = new Lock({
    "id": 1, 
    "category": "house",
    "name": "Front door",
    "status": "locked",
    "houseId": "1"
});

describe("Logger", () => {
    beforeEach(function() {
        this.sinon.stub(console, 'log');
      });
    describe("start", () => {
        it("should log to the console on event emit lock-changed-status", async () => {
            const newStatus = "unlocked";
            eventsManager.emit('lock-changed-status', lock,  newStatus);
            console.log.calledOnce.should.be.true;
            console.log.calledWithMatch(`DOOR CHANGED STATUS ${newStatus} ${JSON.stringify(lock)}`).should.be.true;
        });
    });
});