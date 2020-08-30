const mongoose = require("mongoose")

const serverSchema = mongoose.Schema({
    discordId: {
      type: Number,
      required: true
    },
    adminChannel: {
      type: Number
    },
    staffPrefix: {
      type: String
    }
})

const serverModel = mongoose.model("Server", serverSchema)

module.exports = serverModel