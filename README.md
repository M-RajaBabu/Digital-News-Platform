# Digital News Platform

[![Build Status](https://github.com/M-RajaBabu/Digital-News-Platform/actions/workflows/ci.yml/badge.svg)](https://github.com/M-RajaBabu/Digital-News-Platform/actions)
[![Last Commit](https://img.shields.io/github/last-commit/M-RajaBabu/Digital-News-Platform)](https://github.com/M-RajaBabu/Digital-News-Platform/commits/master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A complete backend API for a Digital News Platform similar to Times of India, built with Node.js, Express.js, and SQLite.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with social login (Google)
- **News Management**: Articles, categories, authors, and content management
- **User Engagement**: Comments, bookmarks, reading history, and polls
- **Personalization**: AI-powered news feed algorithm and recommendations
- **Subscription System**: Multiple subscription tiers with premium content
- **Real-time Features**: Breaking news and push notifications
- **Search & Discovery**: Advanced search with filters and trending calculation
- **Moderation**: Comment moderation with profanity filtering
- **Analytics**: View tracking, engagement metrics, and user behavior analysis

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- SQLite3

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Digital-News-Platfrom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your-super-secret-jwt-key
   DB_PATH=./database/news_platform.db
   ```

4. **Database setup**
   ```bash
   # Create database and tables
   npm run db:migrate
   
   # Seed with sample data
   npm run db:seed
   ```

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Social Login (Google)
```http
POST /api/auth/social-login
Content-Type: application/json

{
  "idToken": "google-id-token"
}
```

### News Endpoints

#### Get Personalized Feed
```http
GET /api/news/feed?page=1&limit=10
Authorization: Bearer <token>
```

#### Get Trending News
```http
GET /api/news/trending?timeWindow=24h&limit=10
```

#### Get Breaking News
```http
GET /api/news/breaking
```

### Articles Endpoints

#### Get All Articles
```http
GET /api/articles?page=1&limit=10&category=uuid&author=uuid
```

#### Get Article by ID
```http
GET /api/articles/:id
```

#### Create Article (Authenticated)
```http
POST /api/articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Article Title",
  "content": "Article content...",
  "categoryId": "category-uuid",
  "summary": "Article summary",
  "tags": ["tag1", "tag2"]
}
```

#### Update Article (Authenticated)
```http
PUT /api/articles/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

#### Track Article View
```http
POST /api/articles/:id/view
```

### Comments Endpoints

#### Get Article Comments
```http
GET /api/articles/:id/comments
```

#### Post Comment (Authenticated)
```http
POST /api/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "articleId": "article-uuid",
  "content": "Comment content",
  "parentId": "parent-comment-uuid" // Optional for replies
}
```

#### Vote on Comment (Authenticated)
```http
POST /api/comments/:id/vote
Authorization: Bearer <token>
Content-Type: application/json

{
  "vote": "up" // or "down"
}
```

### Categories Endpoints

#### Get All Categories
```http
GET /api/categories
```

#### Get Articles by Category
```http
GET /api/categories/:id/articles?page=1&limit=10
```

### Bookmarks Endpoints

#### Get User Bookmarks (Authenticated)
```http
GET /api/bookmarks
Authorization: Bearer <token>
```

#### Add Bookmark (Authenticated)
```http
POST /api/bookmarks
Authorization: Bearer <token>
Content-Type: application/json

{
  "articleId": "article-uuid",
  "collectionId": "collection-uuid", // Optional
  "notes": "Personal notes"
}
```

#### Remove Bookmark (Authenticated)
```http
DELETE /api/bookmarks/:id
Authorization: Bearer <token>
```

### Authors Endpoints

#### Get Author Profile
```http
GET /api/authors/:id
```

#### Get Author's Articles
```http
GET /api/authors/:id/articles?page=1&limit=10
```

#### Follow Author (Authenticated)
```http
POST /api/authors/:id/follow
Authorization: Bearer <token>
```

### User Endpoints

#### Get User Preferences (Authenticated)
```http
GET /api/users/preferences
Authorization: Bearer <token>
```

#### Update User Preferences (Authenticated)
```http
PUT /api/users/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "categories": ["category-uuid1", "category-uuid2"],
  "authors": ["author-uuid1"],
  "language": "en",
  "emailNotifications": true,
  "pushNotifications": true
}
```

#### Get Reading History (Authenticated)
```http
GET /api/users/history?page=1&limit=10
Authorization: Bearer <token>
```

### Subscription Endpoints

#### Get Subscription Plans
```http
GET /api/subscriptions/plans
```

#### Subscribe to Plan (Authenticated)
```http
POST /api/subscriptions/subscribe
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": "plan-uuid",
  "paymentMethod": "stripe",
  "autoRenew": true
}
```

#### Get Subscription Status (Authenticated)
```http
GET /api/subscriptions/status
Authorization: Bearer <token>
```

### Polls Endpoints

#### Get Active Polls
```http
GET /api/polls/active?limit=10
```

#### Vote on Poll (Authenticated)
```http
POST /api/polls/:id/vote
Authorization: Bearer <token>
Content-Type: application/json

{
  "optionIndex": 0
}
```

### Notifications Endpoints

#### Update Notification Settings (Authenticated)
```http
PUT /api/notifications/settings
Authorization: Bearer <token>
Content-Type: application/json

{
  "emailNotifications": true,
  "pushNotifications": true,
  "smsNotifications": false
}
```

#### Register Device for Push (Authenticated)
```http
POST /api/notifications/register-device
Authorization: Bearer <token>
Content-Type: application/json

{
  "deviceToken": "fcm-device-token",
  "platform": "ios" // or "android"
}
```

## 🗄️ Database Schema

The application uses SQLite with the following main entities:

- **Users**: User accounts and preferences
- **Authors**: Journalists and content creators
- **Categories**: News categories and subcategories
- **Articles**: News articles with metadata
- **Comments**: User comments with moderation
- **Bookmarks**: Saved articles and collections
- **ReadingHistory**: User reading behavior tracking
- **Subscriptions**: Subscription plans and user subscriptions
- **BreakingNews**: Urgent news alerts
- **Polls**: Interactive polls and surveys
- **MediaGallery**: Photos and videos with metadata
- **Notifications**: User notifications and settings

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `DB_PATH` | SQLite database path | ./database/news_platform.db |
| `JWT_SECRET` | JWT signing secret | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | 7d |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `RATE_LIMIT_WINDOW_MS` | Rate limiting window | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

### Database Configuration

The application uses Sequelize ORM with SQLite. Database files are stored in the `database/` directory.

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
   ```bash
   NODE_ENV=production
   JWT_SECRET=your-production-secret
   DB_PATH=/path/to/production/database.db
   ```

2. **Database Migration**
   ```bash
   npm run db:migrate
   ```

3. **Start Production Server**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📊 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "data": {...},
  "message": "Success message",
  "status": 200
}
```

### Error Response
```json
{
  "error": "Error message",
  "message": "Detailed error description",
  "status": 400,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/endpoint"
}
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting on API endpoints
- Input validation and sanitization
- SQL injection prevention
- XSS protection with helmet
- CORS configuration

## 📈 Performance Features

- Database indexing for fast queries
- Pagination for large datasets
- Caching strategies (Redis ready)
- Optimized database queries
- Rate limiting to prevent abuse

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### v1.0.0
- Initial release
- Complete news platform backend
- Authentication and authorization
- Article management system
- User engagement features
- Subscription system
- Search and personalization 

## ⚠️ Windows Setup Note
If you are on Windows, run setup commands one at a time (not with &&):

```
cp env.example .env
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

## ✅ Pre-Push Checklist
- [ ] Only one server instance running (no EADDRINUSE error on port 3000)
- [ ] `.env` is **NOT** committed (only `env.example` is in git)
- [ ] `node_modules/` is **NOT** committed (should be in `.gitignore`)
- [ ] All endpoints tested with the provided Postman collection
- [ ] README is up to date
- [ ] Database is seeded and API is working at http://localhost:3000

## 🚀 Ready to Push
If all boxes are checked, you are ready to push your project to GitHub! 