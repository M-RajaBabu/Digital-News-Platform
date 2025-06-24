const { sequelize } = require('./config/database');
const { User, Category, Article, Author } = require('./models');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function testDatabase() {
  try {
    console.log('🧪 Testing database functionality...');
    
    // Test creating a user with unique data
    const uniqueId = uuidv4().substring(0, 8);
    const user = await User.create({
      id: uuidv4(),
      email: `test${uniqueId}@example.com`,
      username: `testuser${uniqueId}`,
      password: await bcrypt.hash('password123', 12),
      firstName: 'Test',
      lastName: 'User',
      isVerified: true,
      isActive: true
    });
    console.log('✅ User created:', user.id);
    
    // Test creating a category with unique data
    const category = await Category.create({
      id: uuidv4(),
      name: `Technology ${uniqueId}`,
      slug: `technology-${uniqueId}`,
      description: 'Latest technology news',
      icon: 'laptop',
      color: '#007bff',
      isActive: true,
      sortOrder: 1
    });
    console.log('✅ Category created:', category.id);
    
    // Test creating an author
    const author = await Author.create({
      id: uuidv4(),
      userId: user.id,
      penName: `Test Author ${uniqueId}`,
      bio: 'Test author bio',
      specialization: 'Technology',
      experience: 5,
      isVerified: true,
      isActive: true
    });
    console.log('✅ Author created:', author.id);
    
    // Test creating an article
    const article = await Article.create({
      id: uuidv4(),
      title: `Test Article ${uniqueId}`,
      slug: `test-article-${uniqueId}`,
      content: 'This is a test article content.',
      summary: 'Test article summary',
      categoryId: category.id,
      authorId: author.id,
      status: 'published',
      isPublished: true,
      isPremium: false,
      allowComments: true
    });
    console.log('✅ Article created:', article.id);
    
    // Test queries
    const users = await User.findAll();
    const categories = await Category.findAll();
    const articles = await Article.findAll();
    
    console.log('📊 Database summary:');
    console.log(`- Users: ${users.length}`);
    console.log(`- Categories: ${categories.length}`);
    console.log(`- Articles: ${articles.length}`);
    
    console.log('✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testDatabase(); 