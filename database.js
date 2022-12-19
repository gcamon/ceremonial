const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config();

mongoose.connect(process.env.MONGO_URL, 
{
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    //useCreateIndex: true
})
.then(() => console.log("database cluster connected successfully!"))
.catch((err) => console.log(err))
