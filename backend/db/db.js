import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connection = await mongoose.connect(`${process.env.MONGO_URI}`);

    console.log(`mongoDB is connected ${connection.connection.host}`.cyan.underline);
  } 
  catch (error) 
  {
       console.log(`Error Occured during conection btw MongoDB : ${error.message}`.red.bold);
       process.exit()
  }
};


