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

async function checkGridFSFiles() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    console.log('Connected!\n');

    const fileIds = [
      '69751f86850f42a6b1c74d58',
      '69751fda850f42a6b1c74d6e'
    ];

    console.log('Checking GridFS files:\n');

    for (const fileId of fileIds) {
      const file = await db.collection('documents.files').findOne({
        _id: new mongoose.Types.ObjectId(fileId)
      });

      if (file) {
        console.log(`✅ FileId: ${fileId}`);
        console.log(`   Name: ${file.filename}`);
        console.log(`   Size: ${file.length} bytes`);
        console.log(`   Upload Date: ${file.uploadDate}\n`);
      } else {
        console.log(`❌ FileId: ${fileId} - NOT FOUND IN GRIDFS\n`);
      }
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkGridFSFiles();
