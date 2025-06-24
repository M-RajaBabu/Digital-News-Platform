const { sequelize, Category } = require('./models');
const { v4: uuidv4 } = require('uuid');

async function testCategoryModel() {
  try {
    console.log('🧪 Testing Category model...');
    
    // Ensure tables are created
    await sequelize.sync({ force: true });
    const tables = await sequelize.getQueryInterface().showAllTables();
    console.log('📋 Tables in database after sync:', tables);

    // Test creating a single category
    const category = await Category.create({
      id: uuidv4(),
      name: 'Test Category',
      slug: 'test-category',
      description: 'A test category',
      color: '#ff0000',
      icon: 'test',
      sortOrder: 1
    });
    
    console.log('✅ Category created successfully:', category.toJSON());
    
    // Test finding the category
    const foundCategory = await Category.findOne({
      where: { slug: 'test-category' }
    });
    
    console.log('✅ Category found:', foundCategory.toJSON());
    
    // Test bulk create
    const categories = await Category.bulkCreate([
      {
        id: uuidv4(),
        name: 'Test Category 2',
        slug: 'test-category-2',
        description: 'Another test category',
        color: '#00ff00',
        icon: 'test2',
        sortOrder: 2
      },
      {
        id: uuidv4(),
        name: 'Test Category 3',
        slug: 'test-category-3',
        description: 'Third test category',
        color: '#0000ff',
        icon: 'test3',
        sortOrder: 3
      }
    ]);
    
    console.log('✅ Bulk create successful:', categories.length, 'categories created');
    
    // List all categories
    const allCategories = await Category.findAll();
    console.log('📋 All categories:', allCategories.length);
    allCategories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testCategoryModel(); 