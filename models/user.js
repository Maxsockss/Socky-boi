const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    discordId: {
    type: Number,
     required: true
    },
    username: {
        type: String,
    },
      joinDate: {
      type: Date, 
      default: new Date()
    },
    warnings: [{
      warning: {
        type: String,
        required: true
      }
    }]
})

const userModel = mongoose.model("User", userSchema)

module.exports = userModel

