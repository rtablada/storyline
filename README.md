# Storyline.js

Storyline is a scenario runner for Node JS projects.
The goal is to help with cascading requirements for QA, Testing, and Demo purposes.

Let's say we needed to demo the onboarding process to new clients.
To get this all setup in a dev environment, we might need to:

* Migrate the database
* Register an OAuth application
* Create a dummy user
* Create Seeded Data for the user
* Create Seeded Data for the user's team

While a single scenario can be something that is memorizable, Storyline.js aims to make these kinds of app states faster and easier to recreate.

## Installation

To install Storyline.js run:

```bash
npm install --save storyline
```

## Setting Up a Storyline Instance

To get started using storyline, we will first need to create a new Storyline instance.
Since Storyline is built to work with any framework or library, it takes in a Javascript arugment for the `application` being worked on.
This could be anything from a POJO to a full application instance of our favorite JS framework.
For this example, we'll pass in a POJO with a small KNEX instance to be able to run migrations:

```js
const Storyline = require('storyline');
const pg = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  searchPath: 'knex,public',
});

const app = {db: pg};

const story = new Storyline(app);
```

## Creating Plots/Scenarios

In Storyline.js the different scenarios that we want to run in sequence to set up an application state are called `Plot`s.
Each `Plot` is a ES2015 class consisting of two possible attributes:

* `requirements` - a getter function returning an array of all the names of plots that need to be run before executing the current plot.
* `run` - a function that will be run after all requirements have been fulfilled. This function will receive the application instance passed in when we created our Storyline instance.

Here, let's create a plot called `CreateUser` that will insert a row into the users table:

```js
const Plot = require('storyline/plot');

class CreateUsers extends Plot {
  run(app) {
    return app.db('users').insert([
      {first_name: 'Tony', last_name: 'Stark'},
    ]);
  }
}
```

## Registering Plots With Storyline

Now that we have our `CreateUsers` Plot, we need to register it with our Storyline instance.
Here we will use the `addScenario` function to register our `create-users` plot to be run.
Then to run a registered plot, we will use the `run` method on our Storyline and pass in the plot name that we want to run.

```js
const Storyline = require('storyline');
const Plot = require('storyline/plot');
const pg = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  searchPath: 'knex,public',
});

const app = {db: pg};

const story = new Storyline(app);

class CreateUsers extends Plot {
  run(app) {
    return app.db('users').insert([
      {first_name: 'Tony', last_name: 'Stark'},
    ]);
  }
}

story.addScenario('create-users', CreateUsers);
story.run('create-users');
```

## Waiting on Other Plots

Now, what if we wanted to add something to our `aliases` table and set a foreign key to "Tony Stark"?
We need to use the `requirements` option to specify that we must be sure that `CreateUsers` has already run.

```js
const Storyline = require('storyline');
const Plot = require('storyline/plot');
const pg = require('knex')({
  client: 'pg',
  connection: process.env.PG_CONNECTION_STRING,
  searchPath: 'knex,public',
});

const app = {db: pg};

const story = new Storyline(app);

class CreateUsers extends Plot {
  run(app) {
    return app.db('users').insert([
      {first_name: 'Tony', last_name: 'Stark'},
    ]);
  }
}

class CreateAliases extends Plot {
  run(app) {
    return app.db('users').where(
      {first_name: 'Tony', last_name: 'Stark'}
    ).select('id').then((users) => {
      const user_id = users[0];

      return app.db('aliases').insert({user_id, name: 'Iron Man'});
    });
  }
}

story.addScenario('create-users', CreateUsers);
story.addScenario('create-aliases', CreateAliases);
story.run('create-aliases');
```
