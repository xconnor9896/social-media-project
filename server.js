//* EXPRESS APP SETUP */
const express = require('express');
const { connectDB } = require('./server/util/connect');
const cloudinary = require('cloudinary').v2;
const fileUpload = require('express-fileupload');

require('dotenv').config();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET
})

const app = require('express')();
const PORT = process.env.PORT || 3000;

//* NEXT APP SETUP */
const next = require('next');
//! Check for development vs. production
const dev = process.env.NODE_ENV !== 'production';
//! There's a giant error warning that pops up when you're in development
const nextApp = next({ dev });
//! This is a built-in next router that'll handle ALL of the request made to the server
const handler = nextApp.getRequestHandler();

//* MIDDLEWARES */ 
app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

//* ~~~~~ ROUTERS ~~~~~*/
const userRoute = require('./server/routes/userRoutes');
const authRoute = require('./server/routes/authRoutes');
const uploadRoute = require('./server/routes/uploadPicRoute');

app.use('/api/v1/user', userRoute);
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/upload', uploadRoute);

connectDB();

nextApp.prepare().then(() => {
  app.all('*', (req, res) => handler(req, res))
  app.listen(PORT, (err) => {
    if (err) console.log(err);
    else console.log(`I'm listening at port ${PORT}!`);
  })
})