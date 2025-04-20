import mongoose from 'mongoose';


const connectDB = async () => {
   
        await mongoose.connect('mongodb+srv://food-delivery:food@food.pozf0ei.mongodb.net/food_delivery', {

            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB Connected");

}


export default connectDB;
