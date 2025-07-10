import mongoose from 'mongoose'

export const connectDB  = async () => {
     try{
          const conn = await mongoose.connect(process.env.DATABASE_URL)
          console.log(`MongoDB connected at ${conn.connection.host}`)
     }catch(err){
          console.error("Failed to connect to DB: ",err)
          process.exit(1)
     }
}