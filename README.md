# Buddy Finder - Backend API

A full-stack application built with modern technologies. This project is to improve the social media experience and create an authenic experience for the user

## 🚀 Features

- **User Authentication**
  - Signup and login with JWT tokens
  - Password hashing with bcrypt
  - Secure authentication middleware

- **Posts**
  - Create posts with images and captions
  - View feed (all posts)
  - View posts by specific user
  - Delete posts (owner only)

- **Social Features**
  - Like/unlike posts
  - Comment on posts
  - View comments

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Authentication:** JWT + bcrypt
- **Validation:** Express middleware

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database (or Neon account)

## ⚙️ Installation

1. **Clone the repository**
```bash
   git clone <your-repo-url>
   cd backend
```

2. **Install dependencies**
```bash
   npm install
```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
```env
   DATABASE_URL="postgresql://user:password@host:port/database"
   JWT_SECRET="your-super-secret-jwt-key"
   PORT=5000
```

4. **Set up the database**
```bash
   npx prisma migrate dev --name init
   npx prisma generate
```

5. **Start the development server**
```bash
   npm run dev
```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Authentication

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

#### Log In
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Posts

#### Create Post
```http
POST /api/posts
Authorization: Bearer <token>
Content-Type: application/json

{
  "imageUrl": "https://example.com/image.jpg",
  "caption": "My awesome post!"
}
```

#### Get All Posts
```http
GET /api/posts
Authorization: Bearer <token>
```

#### Get User's Posts
```http
GET /api/posts/user/:userId
Authorization: Bearer <token>
```

#### Delete Post
```http
DELETE /api/posts/:postId
Authorization: Bearer <token>
```

#### Like/Unlike Post
```http
POST /api/posts/:postId/like
Authorization: Bearer <token>
```

#### Comment on Post
```http
POST /api/posts/:postId/comment
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great photo!"
}
```

#### Get Post Comments
```http
GET /api/posts/:postId/comments
Authorization: Bearer <token>
```

## 🗂️ Project Structure
```
backend/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── authController.ts
│   │   └── postController.ts
│   ├── middleware/         # Custom middleware
│   │   └── auth.ts
│   ├── routes/            # API routes
│   │   ├── authRoutes.ts
│   │   └── postRoutes.ts
│   ├── utils/             # Helper functions
│   │   └── jwt.ts
│   └── index.ts           # App entry point
├── .env                   # Environment variables
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key` |
| `PORT` | Server port | `5000` |

## 🧪 Testing

Test the API using curl, Postman, or any HTTP client:
```bash
# Health check
curl http://localhost:5000/api/health

# Sign up
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"password123"}'
```

## 📝 Database Schema

**Users**
- id, username, email, passwordHash, fullName, bio, profilePictureUrl

**Posts**
- id, userId, imageUrl, caption, createdAt

**Likes**
- id, userId, postId, createdAt

**Comments**
- id, userId, postId, content, createdAt

**Follows**
- id, followerId, followingId, createdAt

## 🚧 Roadmap

- [ ] Follow/unfollow functionality
- [ ] User profile endpoints
- [ ] Image upload with Cloudinary
- [ ] Stories feature
- [ ] Direct messaging
- [ ] Notifications
- [ ] Search functionality
- [ ] Pagination
- [ ] Rate limiting

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/jellyfishing2346)
- LinkedIn: [Your Name](https://linkedin.com/in/faizan-khan234)

## 🙏 Acknowledgments

- Built as a project to improve the quality of Instagram
- Inspired by Instagram
- Thanks to the open-source community

---

**Note:** This is a portfolio project and not intended for production use without additional security measures and optimizations.