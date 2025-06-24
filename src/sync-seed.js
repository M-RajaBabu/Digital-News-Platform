const { sequelize, User, Category, Author, Article, SubscriptionPlan } = require('./models');
const seedDatabase = require('./config/seed');

async function syncAndSeed() {
  try {
    console.log('🔄 Syncing database (force: true)...');
    await sequelize.sync({ force: true });
    console.log('✅ Database synced!');

    // Log all tables in the SQLite database
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('📋 Tables in database after sync:', tables);

    await seedDatabase();
    console.log('🌱 Database seeded!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Sync/Seed failed:', error);
    process.exit(1);
  }
}

syncAndSeed(); 