// import the controllers
const controllers = require('./controllers');

// function to attach routes
const router = (app) => {
  // pass the express app in

  app.get('/page1', controllers.page1);
  app.get('/page2', controllers.page2);
  app.get('/page3', controllers.page3);
  app.get('/page4', controllers.page4);
  app.get('/getName', controllers.getName);
  app.get('/findByName', controllers.searchName);

  // blank hit -> index
  app.get('/', controllers.index);

  // wildcard catch -> notFound
  app.get('/*', controllers.notFound);

  app.post('/setName', controllers.setName);
  app.post('/setDogName', controllers.setDogName);
  app.post('/increaseDogAge', controllers.increaseDogAge);

  app.post('/updateLast', controllers.updateLast);
};

// export the router function
module.exports = router;
