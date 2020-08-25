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
    message.reply(["https://tenor.com/view/shinya-laugh-anime-gif-11580441","https://tenor.com/view/sasuke-sasuke-laugh-sasuke-react-naruto-anime-react-gif-17940593","https://tenor.com/view/eriko-princess-connect-re-dive-anime-laugh-gif-17341266","https://tenor.com/view/chuckle-giggle-laugh-anime-boy-gif-17768541"][Math.floor(Math.random()*4)]);
  }
  if (command == "kitty") {
    message.reply(["https://tenor.com/view/cute-kitty-best-kitty-alex-cute-pp-kitty-omg-yay-cute-kitty-munchkin-kitten-gif-15917800","https://tenor.com/view/hello-hi-cute-kitten-cat-gif-14881975","https://tenor.com/view/kittens-cats-cute-gif-10978982","https://tenor.com/view/kitten-gif-9102344","https://tenor.com/view/kitten-gif-7660902","https://tenor.com/view/kittens-cute-cat-pet-cheeks-gif-16382546","https://tenor.com/view/sweet-sleep-love-kitties-hug-gif-12304006"][Math.floor(Math.random()*7)]);
  }
  
  if (command == "puppy") {
    message.reply(["https://tenor.com/view/swing-puppies-gif-10865180","https://tenor.com/view/cute-cat-dog-puppy-gif-9847428","https://tenor.com/view/please-doggy-cute-puppy-gif-6206352","https://tenor.com/view/read-book-sleepy-boring-sleep-gif-13660152","https://tenor.com/view/dog-tounge-puppy-golden-retriever-gif-7275200","https://tenor.com/view/puppy-bellyrub-husky-gif-11753153","https://tenor.com/view/dog-puppy-struggling-bowl-gif-3953506","https://tenor.com/view/funny-animals-puppy-cute-animals-dogs-cuddle-gif-11740020","https://tenor.com/view/dogs-puppies-cute-chill-gif-8475096"][Math.floor(Math.random()*9)]);
  }
  if (command == "scales") {
    message.reply(["https://tenor.com/view/snake-hiss-crawling-gif-14744345","https://tenor.com/view/surprise-cereal-snake-wasnt-expecting-that-gif-4846480","https://tenor.com/view/snake-gentleman-hatehat-cute-tongue-gif-12731748","https://tenor.com/view/yassssnake-yas-snake-yass-gif-12932110","https://tenor.com/view/snakes-animal-hiss-gif-17893457","https://tenor.com/view/hiss-tiny-aww-aw-awe-gif-3960725","https://tenor.com/view/tiny-snake-going-in-circle-ring-cute-animals-gif-16117912","https://tenor.com/view/cute-snake-jawn-good-morning-wake-up-gif-17002140","https://tenor.com/view/cute-boop-snake-gif-5440100","https://tenor.com/view/spider-meme-snake-funny-cute-gif-13398395","https://tenor.com/view/snake-adorable-gif-8228527"][Math.floor(Math.random()*12)]);
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
    message.reply("Check your direct messages to see how you can verify yourself!")
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
  if (command == "warnings") {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Only admins can use that command!")
    let mentionedUser = message.mentions.users.first()
    if (mentionedUser) {
       message.channel.send({"embed": {
        "title": mentionedUser.username + "'s Warnings:",
        "description": "**Previous Warnings:**\n" + userData[mentionedUser.id].warnings.join("\n")
      }})
    } else {
      message.channel.send({"embed": {
        "title": "Your Warnings:",
        "description": "**Previous Warnings:**\n" + userData[sender.id].warnings.join("\n")
      }})
    }
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
        "description": "Reason: " + args.slice(1).join(" ") + "\n\n**Previous Warnings:**\n" + userData[user.id].warnings.join("\n")
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
  if (command == "help")
  message.channel.send({
    "embed": {
      "title": "**Sockyy Commands **",
      "color": 10038562,
      "thumbnail": {
        "url": "https://ibb.co/VJpzYHH"
      },
      "fields": [
        {
          "name": config.prefix + "Hi!",
          "value": "Have Sockyy say hello! (Say sock hi)"
        },
        {
          "name": config.prefix + "Laugh",
          "value": "Makes socky send a laughing gif (Say sock laugh)"
        },
        {
          "name": config.prefix + "You're gay",
          "value": "Have sockyy tell you about how he feels when you say that (say sock you;re gay)"
        },
        {
          "name": config.prefix + "Frick you",
          "value": "Have sockyy tell you off for cursing (say sock fuck you)"
        },
        {
          "name": config.prefix + "Goodnight!",
          "value": "Have socky wish you sweet dreams (sock goodnight)"
        },
        {
          "name": config.prefix + "Ask for a hug!",
          "value": "Have sockyy give you a hug (Say sock can i have a hug?)"
        },
        {
          "name": config.prefix + "Who's amazing?",
          "value": "Have sockyy tell you who are the 2 most amazing people (sock who are the most amazing people in the world?)"
        },
        {
          "name": config.prefix + "Kittens!",
          "value": "Have sockyy send you beautiful gifs of kittens! (Say sock kitty)"
        },
        {
          "name": config.prefix + "Puppies!",
          "value": "Have sockyy send you beautiful gifs of Puppies! (Say sock puppy)"
        },
        {
          "name": config.prefix + "scales",
          "value": "Have sockyy send you beautiful gifs of Snakes! (Say sock scales)"
        }
      ]
    }
  })
});                                      
client.login(process.env.TOKEN)
