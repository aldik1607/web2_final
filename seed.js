require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});

    // Create users with different roles
    const admin = await User.create({
      username: 'admin',
      email: 'admin@coffee.com',
      password: 'admin123',
      role: 'admin'
    });

    await User.create({
      username: 'moderator',
      email: 'mod@coffee.com',
      password: 'mod123',
      role: 'moderator'
    });

    await User.create({
      username: 'premium',
      email: 'premium@coffee.com',
      password: 'premium123',
      role: 'premium'
    });

    await User.create({
      username: 'user',
      email: 'user@coffee.com',
      password: 'user123',
      role: 'user'
    });

    console.log('Users created');

    // Create sample products
    const products = [
      { name: 'Espresso', description: 'Strong black coffee', price: 2.99, category: 'coffee', createdBy: admin._id },
      { name: 'Latte', description: 'Espresso with steamed milk', price: 4.49, category: 'coffee', createdBy: admin._id },
      { name: 'Cappuccino', description: 'Espresso with foam', price: 4.29, category: 'coffee', createdBy: admin._id },
      { name: 'Green Tea', description: 'Organic green tea', price: 2.99, category: 'tea', createdBy: admin._id },
      { name: 'Croissant', description: 'Butter croissant', price: 3.49, category: 'pastry', createdBy: admin._id },
      { name: 'Muffin', description: 'Chocolate chip muffin', price: 2.99, category: 'pastry', createdBy: admin._id }
    ];

    await Product.insertMany(products);
    console.log('Products created');

    console.log('\n--- Test Accounts ---');
    console.log('Admin:     admin@coffee.com / admin123');
    console.log('Moderator: mod@coffee.com / mod123');
    console.log('Premium:   premium@coffee.com / premium123');
    console.log('User:      user@coffee.com / user123');

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

seedDB();
