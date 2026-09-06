require('dotenv').config();
const mongoose = require('mongoose');
const connectDatabase = require('./config/db');
const Food = require('./models/Food');

const foods = [
  { name: 'Classic Cheeseburger', description: 'Grilled beef patty, cheddar, lettuce, tomato, and house sauce.', category: 'Burgers', price: 10.99, imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85' },
  { name: 'Margherita Pizza', description: 'Tomato, fresh mozzarella, basil, and olive oil on a crisp crust.', category: 'Pizza', price: 12.5, imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85' },
  { name: 'Crispy Chicken Bowl', description: 'Crispy chicken, jasmine rice, greens, pickled vegetables, and sesame dressing.', category: 'Bowls', price: 13.25, imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85' },
  { name: 'Garden Salad', description: 'Mixed greens, cucumber, tomato, avocado, and lemon vinaigrette.', category: 'Salads', price: 8.75, imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85' },
  { name: 'Chocolate Brownie', description: 'Warm fudgy brownie with a lightly crisp top.', category: 'Desserts', price: 5.25, imageUrl: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85' }
];

async function seed() {
  await connectDatabase();
  await Food.deleteMany({});
  await Food.insertMany(foods);
  console.log(`Seeded ${foods.length} food items`);
  await mongoose.connection.close();
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
