// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

// get the Cat model
const { Cat, Dog } = models;

// default fake data so that we have something to work with until we make a real Cat
const catDefaultData = {
  name: 'unknown',
  bedsOwned: 0,
};

// object for us to keep track of the last Cat we made and dynamically update it sometimes
let lastAdded = new Cat(catDefaultData);

// Function to handle rendering the index page.
const hostIndex = (req, res) => {
  /* res.render will render the given view from the views folder. In this case, index.
     We pass it a number of variables to populate the page.
  */
  res.render('index', {
    currentName: lastAdded.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

// Function for rendering the page1 template
// Page1 has a loop that iterates over an array of cats
const hostPage1 = async (req, res) => {
  /* database / server aren't neccesarily connected
  - as such, async & always account for disconnections
  */
  try {
    /*
        .find() object as a parameter that defines the search
       .lean() only return the JS Objects being stored
       .exec() executes the chain of operations
    */
    const docs = await Cat.find({}).lean().exec();

    // Once we get back the docs array, we can send it to page1.
    return res.render('page1', { cats: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to find cats' });
  }
};

// Function to render the untemplated page2.
const hostPage2 = (req, res) => {
  res.render('page2');
};

// Function to render the untemplated page3.
const hostPage3 = (req, res) => {
  res.render('page3');
};

const hostPage4 = async (req, res) => {
  /* database / server aren't neccesarily connected
  - as such, async & always account for disconnections
  */
  try {
    /*
          .find() object as a parameter that defines the search
         .lean() only return the JS Objects being stored
         .exec() executes the chain of operations
      */
    const docs = await Dog.find({}).lean().exec();

    // Once we get back the docs array, we can send it to page1.
    return res.render('page4', { dogs: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to find dogs' });
  }
};

// Get name will return the name of the last added cat.
const getName = (req, res) => res.json({ name: lastAdded.name });

// Function to create a new cat in the database
const setName = async (req, res) => {
  /* page2.handlebars - form has inputs for a firstname, lastname and beds.
     When this POST request is sent to us, the bodyParser plugin
     we configured in app.js will store that information in req.body for us.
  */
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) {
    // If they are missing data, send back an error.
    return res.status(400).json({ error: 'firstname, lastname and beds are all required' });
  }

  /* we want to create a cat and add it to our database.
      - creating a cat that matches the format of our Cat schema
  */
  const catData = {
    name: `${req.body.firstname} ${req.body.lastname}`,
    bedsOwned: req.body.beds,
  };

  /*
   turn it into something the database
     - create a new instance of a Cat using the Cat model exported from Models
  */
  const newCat = new Cat(catData);

  try {
    /* newCat is a version of our catData that is database-friendly.
    .save() - intelligently add or update the cat in the database.
    */
    await newCat.save();
  } catch (err) {
    // log the error and send an error message back to the client.
    console.log(err);
    return res.status(500).json({ error: 'failed to create cat' });
  }

  /* - update our lastAdded cat to the one we just added.
     - We will then send that cat's data to the client.
  */
  lastAdded = newCat;
  return res.json({
    name: lastAdded.name,
    beds: lastAdded.bedsOwned,
  });
};

const setDogName = async (req, res) => {
  /* page3.handlebars - form inputs of name, breed, and age
  */
  if (!req.body.name || !req.body.breed || !req.body.age) {
    // If they are missing data, send back an error.
    return res.status(400).json({ error: 'name, breed, and age are all required' });
  }

  const dogData = {
    name: `${req.body.name}`,
    breed: `${req.body.breed}`,
    age: req.body.age,
  };

  const newDog = new Dog(dogData);

  try {
    await newDog.save();
  } catch (err) {
    // log the error and send an error message back to the client.
    console.log(err);
    return res.status(500).json({ error: 'failed to create dog' });
  }

  return res.json({
    name: newDog.name,
    breed: newDog.breed,
    age: newDog.age,
  });
};

// Function to handle searching a cat by name.
const searchName = async (req, res) => {
  /*
     If the user does not give us a name to search by, throw an error.
  */
  if (!req.query.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  let doc;
  try {
    /* .findOne() - find a single document in the database that matches the search parameters.

       One of three things will occur when trying to findOne in the database.
        1) An error will be thrown, which will stop execution of the try block and move to
            the catch block.
        2) Everything works, but the name was not found in the database returning an empty
            doc object.
        3) Everything works, and an object matching the search is found.
    */
    doc = await Cat.findOne({ name: req.query.name }).exec();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }

  // If we do not find something that matches our search, doc will be empty.
  if (!doc) {
    return res.json({ error: 'No cats found' });
  }

  // Otherwise, we got a result and will send it back to the user.
  return res.json({ name: doc.name, beds: doc.bedsOwned });
};

const increaseDogAge = async (req, res) => {
  /*
     If the user does not give us a name to search by, throw an error.
  */
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  let doc;
  try {
    /* .findOne() - find a single document in the database that matches the search parameters.

       One of three things will occur when trying to findOne in the database.
        1) An error will be thrown, which will stop execution of the try block and move to
            the catch block.
        2) Everything works, but the name was not found in the database returning an empty
            doc object.
        3) Everything works, and an object matching the search is found.
    */
    doc = await Dog.findOne({ name: req.body.name }).exec();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }

  // If we do not find something that matches our search, doc will be empty.
  if (!doc) {
    return res.json({ error: 'No dogs found' });
  }

  doc.age += 1;
  doc.save();

  // Otherwise, we got a result and will send it back to the user.
  return res.json({ name: doc.name, age: doc.age });
};

/* A function for updating the last cat added to the database.
*/
const updateLast = (req, res) => {
  // First we will update the number of bedsOwned.
  lastAdded.bedsOwned++;

  /* Remember that lastAdded is a Mongoose document (made on line 14 if no new
     ones were made after the server started, or line 116 if there was). Mongo
     documents have an _id, which is a globally unique identifier that distinguishes
     them from other documents. Our mongoose document also has this _id. When we
     call .save() on a document, Mongoose and Mongo will use the _id to determine if
     we are creating a new database entry (if the _id doesn't already exist), or
     if we are updating an existing entry (if the _id is already in the database).

     Since lastAdded is likely already in the database, .save() will update it rather
     than make a new cat.

     We can use async/await for this, or just use standard promise .then().catch() syntax.
  */
  const savePromise = lastAdded.save();

  // If we successfully save/update them in the database, send back the cat's info.
  savePromise.then(() => res.json({
    name: lastAdded.name,
    beds: lastAdded.bedsOwned,
  }));

  // If something goes wrong saving to the database, log the error and send a message to the client.
  savePromise.catch((err) => {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong' });
  });
};

// A function to send back the 404 page.
const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

// export the relevant public controller functions
module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  getName,
  setName,
  setDogName,
  increaseDogAge,
  updateLast,
  searchName,
  notFound,
};
