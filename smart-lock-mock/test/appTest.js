import chaiHttp from 'chai-http';
import chai from 'chai';
import app, {buildResult} from '../src/app';

chai.use(chaiHttp);
chai.should();

describe("App", () => {
    describe("buildResult", () => {
        it("should return a valid random result", () => {
            const result = () => { return {status: 200, body: {message: "Unlocked successfully."}}}
            const {status, body} = buildResult(result);
            status.should.be.a("number");
            body.should.be.an("object");
        });
    });
});
describe("Integration", () => {
    describe("GET /locks/:lockId/locking", () => {
        it("should return a valid random result", (done) => {
            chai.request(app)
            .patch('/locks/1/locking')
            .end((err, res) => {
                res.status.should.be.a("number");
                res.type.should.equal("application/json")
                res.body.should.be.an("object");
                done();
             });
        });
    });
});