import { connectDb } from "./db/db.js";
import { app } from "./app.js";





connectDb().then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Server Listening on port :", process.env.PORT);
    })

}).catch(()=>{
    console.log("Error While Listening The Port")
})
