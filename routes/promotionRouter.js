const express = require('express');
const bodyParser = require('body-parser');

const promotionRouter = express.Router();

promotionRouter.use(bodyParser.json());

/** ========================== process requests for promotions ========================== */

promotionRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})

.get((req, res, next) => {
    res.end('Will send all the promotions to you!');
})

.post((req, res, next) => {
    res.end('Will add the promotion:' + req.body.name + ' with details: ' + req.body.description);
})

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported for /promotions');
})

.delete((req, res, next) => {
    res.end('Deleting all the promotions!');
});

/** ========================== process requests for specific promotion ========================== */

promotionRouter.route('/:promotionId')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})

.get((req, res, next) => {
    res.end('Will send details of the promotion: ' + req.params.promotionId + ' to you!');
})

.post((req, res, next) => {
    res.statusCode = 403;
    res.end('Post operation not supported for /promotions/' + req.params.promotionId);
})

.put((req, res, next) => {
    res.write('Updating the promotion: ' + req.params.promotionId + '\n');
    res.end('Will update the promotion: ' + req.body.name + ' with details: ' + req.body.description);
})

.delete((req, res, next) => {
    res.end('Deleting the promotion: ' + req.params.promotionId);
});

module.exports = promotionRouter;