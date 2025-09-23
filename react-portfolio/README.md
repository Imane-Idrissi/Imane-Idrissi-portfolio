# Imane Idrissi - Full-Stack Developer Portfolio

I believe technology should serve people and create real impact. Complexity alone is never the goal. Beyond coding, I love building lasting skills, like learning strategies that let me tackle anything I need anytime.

## 🌟 Beyond the projects: discover the stories and decisions behind them

**Live portfolio:** [imaneidrissi.com](https://imaneidrissi.com)

---

##  Projects

### CollabApp - Collaborative Task Management Platform

![CollabApp Homepage](public/assets/projects/collab-app/home.webp)

A collaborative platform that combines a Kanban board with a chat app. What makes it different is an AI feature that turns group conversations into actionable tasks that are registered within the task board.

#### Featured Capabilities:

### 🤝 Collaborative Task Editing

<img src="public/assets/projects/collab-app/task-board/edit-modal.webp" alt="Collaborative Task Editing" width="100%" />

Editing tasks simultaneously is inevitable in collaboration: users get locked out or the system can let conflicts occur and then resolve them. I designed a two-layer solution that addresses conflicts at both the human and technical levels.

**Key Benefits:**
- **Real-time coordination** - Floating chat automatically appears when multiple users edit the same task
- **Presence detection** - WebSockets broadcast who's editing what in real-time
- **Conflict resolution** - Optimistic locking with version control for infrastructure-level resolution
- **Human negotiation** - Editors can coordinate: "I'll update the description, you handle assignees"

---

### 🤖 AI-Powered Task Extraction

<img src="public/assets/projects/collab-app/ai-task-extraction.webp" alt="AI-Powered Task Extraction" width="100%" />

Traditional chat apps store conversations. This one transforms them. Our AI analyzes team discussions and automatically suggests actionable tasks with confidence scoring, bridging the gap between communication and project management.

**Key Benefits:**
- **Smart extraction** - AI extracts actionable items from natural conversations
- **Confidence scoring** - Tasks are suggested with confidence scores and AI reasoning
- **Deduplication** - Smart prevention of similar tasks being created
- **One-click creation** - Direct task creation from chat conversations

[View Live Demo](https://imaneidrissi.com/projects/collab-app) | [Documentation](https://imaneidrissi.com/projects/collab-app#chat-app-ai-extraction)

---

### Style App - E-commerce Platform

![Style App Homepage](public/assets/projects/e-commerce/home.webp)

An online store where users can browse women's, men's, and kids' categories with subcategories. Shoppers can select items with the right size and quantity, add them to the cart, and complete their purchase through Stripe payments.

#### Key Features:
- **Multi-category browsing** (Women's, Men's, Kids')
- **Size and quantity selection** for each product
- **Shopping cart management** with real-time updates
- **Secure checkout** with Stripe integration
- **User authentication** with Google OAuth and email/password
- **Order history** for registered users
- **Responsive design** for all devices

[View Live Demo](https://imaneidrissi.com/projects/e-commerce) | [See Case Study](https://imaneidrissi.com/projects#e-commerce)

---

## 🛠️ Tech Stack

### Frontend
- React.js & TypeScript
- Styled Components
- Context API for state management

### Backend
- Node.js & Express.js
- RESTful API architecture
- JWT authentication

### Database & Storage
- MongoDB for data persistence
- Firebase for real-time features
- AWS S3 for media storage

### Integrations
- Stripe API for payments
- Google OAuth for authentication
- Custom AI algorithms for task extraction

### Deployment
- GitHub Pages for portfolio
- AWS (S3, Amplify, Lambda) for applications
- CI/CD with GitHub Actions

---

## 📫 Contact

Looking to bring your digital ideas to life? Let's connect and explore the possibilities!

[Get in Touch](https://imaneidrissi.com/contact)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).