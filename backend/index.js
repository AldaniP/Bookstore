'use strict'

const mongoose = require("mongoose");
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config(); // Loads .env by default

// If in test mode and .env.test exists, override with .env.test
if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: path.join(__dirname, '.env.test'), override: true });
}

const app = require('./src/app');
const port = process.env.PORT || 5000;
const dbUrl = process.env.NODE_ENV === 'test'
  ? process.env.DB_URL_TEST
  : process.env.DB_URL;

async function main() {
  if (!dbUrl) {
    throw new Error(`Database URL is undefined for NODE_ENV=${process.env.NODE_ENV}. Check your .env file.`);
  }
  await mongoose.connect(dbUrl);
}

// Only connect if not being required (i.e., when running directly)
// Or always connect but handle errors
main()
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      console.log("Mongodb connect successfully!");
    }
  })
  .catch(err => {
    if (process.env.NODE_ENV !== 'test') {
      console.log(err);
    }
  });

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

module.exports = { app, main };
