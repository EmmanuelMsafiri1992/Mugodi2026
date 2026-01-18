// Migration script to update category names
// Run: MONGO_URI="your-mongo-uri" node scripts/migrate-categories.js
// Or: node scripts/migrate-categories.js (if .env exists)

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Try to load .env from server directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.DB_URI;

if (!MONGO_URI) {
  console.error('ERROR: MongoDB URI not found!');
  console.error('');
  console.error('Please run with:');
  console.error('  MONGO_URI="mongodb://localhost:27017/mugodi" node scripts/migrate-categories.js');
  console.error('');
  console.error('Or create a .env file in the server directory with:');
  console.error('  MONGO_URI=mongodb://localhost:27017/mugodi');
  process.exit(1);
}

const categoryUpdates = [
  { slug: 'beans', name: 'Beans', nameChichewa: 'Nyemba', icon: '🫘' },
  { slug: 'groundnuts', name: 'Groundnuts', nameChichewa: 'Ntedza', icon: '🥜' },
  { slug: 'bambara-groundnuts', name: 'Bambara Groundnuts', nameChichewa: 'Nzama', icon: '🌰' },
  { slug: 'pigeon-peas', name: 'Pigeon Peas', nameChichewa: 'Nandolo', icon: '🟤' },
  { slug: 'cowpeas', name: 'Cowpeas', nameChichewa: 'Khobwe', icon: '⚪' },
  { slug: 'soybeans', name: 'Soybeans', nameChichewa: 'Soya', icon: '🫛' },
  { slug: 'lentils', name: 'Lentils', nameChichewa: 'Malenti', icon: '🔴' },
  { slug: 'chickpeas', name: 'Chickpeas', nameChichewa: 'Nandolo ya ku India', icon: '🟡' },
  { slug: 'green-gram', name: 'Green Gram', nameChichewa: 'Nandolo Zobiriwira', icon: '🟢' },
  { slug: 'peas', name: 'Peas', nameChichewa: 'Nsawawa', icon: '🫛' },
  { slug: 'broad-beans', name: 'Broad Beans', nameChichewa: 'Nyemba Zazikulu', icon: '🫘' },
  { slug: 'lima-beans', name: 'Lima Beans', nameChichewa: 'Nyemba za Batala', icon: '🫘' },
  { slug: 'velvet-beans', name: 'Velvet Beans', nameChichewa: 'Nyemba Zakutchire', icon: '🫘' },
  { slug: 'lablab-beans', name: 'Lablab Beans', nameChichewa: 'Nyemba za Mphonda', icon: '🫘' },
];

async function migrateCategories() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const categoriesCollection = db.collection('categories');

    console.log('\nUpdating categories...');
    for (const update of categoryUpdates) {
      const result = await categoriesCollection.updateOne(
        { slug: update.slug },
        {
          $set: {
            name: update.name,
            nameChichewa: update.nameChichewa,
            icon: update.icon
          }
        }
      );

      if (result.matchedCount > 0) {
        console.log(`  ✓ Updated: ${update.name} (${update.nameChichewa})`);
      } else {
        console.log(`  ✗ Not found: ${update.slug}`);
      }
    }

    console.log('\nMigration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exit(1);
  }
}

migrateCategories();
