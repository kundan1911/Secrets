//this import's the dotenv which is responsible to import the environmental variable from the .env file into this server side logic
require("dotenv").config();
//establish server
const express=require("express")
// templating page which have dynamic section with fixed structure and design
const ejs=require("ejs");
// to extract the post user info from the received request
const bodyParser = require("body-parser");
// this is the driver which communicates with the database
const mongoose=require("mongoose")
// encrypts the field of the user via a secret key
const encrypt=require("mongoose-encryption")
// set our app
const app=express();
// make the ejs the view engine for rendering pages
app.set("view engine","ejs")
//along with server files also host our custom file to provide other features
app.use(express.static("public"))
// since we need to extract form data from the request
app.use(bodyParser.urlencoded({extended:true}))

// connect to the local server area and create our required database part
// mongoose.connect("mongodb://localhost:27017/userDB")

mongoose.connect("mongodb+srv://admin-kundan:Kundan%4019@cluster0.0qyqn.mongodb.net/SecretDB?retryWrites=true&w=majority");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});
// the structure that is to be follwed for 
const userSchema=new mongoose.Schema({
    email:String,
    password:String
})
const secret=process.env.SECRET
userSchema.plugin(encrypt,{secret:secret,encryptedFields:['password']})
const User=new mongoose.model("user",userSchema);
app.get("/",function(req,res){
    res.render("home")
})
app.get("/login",function(req,res){
    res.render("login")
})

app.get("/register",function(req,res){
 res.render("register")
})
app.post("/login",function(req,res){
    
    User.find({email:req.body.username},function(err,user){
        
        if(user[0]){
            if(user[0].password===req.body.password){
                res.render("secrets")
            }
        }
        
    })
})
app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password,
        checkaside:"is possible"
    })
    newUser.save(function(err){
        if(!err){
            console.log("added the user")
        }
        else{
            console.log(err)
        }
        res.redirect("/login")
        })
})
app.listen(3000,function(){
    console.log("server is listening")
})