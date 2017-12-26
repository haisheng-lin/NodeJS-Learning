const express = require('express');
const bodyParser = require('body-parser');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

/** ========================== process requests for leaders ========================== */

leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})

.get((req, res, next) => {
    res.end('Will send all the leaders to you!');
})

.post((req, res, next) => {
    res.end('Will add the leaders:' + req.body.name + ' with details: ' + req.body.description);
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported for /leaders');
})

.delete((req, res, next) => {
    res.end('Deleting all the leaders!');
});

/** ========================== process requests for specific leader ========================== */

leaderRouter.route('/:leaderId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})

.get((req, res, next) => {
    res.end('Will send details of the leader: ' + req.params.leaderId + ' to you!');
})

.post((req, res, next) => {
    res.statusCode = 403;
    res.end('Post operation not supported for /leaders/' + req.params.leaderId);
})

.put((req, res, next) => {
    res.write('Updating the leader: ' + req.params.leaderId + '\n');
    res.end('Will update the leader: ' + req.body.name + ' with details: ' + req.body.description);
})

.delete((req, res, next) => {
    res.end('Deleting the leader: ' + req.params.leaderId);
});

module.exports = leaderRouter;