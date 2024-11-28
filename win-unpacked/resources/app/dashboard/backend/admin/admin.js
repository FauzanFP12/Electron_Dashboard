import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js'; // Adjust path if necessary

dotenv.config(); // Load environment variables

// Check that the MongoDB URI is loaded
if (!process.env.MONGO_URI) {
  console.error("MongoDB URI not found in environment variables.");
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(async () => {
    const hashedPassword = bcrypt.hashSync('user11', 10);
    const newUser = new User({
      username: 'user1',
      password: hashedPassword,
      role: 'user',
      fullName: 'User1',
    });
    await newUser.save();
    console.log('User created successfully');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  })
  .finally(() => {
    mongoose.connection.close(); // Close the connection regardless of outcome
  });
