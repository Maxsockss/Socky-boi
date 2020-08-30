require("./db/mongoose")
const User = require("./models/user")
const Server = require("./models/server")
const Discord = require("discord.js");
const config = require("./config.json");
const Filter = require("bad-words")
const fs = require('fs');
const client = new Discord.Client();
const express = require("express")

// Starting up our website.
const app = express()
app.get("/", (req, res) => {
  res.sendStatus(200)
})

// Making our website listen on a PORT.
app.listen(process.env.PORT || 3000, () => {
  console.log("Website is now hosting for Sock bot. :)")
})

// This code runs when the bot joins a new server.
client.on("guildCreate", async guild => {
  let newGuild = new Server({discordId: guild.id})
  await newGuild.save()
});

// This code runs when the bot leaves a server.
client.on("guildDelete", async guild => {
  await Server.findOneAndRemove({discordId: guild.id})
});

// This code runs when a member joins a server.
client.on("guildMemberAdd", async member => {
  let user = member.user
  const newUser = new User({discordId: user.id, username: user.username})
  await newUser.save()
})

// This code runs when a member leaves a server.
client.on("guildMemberRemove", async member => {
  let user = member.user
  await User.findOneAndRemove({discordId: user.id})
})

// This code runs when the bot is ready.
client.on("ready", () => {
  console.log("Bot has started!");
})

