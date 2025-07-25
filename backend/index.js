// // Packages
// import express from "express";
// import cookieParser from "cookie-parser";
// import dotenv from "dotenv";
// import path from "path";

// // Files
// import connectDB from "./config/db.js";
// import userRoutes from "./routes/userRoutes.js";
// import genreRoutes from "./routes/genreRoutes.js";
// import moviesRoutes from "./routes/moviesRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";

// // Configuration
// dotenv.config();
// connectDB();

// const app = express();

// // middlewares
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// const PORT = process.env.PORT || 3000;

// // Routes
// app.use("/api/v1/users", userRoutes);
// app.use("/api/v1/genre", genreRoutes);
// app.use("/api/v1/movies", moviesRoutes);
// app.use("/api/v1/upload", uploadRoutes);

// const __dirname = path.resolve();
// app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

// app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
// Packages
import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

// Files
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import genreRoutes from "./routes/genreRoutes.js";
import moviesRoutes from "./routes/moviesRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Config
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/genre", genreRoutes);
app.use("/api/v1/movies", moviesRoutes);
app.use("/api/v1/upload", uploadRoutes);

// Static files
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// 404 Not Found Handler
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

// 🔴 Global Error Handler (for async errors)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));
