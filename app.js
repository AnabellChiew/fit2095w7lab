const express = require('express');
const mongoose = require('mongoose');
const actors = require('./routers/actor');
const movies = require('./routers/movie');
const app = express();
app.listen(8080);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
mongoose.connect('mongodb://localhost:27017/movies', function (err) {
    if (err) {
        return console.log('Mongoose - connection error:', err);
    }
    console.log('Connect Successfully');
});
//Configuring Endpoints
//Actor RESTFul endpoionts 
app.get('/actors', actors.getAll);
app.post('/actors', actors.createOne);
app.get('/actors/:id', actors.getOne);
app.put('/actors/:id', actors.updateOne);
app.post('/actors/:id/movies', actors.addMovie);
app.delete('/actors/:id', actors.deleteOne);
app.delete('/actors/movies/:id', actors.removeActorMovie); //delete an actor by its ID and all its movie from Movie collection
app.delete('/actors/:aId/:mId',actors.deleteOneMovieList); //remove a movie from the list of movies of an actor
//Movie RESTFul  endpoints
app.get('/movies', movies.getAll);
app.post('/movies', movies.createOne);
app.get('/movies/:id', movies.getOne);
app.put('/movies/:id', movies.updateOne);
app.delete('/movies/:id', movies.deleteOne); //delete movie by its ID
app.delete('/movies/:mId/:aId',movies.deleteOneActorList); //remove an actor from the list of actors in a movie
app.post('/movies/:id/actors',movies.addActor); //add an existing actor to the list of actors in a movie
app.get('/movies/:year2/:year1',movies.getMoviesBetweenYears); //get all movies produced between year1 and year2, where year1>year2
app.delete('/movies',movies.deleteMoviesBetweenYears); //Delete all the movies that are produced between two years