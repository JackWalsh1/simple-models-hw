// require mongoose, a popular MongoDB library for nodejs
const mongoose = require('mongoose');

// variable to hold our Model
let DogModel = {};

/*
   Name should be a unique string
   Breed should be a string
   Age should be a number (...yep, not touching that one)
   CreatedDate should be date added
   */
const DogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },

  breed: {
    type: String,
    required: true,
    trim: true,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  createdDate: {
    type: Date,
    default: Date.now,
  },

});

// label discriminator
DogModel = mongoose.model('Dog', DogSchema);

// export dog model
module.exports = DogModel;
