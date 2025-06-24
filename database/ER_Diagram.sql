-- =====================================================
-- DIGITAL NEWS PLATFORM - ENTITY RELATIONSHIP DIAGRAM
-- =====================================================
-- Complete database schema with all tables, relationships, and constraints
-- This file contains the entire database structure for the Digital News Platform

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS "Users" (
  "id" VARCHAR(36) PRIMARY KEY,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "username" VARCHAR(30) UNIQUE NOT NULL,
  "password" VARCHAR(255),
  "firstName" VARCHAR(50) NOT NULL,
  "lastName" VARCHAR(50) NOT NULL,
  "avatar" VARCHAR(255),
  "bio" TEXT,
  "dateOfBirth" DATE,
  "phone" VARCHAR(20),
  "location" VARCHAR(100),
  "googleId" VARCHAR(255) UNIQUE,
  "facebookId" VARCHAR(255) UNIQUE,
  "preferences" TEXT,
  "subscriptionStatus" VARCHAR(20) DEFAULT 'free',
  "subscriptionExpiry" DATETIME,
  "isVerified" BOOLEAN DEFAULT 0,
  "isActive" BOOLEAN DEFAULT 1,
  "lastLoginAt" DATETIME,
  "readingTime" INTEGER DEFAULT 0,
  "articlesRead" INTEGER DEFAULT 0,
  "createdAt" DATETIME NOT NULL,
  "updatedAt" DATETIME NOT NULL
);

-- =====================================================
-- 2. CATEGORIES TABLE (Self-referencing for subcategories)
-- =====================================================
CREATE TABLE IF NOT EXISTS "Categories" (
  "id" VARCHAR(36) PRIMARY KEY,
  "name" VARCHAR(100) UNIQUE NOT NULL,
  "slug" VARCHAR(100) UNIQUE NOT NULL,
  "description" TEXT,
  "parentId" VARCHAR(36),
  "icon" VARCHAR(100),
  "color" VARCHAR(7) DEFAULT '#007bff',
  "isActive" BOOLEAN DEFAULT 1,
  "sortOrder" INTEGER DEFAULT 0,
  "articleCount" INTEGER DEFAULT 0,
  "viewCount" INTEGER DEFAULT 0,
  "metaTitle" VARCHAR(255),
  "metaDescription" TEXT,
  "settings" TEXT,
  "createdAt" DATETIME NOT NULL,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("parentId") REFERENCES "Categories" ("id") ON DELETE SET NULL
);

-- =====================================================
-- 3. AUTHORS TABLE (1:1 with Users)
-- =====================================================
CREATE TABLE IF NOT EXISTS "Authors" (
  "id" VARCHAR(36) PRIMARY KEY,
  "userId" VARCHAR(36) NOT NULL,
  "penName" VARCHAR(100) UNIQUE NOT NULL,
  "bio" TEXT,
  "specialization" VARCHAR(100),
  "experience" INTEGER,
  "socialLinks" TEXT,
  "isVerified" BOOLEAN DEFAULT 0,
  "isActive" BOOLEAN DEFAULT 1,
  "totalArticles" INTEGER DEFAULT 0,
  "totalViews" INTEGER DEFAULT 0,
  "totalFollowers" INTEGER DEFAULT 0,
  "awards" TEXT,
  "contactEmail" VARCHAR(255),
  "preferences" TEXT,
  "createdAt" DATETIME NOT NULL,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE
);

-- =====================================================
-- 4. ARTICLES TABLE (N:1 with Categories, N:1 with Users)
-- =====================================================
CREATE TABLE IF NOT EXISTS "Articles" (
  "id" VARCHAR(36) PRIMARY KEY,
  "title" VARCHAR(200) NOT NULL,
  "slug" VARCHAR(200) UNIQUE NOT NULL,
  "summary" TEXT,
  "content" TEXT NOT NULL,
  "excerpt" TEXT,
  "featuredImage" VARCHAR(255),
  "images" TEXT,
  "videos" TEXT,
  "categoryId" VARCHAR(36) NOT NULL,
  "tags" TEXT,
  "readingTime" INTEGER DEFAULT 0,
  "wordCount" INTEGER DEFAULT 0,
  "viewCount" INTEGER DEFAULT 0,
  "likeCount" INTEGER DEFAULT 0,
  "commentCount" INTEGER DEFAULT 0,
  "shareCount" INTEGER DEFAULT 0,
  "bookmarkCount" INTEGER DEFAULT 0,
  "status" VARCHAR(20) DEFAULT 'draft',
  "isPremium" BOOLEAN DEFAULT 0,
  "isBreaking" BOOLEAN DEFAULT 0,
  "isTrending" BOOLEAN DEFAULT 0,
  "isFeatured" BOOLEAN DEFAULT 0,
  "publishedAt" DATETIME,
  "scheduledAt" DATETIME,
  "metaTitle" VARCHAR(255),
  "metaDescription" TEXT,
  "metaKeywords" VARCHAR(255),
  "settings" TEXT,
  "language" VARCHAR(2) DEFAULT 'en',
  "location" VARCHAR(100),
  "source" VARCHAR(100),
  "sourceUrl" VARCHAR(255),
  "createdAt" DATETIME NOT NULL,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("categoryId") REFERENCES "Categories" ("id") ON DELETE CASCADE
);

