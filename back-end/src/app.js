import http from 'http';
import express from 'express';
import socketIO from 'socket.io';
import config from 'config';
import bodyParser from 'body-parser';
import housesRoutes from './api/house/routes';
import locksRoutes from './api/lock/routes';
import User from './api/user/model';
import eventsManager from './events/eventsManager';
import logEventListener from './events/logEventListener';
import lockEventListener from './events/lockEventListener';

const port = config.get('APP.PORT');

const app = express();
const server = http.createServer(app);
const options = {};
const io = socketIO(server, options);

io.on('connection', (socket) => {
  console.log(`${socket.id} connected..`);
});

app.set('io', io);
app.use(bodyParser.json());

app.use((req, res, next) => {
  // auth middleware (hardcode to user id 1 for now)
  req.user = User.get(1);
  next();
});

app.use('/api/v1/houses', housesRoutes);
app.use('/api/v1/locks', locksRoutes);

server.listen(port, () => {
  console.log(
    `${config.util.getEnv('NODE_ENV')} server running on port ${port}`
  );
});

logEventListener.start(eventsManager);
lockEventListener.start(eventsManager);

export default app;
