import express from 'express';
import config from 'config';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const port = config.get('app.port');

app.listen(port, () => {
    console.log(`${config.util.getEnv('NODE_ENV')} server running on port ${port}`);
});

/**
 * It locks or unlocks the given lock
 */
app.patch('/locks/:lockId/locking', (req, res) => {
    const lockStatus = req.body.status;
    const result = () => { return {status: 200, body: {message: "Transaction successful.", newStatus: lockStatus}}}
    const {status, body} = buildResult(result);
    setTimeout(()=> {
        res.status(status).json( body ); 
    },Math.random()*2000);
});

export const buildResult = (goodResult) => {
    const random = Math.floor(Math.random() * 10);
    let result = {};

    switch(random){
        case 3:
            result = {
                status: 404,
                body:  {
                    message: "Resource not found."
                }
            }
            break; 
        case 2:
            result = {
                status: 500,
                body:  {
                    message: "Internal server error."
                }
            }
            break; 
        default:
            result = goodResult();
    }
    return result;
}

export default app;