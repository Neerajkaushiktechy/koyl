import mongoose from 'mongoose';

mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost:27017/koyl-db',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to MongoDB');
    }
  },
);
