const { sequelize } = require('./config/database');
const models = require('./models');

async function syncDatabase() {
  try {
    console.log('🔄 Syncing database...');
    
    // Sync all models with force: true to drop and recreate all tables
    await sequelize.sync({ force: true });
    
    console.log('✅ Database synced successfully!');
    console.log('📊 Tables created:');
    
    // List all tables
    const tables = await sequelize.showAllSchemas();
    console.log(tables);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Database sync failed:', error);
    process.exit(1);
  }
}

syncDatabase(); 