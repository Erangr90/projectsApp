const mongoose = require('mongoose')



const projectSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, "Project name is required"]
    },
    address:{
        type:String,
        required:[true,"Project address is required"]
    },
    status:{
        type:String,
        default:"Active"
    },
    endDate:{
        type:String,
        required:[true,"Project end date is required"]

    },
    image:{
        type:String,
    },
    comments:[{type: mongoose.Schema.Types.ObjectId,ref:'Comment'}]
})

module.exports =  mongoose.model('Project',projectSchema)