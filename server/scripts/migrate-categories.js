// Migration script to update category names
// Run: node scripts/migrate-categories.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

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
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const categoriesCollection = db.collection('categories');

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
        console.log(`Updated: ${update.name} (${update.nameChichewa})`);
      } else {
        console.log(`Not found: ${update.slug}`);
      }
    }

    console.log('\nMigration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrateCategories();
