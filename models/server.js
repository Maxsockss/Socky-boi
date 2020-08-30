const mongoose = require("mongoose")

const serverSchema = mongoose.Schema({
    discordId: {
      type: Number,
      required: true
    },
    adminChannel: {
      type: Number,
      required: true
    },
    staffPrefix: {
      type: Number,
      required: true
    }
})

const serverModel = mongoose.model("Server", serverSchema)

module.exports = serverModel