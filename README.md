# Mak's Store - Admin Dashboard

A premium, high-performance Admin Dashboard built for the "Mak's Store" technical assessment.

## 🚀 Live Demo
Once deployed to GitHub/Vercel, users can access the system using the following demo credentials:
*   **Username**: `emilys`
*   **Password**: `emilyspass`

## 🛠️ Tech Stack
*   **Core**: [Next.js 15+](https://nextjs.org/) (App Router)
*   **UI System**: [Material UI (MUI) v6](https://mui.com/)
*   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
*   **Icons**: [Lucide-React](https://lucide.dev/)
*   **API**: [DummyJSON](https://dummyjson.com/)
*   **Styling**: Vanilla CSS + MUI Emotion

## ✨ Key Features
*   **Secure Authentication**: Fully integrated with DummyJSON Auth API.
*   **Route Protection**: Middleware-based redirection ensuring only logged-in users access the dashboard.
*   **User Management**: Search, filter, and view detailed profiles of users.
*   **Product Catalog**: Responsive grid with category filtering and pagination.
*   **Interactive Carousel**: Custom-built image carousel for product details.
*   **Advanced Caching**: Intelligent Zustand-based caching to reduce API calls and improve performance.
*   **Full Responsiveness**: Optimized for Desktop, Tablet, and Mobile devices.

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/maks-store-admin.git
   cd maks-store-admin
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to see the result.

## 🧠 Architecture Decisions

### Why Zustand?
We chose Zustand over Redux for several reasons:
1. **Zero Boilerplate**: No need for complex actions/reducers/types.
2. **Performance**: Selective subscriptions ensure only components using a specific piece of state re-render.
3. **Small Footprint**: Only ~1KB compared to the much larger Redux bundle.
4. **Native Async**: Handles asynchronous API calls (like authentication and data fetching) seamlessly inside actions.

### Caching Strategy
To provide a "lightning-fast" experience, the dashboard implements a **key-based caching system** in the stores. 
*   Requests are cached using a key generated from current filters and pagination state.
*   If a user navigates back to a previously visited page, the data is served instantly from memory, bypassing the network.

## 🤝 Contributing
This is a technical assessment project. Suggestions and feedback are welcome!
