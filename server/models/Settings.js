import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Static method to get a setting by key
settingsSchema.statics.getSetting = async function(key, defaultValue = null) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : defaultValue;
};

// Static method to set a setting
settingsSchema.statics.setSetting = async function(key, value, userId = null, description = null) {
  const update = { value, updatedBy: userId };
  if (description) update.description = description;

  return await this.findOneAndUpdate(
    { key },
    update,
    { upsert: true, new: true }
  );
};

// Static method to get all settings
settingsSchema.statics.getAllSettings = async function() {
  const settings = await this.find();
  const result = {};
  settings.forEach(s => {
    result[s.key] = s.value;
  });
  return result;
};

export default mongoose.model('Settings', settingsSchema);
