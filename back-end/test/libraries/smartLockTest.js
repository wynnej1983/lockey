import chai from 'chai';
import smartLock from '../../src/libraries/smartLock';

chai.should();

describe("smartLock", ()=> {
    describe("locking", ()=> {
        it("should return a status object or an error message", async () =>{
            const res = await smartLock.locking(1, "unlocked");
            if(res.ok){
                res.data.should.be.an("object");
                res.data.should.have.property("message");
            }else{
                res.data.error.should.not.be.undefined;
            }
        });
    });
});