-- =====================================================
-- 5. ARTICLEAUTHORS JUNCTION TABLE (N:M between Articles and Authors)
-- =====================================================
CREATE TABLE IF NOT EXISTS "ArticleAuthors" (
  "id" VARCHAR(36) PRIMARY KEY,
  "articleId" VARCHAR(36) NOT NULL,
  "authorId" VARCHAR(36) NOT NULL,
  "role" VARCHAR(20) DEFAULT 'primary',
  "contribution" VARCHAR(100),
  "createdAt" DATETIME NOT NULL,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("articleId") REFERENCES "Articles" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("authorId") REFERENCES "Authors" ("id") ON DELETE CASCADE,
  UNIQUE("articleId", "authorId")
);

-- =====================================================
-- 6. COMMENTS TABLE (N:1 with Articles, N:1 with Users, Self-referencing for replies)
-- =====================================================
CREATE TABLE IF NOT EXISTS "Comments" (
  "id" VARCHAR(36) PRIMARY KEY,
  "articleId" VARCHAR(36) NOT NULL,
  "userId" VARCHAR(36) NOT NULL,
  "parentId" VARCHAR(36),
  "content" TEXT NOT NULL,
  "status" VARCHAR(20) DEFAULT 'pending',
  "moderatedBy" VARCHAR(36),
  "moderatedAt" DATETIME,
  "moderationReason" VARCHAR(100),
  "upvotes" INTEGER DEFAULT 0,
  "downvotes" INTEGER DEFAULT 0,
  "replyCount" INTEGER DEFAULT 0,
  "guestName" VARCHAR(100),
  "guestEmail" VARCHAR(255),
  "userAgent" VARCHAR(255),
  "ipAddress" VARCHAR(45),
  "createdAt" DATETIME NOT NULL,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("articleId") REFERENCES "Articles" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("parentId") REFERENCES "Comments" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("moderatedBy") REFERENCES "Users" ("id") ON DELETE SET NULL
);

-- =====================================================
-- 7. BOOKMARKCOLLECTIONS TABLE (N:1 with Users)
-- =====================================================
CREATE TABLE IF NOT EXISTS "BookmarkCollections" (
  "id" VARCHAR(36) PRIMARY KEY,
  "userId" VARCHAR(36) NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "color" VARCHAR(7) DEFAULT '#007bff',
  "icon" VARCHAR(100),
  "isPublic" BOOLEAN DEFAULT 0,
  "isDefault" BOOLEAN DEFAULT 0,
  "articleCount" INTEGER DEFAULT 0,
  "sortOrder" INTEGER DEFAULT 0,
  "createdAt" DATETIME NOT NULL,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE
);

-- =====================================================
-- 8. BOOKMARKS TABLE (N:1 with Users, N:1 with Articles, N:1 with BookmarkCollections)
-- =====================================================
CREATE TABLE IF NOT EXISTS "Bookmarks" (
  "id" VARCHAR(36) PRIMARY KEY,
  "userId" VARCHAR(36) NOT NULL,
  "articleId" VARCHAR(36) NOT NULL,
  "collectionId" VARCHAR(36),
  "notes" TEXT,
  "tags" TEXT,
  "isPublic" BOOLEAN DEFAULT 0,
  "createdAt" DATETIME NOT NULL,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("articleId") REFERENCES "Articles" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("collectionId") REFERENCES "BookmarkCollections" ("id") ON DELETE SET NULL,
  UNIQUE("userId", "articleId")
);

