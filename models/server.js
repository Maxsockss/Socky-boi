const mongoose = require("mongoose")

const serverSchema = mongoose.Schema({
    discordId: {
      type: Number,
      required: true
    },
    adminChannel: {
      type: Number
    },
    staffRole: {
      type: String
    }
})

const serverModel = mongoose.model("Server", serverSchema)

module.exports = serverModel