require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const run = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    console.error('MONGO_URI required in .env');
    process.exit(1);
  }
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const name = process.env.SUPER_ADMIN_NAME || 'SUPER_ADMIN';

  if (!email || !password) {
    console.error('Set SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD in env');
    process.exit(1);
  }

  const exists = await User.findOne({ email });
  if (exists) {
    console.log('Super admin already exists:', email);
    process.exit(0);
  }

  const hash = await bcrypt.hash(password, 10);
  const user = new User({ email, passwordHash: hash, name, role: 'SUPER_ADMIN' });
  await user.save();
  console.log('Super admin created:', email);
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
