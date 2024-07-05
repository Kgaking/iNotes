const mongoose=require('mongoose');
const mongoURI="mongodb://localhost:27017/inotes";

const connectToMongo=async()=>{
    try {
        await mongoose.connect(mongoURI);
        console.log('Connection Successful!!');
    } catch (error) {
        console.error("error");
        process.exit(0);
    }
}
module.exports = connectToMongo;