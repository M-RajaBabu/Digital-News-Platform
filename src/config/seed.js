const {
  User,
  Category,
  Author,
  Article,
  ArticleAuthor,
  Comment,
  BookmarkCollection,
  SubscriptionPlan
} = require('../models');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Create subscription plans
    const plans = await SubscriptionPlan.bulkCreate([
      {
        id: uuidv4(),
        name: 'Free Plan',
        slug: 'free',
        description: 'Basic access to news articles',
        price: 0.00,
        duration: 0,
        features: ['Basic articles', 'Limited bookmarks', 'Comments'],
        isActive: true,
        sortOrder: 1,
        maxArticlesPerDay: 10,
        maxBookmarks: 50,
        allowComments: true,
        allowPremiumContent: false,
        allowAdFree: false,
        allowOfflineReading: false
      },
      {
        id: uuidv4(),
        name: 'Basic Plan',
        slug: 'basic',
        description: 'Enhanced reading experience',
        price: 9.99,
        duration: 30,
        features: ['All articles', 'Unlimited bookmarks', 'Ad-free reading', 'Comments'],
        isActive: true,
        sortOrder: 2,
        maxArticlesPerDay: 100,
        maxBookmarks: 500,
        allowComments: true,
        allowPremiumContent: false,
        allowAdFree: true,
        allowOfflineReading: false
      },
      {
        id: uuidv4(),
        name: 'Premium Plan',
        slug: 'premium',
        description: 'Complete news experience with premium content',
        price: 19.99,
        duration: 30,
        features: ['All articles', 'Premium content', 'Unlimited bookmarks', 'Ad-free', 'Offline reading', 'Priority support'],
        isActive: true,
        isPopular: true,
        sortOrder: 3,
        maxArticlesPerDay: -1,
        maxBookmarks: -1,
        allowComments: true,
        allowPremiumContent: true,
        allowAdFree: true,
        allowOfflineReading: true
      }
    ]);

    console.log('✅ Subscription plans created');

    // Create categories
    const categories = await Category.bulkCreate([
      {
        id: uuidv4(),
        name: 'Technology',
        slug: 'technology',
        description: 'Latest technology news and updates',
        color: '#007bff',
        icon: 'laptop',
        sortOrder: 1
      },
      {
        id: uuidv4(),
        name: 'Politics',
        slug: 'politics',
        description: 'Political news and analysis',
        color: '#dc3545',
        icon: 'flag',
        sortOrder: 2
      },
      {
        id: uuidv4(),
        name: 'Business',
        slug: 'business',
        description: 'Business and economic news',
        color: '#28a745',
        icon: 'briefcase',
        sortOrder: 3
      },
      {
        id: uuidv4(),
        name: 'Sports',
        slug: 'sports',
        description: 'Sports news and updates',
        color: '#ffc107',
        icon: 'trophy',
        sortOrder: 4
      },
      {
        id: uuidv4(),
        name: 'Entertainment',
        slug: 'entertainment',
        description: 'Entertainment and celebrity news',
        color: '#e83e8c',
        icon: 'star',
        sortOrder: 5
      },
      {
        id: uuidv4(),
        name: 'Health',
        slug: 'health',
        description: 'Health and wellness news',
        color: '#17a2b8',
        icon: 'heart',
        sortOrder: 6
      }
    ]);

    console.log('✅ Categories created');

    // Create users
    const users = await User.bulkCreate([
      {
        id: uuidv4(),
        email: 'admin@newsplatform.com',
        username: 'admin',
        password: await bcrypt.hash('admin123', 12),
        firstName: 'Admin',
        lastName: 'User',
        isVerified: true,
        isActive: true,
        subscriptionStatus: 'premium'
      },
      {
        id: uuidv4(),
        email: 'john.doe@example.com',
        username: 'johndoe',
        password: await bcrypt.hash('password123', 12),
        firstName: 'John',
        lastName: 'Doe',
        bio: 'News enthusiast and avid reader',
        isVerified: true,
        isActive: true,
        subscriptionStatus: 'basic'
      },
      {
        id: uuidv4(),
        email: 'jane.smith@example.com',
        username: 'janesmith',
        password: await bcrypt.hash('password123', 12),
        firstName: 'Jane',
        lastName: 'Smith',
        bio: 'Technology writer and blogger',
        isVerified: true,
        isActive: true,
        subscriptionStatus: 'free'
      }
    ]);

    console.log('✅ Users created');

    // Create authors
    const authors = await Author.bulkCreate([
      {
        id: uuidv4(),
        userId: users[1].id,
        penName: 'John Doe',
        bio: 'Experienced technology journalist with 10+ years in the industry',
        specialization: 'Technology',
        experience: 10,
        socialLinks: JSON.stringify({
          twitter: 'https://twitter.com/johndoe',
          linkedin: 'https://linkedin.com/in/johndoe',
          website: 'https://johndoe.com'
        }),
        isVerified: true,
        isActive: true
      },
      {
        id: uuidv4(),
        userId: users[2].id,
        penName: 'Jane Smith',
        bio: 'Technology writer and blogger with expertise in AI and machine learning',
        specialization: 'Technology',
        experience: 5,
        socialLinks: JSON.stringify({
          twitter: 'https://twitter.com/janesmith',
          linkedin: 'https://linkedin.com/in/janesmith',
          website: 'https://janesmith.com'
        }),
        isVerified: true,
        isActive: true
      }
    ]);

    console.log('✅ Authors created');

    // Create articles
    const articles = await Article.bulkCreate([
      {
        id: uuidv4(),
        title: 'The Future of Artificial Intelligence in 2024',
        slug: 'future-of-artificial-intelligence-2024',
        summary: 'Exploring the latest developments in AI and their impact on society',
        content: 'Artificial Intelligence has made remarkable progress in recent years...',
        excerpt: 'A comprehensive look at AI trends and predictions for 2024',
        featuredImage: 'https://example.com/ai-future.jpg',
        categoryId: categories[0].id, // Technology
        status: 'published',
        isPremium: false,
        isBreaking: false,
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        readingTime: 5,
        seoTitle: 'Future of AI 2024: Trends and Predictions',
        seoDescription: 'Discover the latest AI trends and what to expect in 2024',
        seoKeywords: 'AI, artificial intelligence, 2024, technology trends',
        publishedAt: new Date()
      },
      {
        id: uuidv4(),
        title: 'New Economic Policies Announced',
        slug: 'new-economic-policies-announced',
        summary: 'Government announces comprehensive economic reform package',
        content: 'The government has unveiled a new economic policy framework...',
        excerpt: 'Major economic reforms set to transform the business landscape',
        featuredImage: 'https://example.com/economy.jpg',
        categoryId: categories[2].id, // Business
        status: 'published',
        isPremium: true,
        isBreaking: true,
        viewCount: 0,
        likeCount: 0,
        commentCount: 0,
        shareCount: 0,
        readingTime: 8,
        seoTitle: 'New Economic Policies: What You Need to Know',
        seoDescription: 'Complete guide to the new economic policies and their impact',
        seoKeywords: 'economy, policy, business, reform',
        publishedAt: new Date()
      }
    ]);

    console.log('✅ Articles created');

    // Create article-author relationships
    await ArticleAuthor.bulkCreate([
      {
        id: uuidv4(),
        articleId: articles[0].id,
        authorId: authors[0].id,
        role: 'author',
        order: 1
      },
      {
        id: uuidv4(),
        articleId: articles[1].id,
        authorId: authors[1].id,
        role: 'author',
        order: 1
      }
    ]);

    console.log('✅ Article-author relationships created');

    // Create comments
    await Comment.bulkCreate([
      {
        id: uuidv4(),
        content: 'Great article! AI is definitely the future.',
        articleId: articles[0].id,
        userId: users[1].id,
        status: 'approved',
        upvotes: 5,
        downvotes: 0,
        score: 5
      },
      {
        id: uuidv4(),
        content: 'Interesting insights on economic policies.',
        articleId: articles[1].id,
        userId: users[2].id,
        status: 'approved',
        upvotes: 3,
        downvotes: 1,
        score: 2
      }
    ]);

    console.log('✅ Comments created');

    // Create bookmark collections
    await BookmarkCollection.bulkCreate([
      {
        id: uuidv4(),
        userId: users[1].id,
        name: 'Technology Articles',
        description: 'Interesting tech articles to read later',
        isPublic: true,
        color: '#007bff'
      },
      {
        id: uuidv4(),
        userId: users[2].id,
        name: 'Business News',
        description: 'Important business and economic news',
        isPublic: false,
        color: '#28a745'
      }
    ]);

    console.log('✅ Bookmark collections created');

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Created:`);
    console.log(`   - ${plans.length} subscription plans`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${users.length} users`);
    console.log(`   - ${authors.length} authors`);
    console.log(`   - ${articles.length} articles`);
    console.log(`   - 2 comments`);
    console.log(`   - 2 bookmark collections`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

module.exports = seedDatabase; 