-- =====================================================
-- 9. READINGHISTORY TABLE (N:1 with Users, N:1 with Articles)
-- =====================================================
CREATE TABLE IF NOT EXISTS "ReadingHistory" (
  "id" VARCHAR(36) PRIMARY KEY,
  "userId" VARCHAR(36) NOT NULL,
  "articleId" VARCHAR(36) NOT NULL,
  "readAt" DATETIME NOT NULL,
  "readingDuration" INTEGER,
  "progress" REAL,
  "completed" BOOLEAN DEFAULT 0,
  "deviceInfo" TEXT,
  "userAgent" VARCHAR(255),
  "ipAddress" VARCHAR(45),
  "createdAt" DATETIME NOT NULL,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("articleId") REFERENCES "Articles" ("id") ON DELETE CASCADE
);

-- =====================================================
-- 10. SUBSCRIPTIONPLANS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS "SubscriptionPlans" (
  "id" VARCHAR(36) PRIMARY KEY,
  "name" VARCHAR(100) NOT NULL,
  "slug" VARCHAR(100) UNIQUE NOT NULL,
  "description" TEXT,
  "price" DECIMAL(10,2) NOT NULL,
  "currency" VARCHAR(3) DEFAULT 'USD',
  "billingCycle" VARCHAR(20) DEFAULT 'monthly',
  "duration" INTEGER NOT NULL,
  "features" TEXT,
  "isActive" BOOLEAN DEFAULT 1,
  "isPopular" BOOLEAN DEFAULT 0,
  "sortOrder" INTEGER DEFAULT 0,
  "maxArticlesPerDay" INTEGER,
  "maxBookmarks" INTEGER,
  "allowComments" BOOLEAN DEFAULT 1,
  "allowPremiumContent" BOOLEAN DEFAULT 0,
  "allowAdFree" BOOLEAN DEFAULT 0,
  "allowOfflineReading" BOOLEAN DEFAULT 0,
  "createdAt" DATETIME NOT NULL,
  "updatedAt" DATETIME NOT NULL
);

-- =====================================================
-- 11. SUBSCRIPTIONS TABLE (N:1 with Users, N:1 with SubscriptionPlans)
-- =====================================================
CREATE TABLE IF NOT EXISTS "Subscriptions" (
  "id" VARCHAR(36) PRIMARY KEY,
  "userId" VARCHAR(36) NOT NULL,
  "planId" VARCHAR(36) NOT NULL,
  "status" VARCHAR(20) DEFAULT 'pending',
  "startDate" DATETIME NOT NULL,
  "endDate" DATETIME NOT NULL,
  "cancelledAt" DATETIME,
  "paymentMethod" VARCHAR(50),
  "paymentId" VARCHAR(255),
  "amount" DECIMAL(10,2) NOT NULL,
  "currency" VARCHAR(3) DEFAULT 'USD',
  "autoRenew" BOOLEAN DEFAULT 1,
  "nextBillingDate" DATETIME,
  "isTrial" BOOLEAN DEFAULT 0,
  "trialEndsAt" DATETIME,
  "cancellationReason" VARCHAR(100),
  "notes" TEXT,
  "createdAt" DATETIME NOT NULL,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("planId") REFERENCES "SubscriptionPlans" ("id") ON DELETE CASCADE
);

-- =====================================================
-- 12. BREAKINGNEWS TABLE (N:1 with Users, N:1 with Articles, N:1 with Categories)
-- =====================================================
CREATE TABLE IF NOT EXISTS "BreakingNews" (
  "id" VARCHAR(36) PRIMARY KEY,
  "title" VARCHAR(200) NOT NULL,
  "content" TEXT NOT NULL,
  "articleId" VARCHAR(36),
  "priority" VARCHAR(20) DEFAULT 'medium',
  "categoryId" VARCHAR(36),
  "location" VARCHAR(100),
  "expiresAt" DATETIME,
  "isActive" BOOLEAN DEFAULT 1,
  "pushNotification" BOOLEAN DEFAULT 0,
  "pushTitle" VARCHAR(100),
  "pushBody" TEXT,
  "viewCount" INTEGER DEFAULT 0,
  "clickCount" INTEGER DEFAULT 0,
  "createdBy" VARCHAR(36) NOT NULL,
  "createdAt" DATETIME NOT NULL,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("articleId") REFERENCES "Articles" ("id") ON DELETE SET NULL,
  FOREIGN KEY ("categoryId") REFERENCES "Categories" ("id") ON DELETE SET NULL,
  FOREIGN KEY ("createdBy") REFERENCES "Users" ("id") ON DELETE CASCADE
);

