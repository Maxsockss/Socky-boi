const Discord = require("discord.js");
const config = require("./config.json");
const fs = require('fs');
const client = new Discord.Client();
const express = require("express")
const app = express()
app.get("/", (req, res) => {
  res.sendStatus(200)
})

app.listen(process.env.PORT || 3000, () => {
  console.log("Website is now hosting for Sock bot. :)")
})

var userData = JSON.parse(fs.readFileSync('userData.json'));
var serverInfo = JSON.parse(fs.readFileSync('serverInfo.json'));
client.on("ready", () => {
  console.log("Bot has started!");
})
const Filter = require("bad-words")
client.on("message", message => { 
  if (message.author.bot) return;
  const sender = message.author;
  if (!userData[sender.id]) {
    userData[sender.id] = {
      warnings : []
    }
  }
  if (!serverInfo[message.guild.id]) {
    serverInfo[message.guild.id] = {
      adminChannel: undefined,
      staffRole:undefined
    }
  }
  fs.writeFile('userData.json', JSON.stringify(userData), (err) => {
    if (err) console.error(err);
  })
  fs.writeFile('serverInfo.json', JSON.stringify(serverInfo), (err) => {
    if (err) console.error(err);
  })
  const filter = new Filter()
  filter.removeWords("shit", "damn", "ass", "fuck", "crap")
  
  if (filter.isProfane(message.content)) {
    if (!serverInfo[message.guild.id].adminChannel) return;
    let targetChannel = message.guild.channels.cache.find(channel => channel.id == serverInfo[message.guild.id].adminChannel);
    targetChannel.send({"embed": {
      "title": "Bad Word Detected!",
      "description":message.author.username + " said " + message.content + ". Warn them if you must."
    }})
    message.reply("Your message has been deleted and is being audited by staff.")
    message.delete()
  }
  if(message.content.toLowerCase().indexOf(config.prefix.toLowerCase()) !== 0) return;  
  var args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  var command = args.shift().toLowerCase();       
  if (command == "hi") {
    message.reply("Hello!");
  }
  if (command == "laugh") {
    message.reply(["https://tenor.com/view/shinya-laugh-anime-gif-11580441","https://tenor.com/view/sasuke-sasuke-laugh-sasuke-react-naruto-anime-react-gif-17940593","https://tenor.com/view/eriko-princess-connect-re-dive-anime-laugh-gif-17341266","https://tenor.com/view/chuckle-giggle-laugh-anime-boy-gif-17768541"][Math.floor(Math.random()*3)]);
  }
  if (message.content.slice(config.prefix.length).trim() == "you're gay") {
    message.channel.send("I Know")
  }
  if (message.content.slice(config.prefix.length).trim() == "fuck you") {
    message.author.send("Please don't curse :pleading_face: :point_right: :point_left:")
  }
  if (command == "goodnight") {
    message.reply("Goodnight, Sleep well!");
  }
  if (message.content.slice(config.prefix.length).trim() == "verify me") {
    message.author.send("Greetings and salutations, welcome to the server! In order to be verified please read through the sections visible to you, select the roles that apply, then say Sock finished to continue with the verification!")
  }
  if (command == "finished") {
    if (!serverInfo[message.guild.id].adminChannel) return message.reply("The admin channel has not been set yet!");
    if (!serverInfo[message.guild.id].staffRole) return message.reply("The staff ping has not been set yet!")
    let targetChannel = message.guild.channels.cache.find(channel => channel.id == serverInfo[message.guild.id].adminChannel);
    targetChannel.send(serverInfo[message.guild.id].staffRole + " " + message.author.username + " is ready to be verified!")
  }
  if (message.content.slice(config.prefix.length).trim() == "can i have a hug?") {
    message.channel.send (["Of course! Free hugs for all! https://tenor.com/view/milk-and-mocha-hug-cute-kawaii-love-gif-12535134","https://tenor.com/view/hug-anime-love-gif-7324587","https://tenor.com/view/hug-darker-than-black-anime-gif-13976210","https://tenor.com/view/seraph-love-hug-hugging-anime-gif-4900166"][Math.floor(Math.random()*4)]);
  }
  if (message.content.slice(config.prefix.length).trim() == "who are the most amazing people in the world?") {
    message.channel.send ("Selenium and Whispxr! https://tenor.com/view/cute-hearts-wholesome-gif-9246757 ")
  }
  if (command == "warn") {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Only admins can use that command!")
    let user = client.users.cache.find(user => user.username == args[0]);
    if (message.mentions.users.first()) {
        user = message.mentions.users.first()
    }
    if (user) {
      userData[user.id].warnings.push(args.slice(1).join(" ") === "" ? "No reason specified." : args.slice(1).join(" "))
      message.channel.send({"embed": {
        "title": user.username + " was warned.",
        "description": "Reason: " + args.slice(1).join(" ") + "\n**Previous Warnings:**\n" + userData[user.id].warnings.join("\n")
      }})
    } else {
       return message.reply("I couldn't find any user!")
    }
  }
  if (command == "null") {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Only admins can use that command!")
    let user = message.mentions.users.first()
    if (!user) return message.reply("Couldn't find the specified user!")
    userData[user.id].warnings = []
    message.reply("Successfully removed all warnings from " + user.username + "!")
  }
  if (command == "log"){
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Only admins can use that command!")
    serverInfo[message.guild.id].adminChannel = message.channel.id
    message.reply("Successfully set admin channel to " + message.channel.name + "!")
  } 
  if (command == "sr"){
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Only admins can use that command!")
    if (!args[0]) return message.reply("Please provide a role as your first argument to set the staff role!")
    if (args[0].slice(0, 3) != "<@&" || args[0][args[0].length - 1] != ">") return message.reply("Please input a valid role as your argument!");
    serverInfo[message.guild.id].staffRole = args[0]
    message.reply("Successfully set staff ping to " + args[0] + "!")
  }
});                                      
client.login(process.env.TOKEN)
