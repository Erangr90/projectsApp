const mongoose = require('mongoose')

const commentSchema = mongoose.Schema({
    description:{
        type:String,
        required:[true, "Comment description is required"]
    },
    image:{
        type:String,
    },

},{
    timestamps: true
})

module.exports =  mongoose.model('Comment',commentSchema)