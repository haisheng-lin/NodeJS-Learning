const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authenticate = require('../authenticate');
const cors = require('./cors');

var User = require('../models/user');
var Dish = require('../models/dishes');
const Favorites = require('../models/favorites');

const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

/** ========================== process requests for favorites ========================== */

favoriteRouter.route('/')

.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})

.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
    .populate('user dishes')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    
    Favorites.findOne({ user: req.user._id })
    .populate('user dishes')
    .then((favorites) => {

        // firstly search if the user document exists.
        // if not, we have to create the document.
        if(favorites == null) {
            var dishIds = req.body;
            var dishes = [];
            for(var i = 0; i < dishIds.length; i++) {
                dishes = dishes.concat(dishIds[i]._id);
            }
            console.log(dishes);
            Favorites.create({ user: req.user._id, dishes: dishes })
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            var dishIds = req.body;
            for(var i = 0; i < dishIds.length; i++) {
                favorites.dishes = favorites.dishes.concat(dishIds[i]._id);
            }
            console.log(favorites.dishes);
            favorites.save()
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported for /favorites');
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndRemove({ 'user': req.user._id })
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

/** ========================== process requests for specific favorite ========================== */

favoriteRouter.route('/:dishId')

.options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
})

.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
    .then((favorites) => {
        if(!favorites) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else {
            if(favorites.dishes.indexOf(req.params.dishId) < 0) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    
    // https://stackoverflow.com/questions/6195286/how-to-query-mongodb-with-dbref
    Favorites.findOne({ user: req.user._id })
    .then((favorites) => {

        // firstly search if the user document exists.
        // if not, we have to create the document.
        if(favorites == null) {
            var dishes = [];
            dishes = dishes.concat(req.params.dishId);
            Favorites.create({ user: req.user._id, dishes: dishes })
            .then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
        else {
            favorites.dishes = favorites.dishes.concat(req.params.dishId);
            favorites.save()
            .then((favorites) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})

.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation not supported for /favorites/' + req.params.dishId);
})

.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
    .populate('user dishes')
    .then((favorites) => {
        if(favorites != null) {

            var dishes = favorites.dishes;

            if(dishes.id(req.params.dishId) != null) {
                dishes.id(req.params.dishId).remove();
            }

            favorites.save()
            .then((favorites) => {
                Favorites.findById(favorites._id)
                .populate('user')
                .populate('dishes')
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorites);
                });
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found in your favorites!');
            err.statusCode = 404;
            return next(err); // return to error handler in app.js
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;