const mongoose = require('mongoose');
const fs = require('fs');

// Load env vars manually
const envContent = fs.readFileSync('.env.local', 'utf8');
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    process.env[match[1]] = match[2];
  }
});

const DocumentSchema = new mongoose.Schema({
  fileId: mongoose.Schema.Types.ObjectId,
  originalName: String,
  mimeType: String,
  size: Number,
  userId: mongoose.Schema.Types.ObjectId,
  status: String,
  createdAt: Date
}, { collection: 'documents' });

const UserSchema = new mongoose.Schema({
  name: String,
  email: String
}, { collection: 'users' });

async function checkDocuments() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!\n');

    const Document = mongoose.model('Document', DocumentSchema);
    const User = mongoose.model('User', UserSchema);

    // Find Sarah Johnson
    const sarah = await User.findOne({ email: 'sarah.johnson@example.com' });
    
    if (!sarah) {
      console.log('❌ Sarah Johnson not found in database');
      await mongoose.connection.close();
      return;
    }

    console.log(`✅ Found Sarah Johnson (ID: ${sarah._id})\n`);

    // Find all her documents
    const docs = await Document.find({ userId: sarah._id });

    console.log(`Found ${docs.length} document(s) for Sarah:\n`);

    for (const doc of docs) {
      console.log(`Document ID: ${doc._id}`);
      console.log(`  Name: ${doc.originalName}`);
      console.log(`  FileId: ${doc.fileId || 'MISSING'}`);
      console.log(`  Size: ${doc.size} bytes`);
      console.log(`  Status: ${doc.status}`);
      console.log(`  Created: ${doc.createdAt}\n`);
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkDocuments();
