const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/coopers_taxation';

// User schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  image: { type: String, default: null },
  isAdmin: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function createTestUser() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'testuser@cooperstaxation.com' });
    
    if (existingUser) {
      console.log('Test user already exists!');
      console.log('Email: testuser@cooperstaxation.com');
      console.log('Password: Test123!');
      await mongoose.disconnect();
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('Test123!', 10);

    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'testuser@cooperstaxation.com',
      password: hashedPassword,
      phone: '+1-555-123-4567',
      role: 'user',
      isAdmin: false
    });

    await testUser.save();

    console.log('\n✅ Test user created successfully!');
    console.log('==========================================');
    console.log('Email: testuser@cooperstaxation.com');
    console.log('Password: Test123!');
    console.log('Role: user');
    console.log('==========================================\n');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