-- =====================================================
-- 13. POLLS TABLE (N:1 with Users, N:1 with Categories)
-- =====================================================
CREATE TABLE IF NOT EXISTS "Polls" (
  "id" VARCHAR(36) PRIMARY KEY,
  "question" VARCHAR(200) NOT NULL,
  "description" TEXT,
  "options" TEXT NOT NULL,
  "categoryId" VARCHAR(36),
  "isActive" BOOLEAN DEFAULT 1,
  "isPublic" BOOLEAN DEFAULT 1,
  "allowMultipleVotes" BOOLEAN DEFAULT 0,
  "requireLogin" BOOLEAN DEFAULT 0,
  "startDate" DATETIME NOT NULL,
  "endDate" DATETIME,
  "totalVotes" INTEGER DEFAULT 0,
  "uniqueVoters" INTEGER DEFAULT 0,
  "createdBy" VARCHAR(36) NOT NULL,
  "showResults" BOOLEAN DEFAULT 1,
  "showResultsAfterVote" BOOLEAN DEFAULT 1,
  "createdAt" DATETIME NOT NULL,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("categoryId") REFERENCES "Categories" ("id") ON DELETE SET NULL,
  FOREIGN KEY ("createdBy") REFERENCES "Users" ("id") ON DELETE CASCADE
);

-- =====================================================
-- 14. POLLVOTES TABLE (N:1 with Polls, N:1 with Users)
-- =====================================================
CREATE TABLE IF NOT EXISTS "PollVotes" (
  "id" VARCHAR(36) PRIMARY KEY,
  "pollId" VARCHAR(36) NOT NULL,
  "userId" VARCHAR(36),
  "optionIndex" INTEGER NOT NULL,
  "sessionId" VARCHAR(255),
  "ipAddress" VARCHAR(45),
  "userAgent" VARCHAR(255),
  "votedAt" DATETIME NOT NULL,
  "createdAt" DATETIME NOT NULL,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("pollId") REFERENCES "Polls" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE
);

-- =====================================================
-- 15. MEDIAGALLERY TABLE (N:1 with Users, N:1 with Articles, N:1 with Categories)
-- =====================================================
CREATE TABLE IF NOT EXISTS "MediaGallery" (
  "id" VARCHAR(36) PRIMARY KEY,
  "title" VARCHAR(200) NOT NULL,
  "description" TEXT,
  "type" VARCHAR(20) DEFAULT 'image',
  "url" VARCHAR(255) NOT NULL,
  "thumbnailUrl" VARCHAR(255),
  "fileName" VARCHAR(255) NOT NULL,
  "fileSize" INTEGER,
  "mimeType" VARCHAR(100),
  "width" INTEGER,
  "height" INTEGER,
  "duration" INTEGER,
  "photographer" VARCHAR(100),
  "caption" TEXT,
  "credits" TEXT,
  "source" VARCHAR(100),
  "license" VARCHAR(100),
  "articleId" VARCHAR(36),
  "uploadedBy" VARCHAR(36) NOT NULL,
  "isPublic" BOOLEAN DEFAULT 1,
  "isFeatured" BOOLEAN DEFAULT 0,
  "tags" TEXT,
  "categoryId" VARCHAR(36),
  "viewCount" INTEGER DEFAULT 0,
  "downloadCount" INTEGER DEFAULT 0,
  "createdAt" DATETIME NOT NULL,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("articleId") REFERENCES "Articles" ("id") ON DELETE SET NULL,
  FOREIGN KEY ("uploadedBy") REFERENCES "Users" ("id") ON DELETE CASCADE,
  FOREIGN KEY ("categoryId") REFERENCES "Categories" ("id") ON DELETE SET NULL
);

-- =====================================================
-- 16. NOTIFICATIONS TABLE (N:1 with Users)
-- =====================================================
CREATE TABLE IF NOT EXISTS "Notifications" (
  "id" VARCHAR(36) PRIMARY KEY,
  "userId" VARCHAR(36) NOT NULL,
  "type" VARCHAR(50) NOT NULL,
  "title" VARCHAR(200) NOT NULL,
  "message" TEXT NOT NULL,
  "relatedId" VARCHAR(36),
  "relatedType" VARCHAR(50),
  "data" TEXT,
  "isRead" BOOLEAN DEFAULT 0,
  "isSent" BOOLEAN DEFAULT 0,
  "readAt" DATETIME,
  "sentAt" DATETIME,
  "priority" VARCHAR(20) DEFAULT 'normal',
  "emailSent" BOOLEAN DEFAULT 0,
  "pushSent" BOOLEAN DEFAULT 0,
  "smsSent" BOOLEAN DEFAULT 0,
  "createdAt" DATETIME NOT NULL,
  "updatedAt" DATETIME NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "Users" ("id") ON DELETE CASCADE
);

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================

