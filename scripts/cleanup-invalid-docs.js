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

async function cleanupInvalidDocuments() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!\n');

    const Document = mongoose.model('Document', DocumentSchema);

    // Find documents without fileId
    const invalidDocs = await Document.find({ 
      fileId: { $exists: false } 
    }).populate('userId', 'name email');

    console.log(`Found ${invalidDocs.length} documents without fileId:\n`);

    for (const doc of invalidDocs) {
      console.log(`- ${doc.originalName}`);
      console.log(`  ID: ${doc._id}`);
      console.log(`  User: ${doc.userId?.email || 'Unknown'}`);
      console.log(`  Uploaded: ${doc.createdAt}`);
      console.log(`  Status: ${doc.status}\n`);
    }

    if (invalidDocs.length > 0) {
      console.log('\n⚠️  These documents cannot be downloaded because they were uploaded');
      console.log('   before the GridFS fix and have no actual file data stored.');
      console.log('\nOptions:');
      console.log('1. Delete them: node scripts/cleanup-invalid-docs.js --delete');
      console.log('2. Mark as REJECTED: node scripts/cleanup-invalid-docs.js --reject');
      console.log('3. Keep them as-is (do nothing)\n');

      const action = process.argv[2];

      if (action === '--delete') {
        const result = await Document.deleteMany({ fileId: { $exists: false } });
        console.log(`✅ Deleted ${result.deletedCount} invalid documents`);
      } else if (action === '--reject') {
        const result = await Document.updateMany(
          { fileId: { $exists: false } },
          { status: 'REJECTED' }
        );
        console.log(`✅ Marked ${result.modifiedCount} documents as REJECTED`);
      }
    } else {
      console.log('✅ No invalid documents found - all documents have fileId!');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

cleanupInvalidDocuments();
