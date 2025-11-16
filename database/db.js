const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongodB connected');
  } catch (error) {
    console.error('DB connection Failed', error);
    process.exit(1);
  }
};

module.exports = connectDB;
