import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Skema pengguna
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Middleware untuk hash password sebelum menyimpan user
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10); // Hash password
  }
  next();
});

// Method untuk membandingkan password
// Method to compare the plain password with the hashed password
userSchema.methods.isPasswordMatch = async function(password) {
    return bcrypt.compare(password, this.password);  // Correct usage of bcrypt.compare
  };
  

const User = mongoose.model('User', userSchema);

export default User;