-- Articles indexes
CREATE INDEX IF NOT EXISTS "idx_articles_category" ON "Articles" ("categoryId");
CREATE INDEX IF NOT EXISTS "idx_articles_status" ON "Articles" ("status");
CREATE INDEX IF NOT EXISTS "idx_articles_published" ON "Articles" ("publishedAt");
CREATE INDEX IF NOT EXISTS "idx_articles_trending" ON "Articles" ("isTrending");
CREATE INDEX IF NOT EXISTS "idx_articles_breaking" ON "Articles" ("isBreaking");
CREATE INDEX IF NOT EXISTS "idx_articles_premium" ON "Articles" ("isPremium");
CREATE INDEX IF NOT EXISTS "idx_articles_slug" ON "Articles" ("slug");

-- Comments indexes
CREATE INDEX IF NOT EXISTS "idx_comments_article" ON "Comments" ("articleId");
CREATE INDEX IF NOT EXISTS "idx_comments_user" ON "Comments" ("userId");
CREATE INDEX IF NOT EXISTS "idx_comments_status" ON "Comments" ("status");
CREATE INDEX IF NOT EXISTS "idx_comments_parent" ON "Comments" ("parentId");

-- Bookmarks indexes
CREATE INDEX IF NOT EXISTS "idx_bookmarks_user" ON "Bookmarks" ("userId");
CREATE INDEX IF NOT EXISTS "idx_bookmarks_article" ON "Bookmarks" ("articleId");
CREATE INDEX IF NOT EXISTS "idx_bookmarks_collection" ON "Bookmarks" ("collectionId");

-- ReadingHistory indexes
CREATE INDEX IF NOT EXISTS "idx_reading_history_user" ON "ReadingHistory" ("userId");
CREATE INDEX IF NOT EXISTS "idx_reading_history_article" ON "ReadingHistory" ("articleId");
CREATE INDEX IF NOT EXISTS "idx_reading_history_date" ON "ReadingHistory" ("readAt");

-- Subscriptions indexes
CREATE INDEX IF NOT EXISTS "idx_subscriptions_user" ON "Subscriptions" ("userId");
CREATE INDEX IF NOT EXISTS "idx_subscriptions_status" ON "Subscriptions" ("status");
CREATE INDEX IF NOT EXISTS "idx_subscriptions_plan" ON "Subscriptions" ("planId");

-- BreakingNews indexes
CREATE INDEX IF NOT EXISTS "idx_breaking_news_active" ON "BreakingNews" ("isActive");
CREATE INDEX IF NOT EXISTS "idx_breaking_news_priority" ON "BreakingNews" ("priority");
CREATE INDEX IF NOT EXISTS "idx_breaking_news_category" ON "BreakingNews" ("categoryId");

-- Polls indexes
CREATE INDEX IF NOT EXISTS "idx_polls_active" ON "Polls" ("isActive");
CREATE INDEX IF NOT EXISTS "idx_polls_category" ON "Polls" ("categoryId");
CREATE INDEX IF NOT EXISTS "idx_poll_votes_poll" ON "PollVotes" ("pollId");
CREATE INDEX IF NOT EXISTS "idx_poll_votes_user" ON "PollVotes" ("userId");

-- Notifications indexes
CREATE INDEX IF NOT EXISTS "idx_notifications_user" ON "Notifications" ("userId");
CREATE INDEX IF NOT EXISTS "idx_notifications_read" ON "Notifications" ("isRead");
CREATE INDEX IF NOT EXISTS "idx_notifications_type" ON "Notifications" ("type");

-- Users indexes
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "Users" ("email");
CREATE INDEX IF NOT EXISTS "idx_users_username" ON "Users" ("username");
CREATE INDEX IF NOT EXISTS "idx_users_active" ON "Users" ("isActive");

-- Categories indexes
CREATE INDEX IF NOT EXISTS "idx_categories_slug" ON "Categories" ("slug");
CREATE INDEX IF NOT EXISTS "idx_categories_parent" ON "Categories" ("parentId");
CREATE INDEX IF NOT EXISTS "idx_categories_active" ON "Categories" ("isActive");

