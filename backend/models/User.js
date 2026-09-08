const mongoose=require('mongoose');
const addressSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true
    },
    addressLine1:{
        type:String,
        required:true,
    },
    addressLine2:{
        type:String        
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true,
    },
    postalCode:{
        type:String,
        required:true,
    },
    isDefault:{
        type:Boolean,
        default:false
    }

});
    
const userSchema=new mongoose.Schema({
    
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
   password:{
    type:String,
    required:true,
   },
   role:{
    type:String,
    enum:["Customer","Admin","SuperAdmin"],
    default:"Customer"
   },
   addresses:[addressSchema]

},
   {
    timestamps:true
   },
);


module.exports=mongoose.model("User",userSchema);