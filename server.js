//* EXPRESS APP SETUP */
const express = require("express");
const { connectDB } = require("./server/util/connect");
const cloudinary = require("cloudinary").v2;
const fileUpload = require("express-fileupload");

require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const app = require("express")();
const PORT = process.env.PORT || 3000;

//* NEXT APP SETUP */
const next = require("next");
//! Check for development vs. production
const dev = process.env.NODE_ENV !== "production";
//! There's a giant error warning that pops up when you're in development
const nextApp = next({ dev });
//! This is a built-in next router that'll handle ALL of the request made to the server
const handler = nextApp.getRequestHandler();

//* MIDDLEWARES */
const { authMiddleware } = require("./server/middleware/auth");

app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

//* ~~~~~ ROUTERS ~~~~~*/
const userRoute = require("./server/routes/userRoutes");
const authRoute = require("./server/routes/authRoutes");
const searchRoute = require("./server/routes/search");
const uploadRoute = require("./server/routes/uploadPicRoute");
const postRoute = require("./server/routes/postRoute");
const profileRoute = require("./server/routes/profile");
const messagesRoute = require("./server/routes/messages");

app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/search", searchRoute);
app.use("/api/v1/uploads", uploadRoute);
app.use("/api/v1/posts", authMiddleware, postRoute);
app.use("/api/v1/profile", authMiddleware, profileRoute);
app.use("/api/v1/messages", authMiddleware, messagesRoute);

//* ~~~~~ SOCKETS ~~~~~ */
// const { Server } = require("socket.io");
// const io = new Server(3001);

// io.on("connect", (socket) => {
//   socket.on("pingServer", (data) => {
//     console.log(data);
//   });
// });

connectDB();

nextApp.prepare().then(() => {
  app.all("*", (req, res) => handler(req, res));
  app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log(`I'm listening at port ${PORT}!`);
  });
});
