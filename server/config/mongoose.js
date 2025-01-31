require('dotenv').config();
const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

mongoose.connect(
  process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/recruitment_platform_local'
);

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));

db.once('open', function () {
  console.log('Connected to MongoDB Database');
});

module.exports = db;
