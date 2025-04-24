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
  "https://e-com-foodfrontend.onrender.com/"
];

app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin 
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
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