-- Authors indexes
CREATE INDEX IF NOT EXISTS "idx_authors_user" ON "Authors" ("userId");
CREATE INDEX IF NOT EXISTS "idx_authors_penname" ON "Authors" ("penName");
CREATE INDEX IF NOT EXISTS "idx_authors_verified" ON "Authors" ("isVerified");

-- =====================================================
-- RELATIONSHIP SUMMARY
-- =====================================================
/*
KEY RELATIONSHIPS:

1. Users (1) → Authors (1) - One user can be one author
2. Users (1) → Articles (N) - One user can create many articles
3. Categories (1) → Articles (N) - One category can have many articles
4. Articles (N) ↔ Authors (N) - Many-to-many via ArticleAuthors
5. Users (1) → Comments (N) - One user can post many comments
6. Articles (1) → Comments (N) - One article can have many comments
7. Comments (1) → Comments (N) - Self-referencing for nested replies
8. Users (1) → Bookmarks (N) - One user can bookmark many articles
9. Users (1) → BookmarkCollections (N) - One user can have many collections
10. Users (1) → ReadingHistory (N) - One user can have many reading records
11. Users (1) → Subscriptions (N) - One user can have many subscriptions
12. SubscriptionPlans (1) → Subscriptions (N) - One plan can have many subscriptions
13. Users (1) → BreakingNews (N) - One user can create many breaking news
14. Users (1) → Polls (N) - One user can create many polls
15. Users (1) → PollVotes (N) - One user can vote on many polls
16. Users (1) → MediaGallery (N) - One user can upload many media files
17. Users (1) → Notifications (N) - One user can have many notifications
18. Categories (1) → Categories (N) - Self-referencing for subcategories

SELF-REFERENCING RELATIONSHIPS:
- Categories.parentId → Categories.id (for subcategories)
- Comments.parentId → Comments.id (for nested replies)

UNIQUE CONSTRAINTS:
- Users.email (unique)
- Users.username (unique)
- Users.googleId (unique)
- Users.facebookId (unique)
- Categories.name (unique)
- Categories.slug (unique)
- Authors.penName (unique)
- Articles.slug (unique)
- SubscriptionPlans.slug (unique)
- ArticleAuthors.articleId + authorId (unique)
- Bookmarks.userId + articleId (unique)
- PollVotes.pollId + userId (unique, when userId is not null)
- PollVotes.pollId + sessionId (unique, when sessionId is not null)
*/

-- =====================================================
-- SAMPLE DATA INSERTS (Optional - for testing)
-- =====================================================

-- Insert sample subscription plans
INSERT OR IGNORE INTO "SubscriptionPlans" ("id", "name", "slug", "description", "price", "duration", "features", "isActive", "sortOrder") VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Free Plan', 'free', 'Basic access to news articles', 0.00, 0, '["Basic articles", "Limited bookmarks", "Comments"]', 1, 1),
('550e8400-e29b-41d4-a716-446655440002', 'Basic Plan', 'basic', 'Enhanced reading experience', 9.99, 30, '["All articles", "Unlimited bookmarks", "Ad-free reading", "Comments"]', 1, 2),
('550e8400-e29b-41d4-a716-446655440003', 'Premium Plan', 'premium', 'Complete news experience with premium content', 19.99, 30, '["All articles", "Premium content", "Unlimited bookmarks", "Ad-free", "Offline reading", "Priority support"]', 1, 3);

-- Insert sample categories
INSERT OR IGNORE INTO "Categories" ("id", "name", "slug", "description", "color", "icon", "sortOrder", "isActive") VALUES
('550e8400-e29b-41d4-a716-446655440010', 'Technology', 'technology', 'Latest technology news and updates', '#007bff', 'laptop', 1, 1),
('550e8400-e29b-41d4-a716-446655440011', 'Politics', 'politics', 'Political news and analysis', '#dc3545', 'flag', 2, 1),
('550e8400-e29b-41d4-a716-446655440012', 'Business', 'business', 'Business and economic news', '#28a745', 'briefcase', 3, 1),
('550e8400-e29b-41d4-a716-446655440013', 'Sports', 'sports', 'Sports news and updates', '#ffc107', 'trophy', 4, 1),
('550e8400-e29b-41d4-a716-446655440014', 'Entertainment', 'entertainment', 'Entertainment and celebrity news', '#e83e8c', 'star', 5, 1),
('550e8400-e29b-41d4-a716-446655440015', 'Health', 'health', 'Health and wellness news', '#17a2b8', 'heart', 6, 1);

-- =====================================================
-- END OF ER DIAGRAM
-- ===================================================== 