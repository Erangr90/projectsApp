const mongoose  = require('mongoose');
require('dotenv').config()
const colors = require('colors');


const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    console.log(('MongoDB Connect: ' + conn.connection.host).cyan.underline);
  } catch (error) {
    console.error(('Error: ' + error.message).red.underline.bold);
    process.exit(1);
  }
};

module.exports =  connectDB;
