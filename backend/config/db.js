// const { ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

const db = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://mongo:12345@cluster0.ahqrmpk.mongodb.net/?retryWrites=true&w=majority'
    );

    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit();
  }
};

module.exports = db;
