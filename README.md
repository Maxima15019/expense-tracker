# ExpenseFlow - Premium Personal Expense Tracker

ExpenseFlow is a modern, premium web application designed to help individuals track their spending habits, analyze monthly expenses, and take control of their financial health. 

Built with a stunning dark-mode aesthetic, micro-animations, and full-stack architecture, it offers a seamless and responsive user experience.

---

## 🚀 Key Features

- **🔐 Secure Authentication**: JWT-based user registration and login with front-end auth guards.
- **📊 Interactive Analytics Dashboard**: Real-time spending breakdowns with category-wise charts, monthly progress indicators, and balance summaries.
- **💸 Expense Management**: Add, update, delete, and filter transactions.
- **🔍 Advanced Search & Filters**: Search by descriptions, filter by category/date range, and sort by date or amount.
- **💾 Auto-Running In-Memory Fallback**: If you don't have MongoDB configured or running locally, the server automatically spins up a temporary in-memory database (`mongodb-memory-server`) so you can run, register, and test the app immediately without any setup!
- **⚡ Responsive UI**: Fully responsive layouts optimized for mobile, tablet, and desktop screens.

---

## 🛠️ Tech Stack

### Frontend
- **React (v19)**: Component-based UI framework.
- **Vite**: Rapid frontend bundler.
- **Tailwind CSS**: Modern styling utility.
- **Framer Motion**: Smooth page transitions and interactive micro-animations.
- **Lucide React**: Clean vector icons.
- **Chart.js & React-ChartJS-2**: Interactive data visualizations.

### Backend
- **Node.js & Express**: Backend API service.
- **MongoDB & Mongoose**: Database mapping and schemas.
- **BcryptJS**: Secure password hashing.
- **JSONWebToken (JWT)**: Stateless user authentication.
- **MongoDB Memory Server**: Fast and isolated in-memory DB fallback for developers.

---

## ⚙️ Project Structure

```
expense-tracker/
├── client/          # Vite + React Frontend
├── server/          # Express Node Backend
└── README.md        # Project Documentation
```

---

## 🏁 How to Run the App

Follow these simple steps to run the application locally.

### Step 1: Clone and install dependencies
First, install the packages for both the client and server.

**For the Backend:**
```bash
cd server
npm install
```

**For the Frontend:**
```bash
cd ../client
npm install
```

### Step 2: Configure Environment Variables
A `.env` file should be located in the `server/` directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://expense-tracker:<db_password>@myproject.9rdipwl.mongodb.net/expenseflow?retryWrites=true&w=majority&appName=MyProject
JWT_SECRET=supersecretjwtkeyforexpenseflowapp12345
NODE_ENV=development
```

> [!NOTE]
> - **MongoDB Cloud:** Replace `<db_password>` on line 6 of `server/.env` with your actual Atlas cluster password.
> - **MongoDB Local:** If you have MongoDB installed locally, comment out the Atlas URI and uncomment the local connection string (`mongodb://127.0.0.1:27017/expenseflow`).
> - **No Setup Needed (Fallback):** If you run the server as-is with the placeholder password, the backend will **automatically** start a temporary in-memory database. Perfect for fast testing!

### Step 3: Run the Servers

Start both servers in development mode:

**Start Backend Server (from the `server/` folder):**
```bash
npm run dev
```

**Start Frontend Server (from the `client/` folder):**
```bash
npm run dev
```

The frontend will run on [http://localhost:5173](http://localhost:5173) and the backend will run on [http://localhost:5000](http://localhost:5000).

---

## 🛡️ Security Best Practices
- **No Committed Credentials**: The `.gitignore` files are configured at both the root and client levels to ensure your `.env` files (containing database passwords and JWT secrets) and `node_modules` are never committed to your Git history.
