import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from "./routes/userRoute.js"
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import 'dotenv/config'
// app config
const app=express()
const port=process.env.PORT || 4000;

//middleware
app.use(express.json())
const allowedOrigins = [
  "https://e-com-fooddel.onrender.com",
  "https://e-com-foodfrontend.onrender.com",
  "http://localhost:5174"
  "https://fog-liard.vercel.app" 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));




//api endpoints 
app.use("/api/food",foodRouter)
app.use("/images",express.static("uploads"))
app.use("/api/user",userRouter)
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRouter);

// db connection
connectDB();
app.get("/",(req,res)=>{
  res.send("API WORKING")
})

app.listen(port,()=>{
    console.log(`Server started on http://localhost:${port}`);

})
