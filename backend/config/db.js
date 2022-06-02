const { ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });

    console.log(`MongoDB Connected`);
  } catch (error) {
    console.log(`Error: ${error}`);
    process.exit();
  }
};

module.exports = db;
