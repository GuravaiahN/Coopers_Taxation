// Simple script to make user@test.com an admin
// Run this in Node.js environment with MongoDB connection

const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/coopers-taxation');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isAdmin: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function makeAdmin() {
  try {
    // Update user@test.com to be admin
    const result = await User.updateOne(
      { email: 'user@test.com' },
      { 
        role: 'admin', 
        isAdmin: true 
      }
    );
    
    console.log('Update result:', result);
    
    if (result.modifiedCount > 0) {
      console.log('✅ Successfully made user@test.com an admin!');
    } else {
      console.log('❌ User not found or already admin');
    }
    
    // List all users to verify
    const users = await User.find({}, 'name email role isAdmin');
    console.log('\nAll users:');
    users.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}, Admin: ${user.isAdmin}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    mongoose.disconnect();
  }
}

makeAdmin();