var Actor = require('../models/actor');
var Movie = require('../models/movie');
const mongoose = require('mongoose');
module.exports = {
    getAll: function (req, res) {
        Movie.find({})
        .populate('actors') // collection in compass
        .exec(function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
         });
    },
    createOne: function (req, res) {
        let newMovieDetails = req.body;
        newMovieDetails._id = new mongoose.Types.ObjectId();
        Movie.create(newMovieDetails, function (err, movie) {
            if (err) return res.status(400).json(err);
            res.json(movie);
        });
    },
    getOne: function (req, res) {
        Movie.findOne({ _id: req.params.id })
            .populate('actors')
            .exec(function (err, movie) {
                if (err) return res.status(400).json(err);
                if (!movie) return res.status(404).json();
                res.json(movie);
            });
    },
    updateOne: function (req, res) {
        Movie.findOneAndUpdate({ _id: req.params.id }, req.body, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            res.json(movie);
        });
    },
    //delete movie by its ID
    deleteOne: function (req, res) {
        Movie.findOneAndRemove({ _id: req.params.id }, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    },
    //remove an actor from the list of actors in a movie
    deleteOneActorList: function(req,res){
        Movie.findOne({ _id: req.params.mId }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            let actorId = req.params.aId;
            for(let i=0; i<movie.actors.length;i++){
                if(movie.actors[i]==actorId){
                    (movie.actors).splice(i,1);
                    movie.save(function (err) {
                        if (err) return res.status(500).json(err);
                        res.json(movie);
                    });
                }
            }
        });
    },
    //add an existing actor to the list of actors in a movie
    addActor: function (req, res) {
        Movie.findOne({ _id: req.params.id }, function (err, movie) {
            if (err) return res.status(400).json(err);
            if (!movie) return res.status(404).json();
            Actor.findOne({ _id: req.body.id }, function (err, actor) {
                if (err) return res.status(400).json(err);
                if (!actor) return res.status(404).json();
                movie.actors.push(actor._id);
                movie.save(function (err) {
                    if (err) return res.status(500).json(err);
                    res.json(movie);
                });
            })
        })
    },
    //get all movies produced between year1 and year2, where year1>year2
    getMoviesBetweenYears: function(req,res){
        let year1 = req.params.year1;
        let year2 = req.params.year2;
        let query = { year: { $gte: year2, $lte: year1 }};
        Movie.find(query,function (err, movies) {
            if (err) return res.status(400).json(err);
            res.json(movies);
        });
    },
    //Delete all the movies that are produced between two years
    deleteMoviesBetweenYears: function(req,res){
        let year1 = req.body.year1;
        let year2 = req.body.year2;
        let query = { year: { $gte: year2, $lte: year1 }};
        Movie.deleteMany(query, function (err) {
            if (err) return res.status(400).json(err);
            res.json();
        });
    }
};