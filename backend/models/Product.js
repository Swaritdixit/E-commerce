const mongoose=require('mongoose');
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
            },
    description:{
          type:String,
          required:true
    } ,
    price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true,
        min:0
    } ,
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true
    },
    images:[{
        url:{type:String,
            required:true
        },
        publicId:{type:String,
            required:true
        }
    }     ]
},
{
    timestamps:true
});
module.exports=mongoose.model('Product',productSchema);