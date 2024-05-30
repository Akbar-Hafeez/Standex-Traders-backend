import { app } from "./app.js"
import dotenv from "dotenv"
import connectDB from "./db/db.js"


dotenv.config({
    path:"./.env"
})
app.get('/', (req, res) => {
  res.send('Hello akb!')
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT, () => {
        console.log(`Example app listening on port ${process.env.PORT}`)
      })
})
.catch((err)=>{
console.log("Mongodb connection failed!",err)
})