// This code runs everytime a user sends a message.
client.on("message", async message => {
  
  // If the user is a bot, we don't run any of our precious code.
  if (message.author.bot) return;
  
  // Get the user in the database. If they don't exist, create them.
  const sender = message.author;
  const dbUser = await User.findOne({discordId: sender.id})
  if (!dbUser) {
    const newUser = new User({discordId: sender.id, username: sender.username})
    await newUser.save()
  }

  // Profanity filter.
  const filter = new Filter()
  filter.removeWords("shit", "damn", "ass", "fuck", "crap","god")
  if (filter.isProfane(message.content)) {
    const currentServer = await Server.findOne({discordId: message.guild.id})
    if (!currentServer.adminChannel) return
    let targetChannel = message.guild.channels.cache.find(channel => channel.id == currentServer.adminChannel);
    targetChannel.send({"embed": {
      "title": "Bad Word Detected!",
      "description":message.author.username + " said " + message.content + ". Warn them if you must."
    }})
    message.reply("Your message has been deleted and is being audited by staff.")
    message.delete()
  }
  
  // If the message doesn't begin with our prefix, we stop the code here.
  if(message.content.toLowerCase().indexOf(config.prefix.toLowerCase()) !== 0) return;  
  
  var args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  var command = args.shift().toLowerCase();       
  
  // A bunch of commands that look for responses.
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
  if (command == "snek") {
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
    const currentServer = await Server.findOne({discordId: message.guild.id})
    if (!currentServer.adminChannel) return message.reply("The admin channel has not been set yet!");
    if (!currentServer.staffRole) return message.reply("The staff ping has not been set yet!")
    let targetChannel = message.guild.channels.cache.find(channel => channel.id == currentServer.adminChannel);
    targetChannel.send(currentServer.staffRole + " " + message.author.username + " is ready to be verified!")
  }
  if (message.content.slice(config.prefix.length).trim() == "can i have a hug?") {
    message.channel.send (["Of course! Free hugs for all! https://tenor.com/view/milk-and-mocha-hug-cute-kawaii-love-gif-12535134","https://tenor.com/view/hug-anime-love-gif-7324587","https://tenor.com/view/hug-darker-than-black-anime-gif-13976210","https://tenor.com/view/seraph-love-hug-hugging-anime-gif-4900166"][Math.floor(Math.random()*4)]);
  }
  if (message.content.slice(config.prefix.length).trim() == "who are the most amazing people in the world?") {
    message.channel.send ("Selenium and Whispxr! https://tenor.com/view/cute-hearts-wholesome-gif-9246757 ")
  }
  if (message.content.slice(config.prefix.length).trim() == "gay") {
    message.channel.send (["Gay for days >~< https://tenor.com/view/pride-gay-marriage-lgbt-flag-gif-4314904","He dummy thic https://tenor.com/view/big-ass-sponge-bob-square-pants-lgbt-pride-gif-4998019","Sponge says trans rights https://tenor.com/view/queer-rainbow-hands-rainbow-spongebob-squarepants-squarepants-gif-5896065","I want a pride flag :( https://tenor.com/view/lgbt-community-rainbow-flag-gif-13896550","FEEL THE HOMOSEXUALITY https://tenor.com/view/lgbt-rainbow-shine-beam-light-gif-12010762","Pride puppy https://tenor.com/view/dog-cute-happy-samoyed-puppy-gif-14818829","Sounds gay im in https://tenor.com/view/community-chang-gay-gaaaaay-queer-gif-18064201","ooo RAINBOWS https://tenor.com/view/love-heart-lgbt-rainbow-gif-14797188","Yes sorry to break it to you pal https://tenor.com/view/lgbt-rainbow-pride-gif-12040565","Damn right https://tenor.com/view/lgbt-lol-bitch-gif-11484399"][Math.floor(Math.random()*10)]);
  }
  if (message.content.slice(config.prefix.length).trim() == "kill") {
    message.channel.send (["I'll grab my crew! https://tenor.com/view/anime-friends-murder-joking-gif-5518806","Your wish is my command. https://tenor.com/view/mirai-nikki-stab-knife-anime-gif-17523920","Will you give me your love? https://tenor.com/view/knife-deku-toga-running-villian-gif-16607516","*giggles* Just playing! https://tenor.com/view/svirmele-stab-abitch-stab-gif-18101784","I'm gonna get a new level for this one! https://tenor.com/view/game-stab-angry-gif-16184039","no.. but how about this instead? https://tenor.com/view/jack-happy-stab-mango-gif-4674767","How it feels to step on a lego https://tenor.com/view/ouch-foot-nails-stab-pain-gif-16718477","You froggedy bitch https://tenor.com/view/aborry-stab-me-frog-gif-14813196","Oh no, not teddy.. https://tenor.com/view/smile-grin-stab-doll-evil-face-gif-16714822","Lets play doll! im the left and you're the right!"][Math.floor(Math.random()*10)]);
  }
  if (command == "warnings") {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Only admins can use that command!")
    let mentionedUser = message.mentions.users.first()
    if (mentionedUser) {
      const selectedUser = await User.findOne({discordId: mentionedUser.id})
       message.channel.send({"embed": {
        "title": mentionedUser.username + "'s Warnings:",
        "description": "**Previous Warnings:**\n" + (selectedUser.warnings.map((warning) => warning.warning).join("\n") || "This user has no previous warnings.")
      }})
    } else {
      const yourUser = await User.findOne({discordId: sender.id})
      message.channel.send({"embed": {
        "title": "Your Warnings:",
        "description": "**Previous Warnings:**\n" + (yourUser.warnings.map((warning) => warning.warning).join("\n") || "This user has no previous warnings.")
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
      let selectedUser = await User.findOne({discordId: user.id})
      selectedUser.warnings.push({
        warning: args.slice(1).join(" ") || "No reason specified."
      })
      await selectedUser.save()
      message.channel.send({"embed": {
        "title": user.username + " was warned.",
        "description": "Reason: " + args.slice(1).join(" ") + "\n\n**Previous Warnings:**\n" + selectedUser.warnings.map((warning) => warning.warning).join("\n")
      }})
    } else {
       return message.reply("I couldn't find any user!")
    }
  }
  if (command == "null") {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Only admins can use that command!")
    let user = message.mentions.users.first()
    if (!user) return message.reply("Couldn't find the specified user!")
    const selectedUser = await User.findOne({discordId: user.id})
    selectedUser.warnings = []
    await selectedUser.save()
    message.reply("Successfully removed all warnings from " + user.username + "!")
  }
  if (command == "log"){
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Only admins can use that command!")
    const currentServer = await Server.findOne({discordId: message.guild.id})
    currentServer.adminChannel = message.channel.id
    await currentServer.save()
    message.reply("Successfully set admin channel to " + message.channel.name + "!")
  } 
  if (command == "sr"){
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Only admins can use that command!")
    if (!args[0]) return message.reply("Please provide a role as your first argument to set the staff role!")
    if (args[0].slice(0, 3) != "<@&" || args[0][args[0].length - 1] != ">") return message.reply("Please input a valid role as your argument!");
    let currentServer = await Server.findOne({discordId: message.guild.id})
    currentServer.staffRole = args[0]
    await currentServer.save()
    message.reply("Successfully set staff ping to " + args[0] + "!")
  }
  if(command == "clear") {
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply("Only admins can use that command!")
      const deleteCount = parseInt(args[0], 10)+1;
      if(!deleteCount || deleteCount < 1 || deleteCount > 100) {
        return message.reply("You can only delete from between 1-99 messages.");
      }
      const fetched = await message.channel.messages.fetch({limit: deleteCount});
      try {
        message.channel.bulkDelete(fetched)
      } catch (error) {message.reply("I couldn't do that because of " + error + "!");

    }
 }
  if (command == "help") {
   var category = undefined
   if (args[0]) { category = args[0].trim().toLowerCase();
  }
    const allowedCategories = ["general", "fun", "admin"]
    if (!category || !allowedCategories.includes(category)) {
      message.channel.send({
        "embed": {
          "title": "**Sockyy Commands **",
          "color": 10038562,
          "thumbnail": {
            "url": "https://ibb.co/VJpzYHH"
          },
          "fields": [
            {
              "name": config.prefix + "help general",
              "value": "Have Sockyy list out the general commands!"
            },
            {
              "name": config.prefix + "help fun",
              "value": "Have Sockyy list out the fun commands!"
            },
            {
              "name": config.prefix + "help admin",
              "value": "Have Sockyy list out the admin commands!"
            }
          ]
        }
      })
    } else if (category == "general") {
      message.channel.send({
        "embed": {
          "title": "**Sockyy Commands **",
          "color": 10038562,
          "thumbnail": {
            "url": "https://ibb.co/VJpzYHH"
          },
          "fields": [
            {
              "name": "Hi!",
              "value": "Have Sockyy say hello! **(Say sock hi)**"
            },
            {
              "name": "Laugh",
              "value": "Makes socky send a laughing gif **(Say sock laugh)**"
            },
            {
              "name": "You're gay",
              "value": "Have sockyy tell you about how he feels when you say that **(say sock you're gay)**"
            },
            {
              "name": "Homosexual",
              "value": "Have Socky send you some quality gay **(say sock gay)**"
            },
            {
              "name": "Frick you",
              "value": "Have sockyy tell you off for cursing **(say sock fuck you)**"
            },
            {
              "name": "Goodnight!",
              "value": "Have socky wish you sweet dreams **(sock goodnight)**"
            },
            {
              "name": "Ask for a hug!",
              "value": "Have sockyy give you a hug **(Say sock can i have a hug?)**"
            },
            {
              "name": "Who's amazing?",
              "value": "Have sockyy tell you who are the 2 most amazing people **(sock who are the most amazing people in the world?)**"
            }
          ]
        }
      })
    } else if (category == "fun") {
      message.channel.send({
        "embed": {
          "title": "**Sockyy Commands **",
          "color": 10038562,
          "thumbnail": {
            "url": "https://ibb.co/VJpzYHH"
          },
          "fields": [
            {
              "name": "Kittens!",
              "value": "Have sockyy send you beautiful gifs of kittens! **(Say sock kitty)**"
            },
            {
              "name": "Puppies!",
              "value": "Have sockyy send you beautiful gifs of Puppies! **(Say sock puppy)**"
            },
            {
              "name": "Snek!",
              "value": "Have sockyy send you beautiful gifs of Snakes! **(Say sock snek)**"
            },
            {
              "name": "Murder",
              "value": "Have Sockyy commit a murder for you! **(Say sock kill)**"
            }
          ]
        }
      })
    } else if (category == "admin") {
      message.channel.send({
        "embed": {
          "title": "**Sockyy Commands **",
          "color": 10038562,
          "thumbnail": {
            "url": "https://ibb.co/VJpzYHH"
          },
          "fields": [
            {
              "name": "Admin Logs!",
              "value": "Run this command to have Sockyy log misdemeanors inside a certain channel! **(Say sock log)**"
            },
            {
              "name": "Set Staff Ping!",
              "value": "Run this command (and ping the staff ping) to have Sockyy ping staff when needed! **(Say sock sr [STAFF PING])**"
            },
            {
              "name": "Give Warnings!",
              "value": "Have Sockyy warn a user and store it in their warnings! (Say sock warn [USERNAME/PING USER])"
            },
            {
              "name": "List Warnings!",
              "value": "Have Sockyy list the warnings of a specific user! **(say sock warnings [USERNAME/PING USER])**"
            },
            {
              "name": "Remove Warnings!",
              "value": "Have Sockyy remove somebody's warnings! **(say sock null [USERNAME/PING USER])**"
            },
            {
              "name": "Clear Messages!",
              "value": "Have Sockyy delete some messages in the chat! **(say sock clear [1-99])**"
            }
          ]
        }
      })
    }
  }
}); 
                             
client.login(process.env.TOKEN)
