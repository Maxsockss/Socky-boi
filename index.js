require("./db/mongoose")
const User = require("./models/user")
const Server = require("./models/server")
const Discord = require("discord.js");
const config = require("./config.json");
const fs = require('fs');
const client = new Discord.Client();
const express = require("express")

// Starting up our website.
const app = express()
app.get("/", async (req, res) => {
  const userInfo = await User.find({})
  res.status(200).send(userInfo.join("\n"))
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
  client.user.setActivity('You are gay', { type: 'PLAYING' });
  console.log("Bot has started!");
})

// Checks if the user has the staff role in the specified server.
async function hasAdministrator(member, guild) {
  if (member.hasPermission("ADMINISTRATOR")) return true
  const selectedServer = await Server.findOne({discordId: guild.id})
  if (!selectedServer.staffRole) {
    return member.hasPermission("ADMINISTRATOR")
  } else {
    let staffRoleId = selectedServer.staffRole.substr(3, selectedServer.staffRole.length - 4)
    if (member.roles.cache.some(role => role.id == staffRoleId)) {
      return true;
    } else {
      return false;
    }
  }
}

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
  
  //Trigger words filter.
  const triggerWords = []
  const hasTriggerWord = triggerWords.some((word) => message.content.toLowerCase().includes(word))
  if (hasTriggerWord){
    const currentServer = await Server.findOne({discordId: message.guild.id})
    if (!currentServer.adminChannel) return
    let targetChannel = message.guild.channels.cache.find(channel => channel.id == currentServer.adminChannel);
    targetChannel.send({"embed": {
    "title": "Bad Word Detected!",
    "description":message.author.username + " said " + message.content + ". Warn them if you must."
     }}) 
     message.delete()
    return message.reply("Please don't say that as it could be triggering, :(  your message is being audited by staff and you may recieve a warning")
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
  
  if (message.content.slice(config.prefix.length).trim() == "can i have a hug?") {
    message.channel.send (["Of course! Free hugs for all! https://tenor.com/view/milk-and-mocha-hug-cute-kawaii-love-gif-12535134","https://tenor.com/view/hug-anime-love-gif-7324587","https://tenor.com/view/hug-darker-than-black-anime-gif-13976210","https://tenor.com/view/seraph-love-hug-hugging-anime-gif-4900166"][Math.floor(Math.random()*4)]);
  }
  if (message.content.slice(config.prefix.length).trim() == "who are the most amazing people in the world?") {
    message.channel.send ("Lillith and Selenium! https://tenor.com/view/cute-hearts-wholesome-gif-9246757 ")
  }
  if (message.content.slice(config.prefix.length).trim() == "gay") {
    message.channel.send (["Gay for days >~< https://tenor.com/view/pride-gay-marriage-lgbt-flag-gif-4314904","He dummy thic https://tenor.com/view/big-ass-sponge-bob-square-pants-lgbt-pride-gif-4998019","Sponge says trans rights https://tenor.com/view/queer-rainbow-hands-rainbow-spongebob-squarepants-squarepants-gif-5896065","I want a pride flag :( https://tenor.com/view/lgbt-community-rainbow-flag-gif-13896550","FEEL THE HOMOSEXUALITY https://tenor.com/view/lgbt-rainbow-shine-beam-light-gif-12010762","Pride puppy https://tenor.com/view/dog-cute-happy-samoyed-puppy-gif-14818829","Sounds gay im in https://tenor.com/view/community-chang-gay-gaaaaay-queer-gif-18064201","ooo RAINBOWS https://tenor.com/view/love-heart-lgbt-rainbow-gif-14797188","Yes sorry to break it to you pal https://tenor.com/view/lgbt-rainbow-pride-gif-12040565","Damn right https://tenor.com/view/lgbt-lol-bitch-gif-11484399"][Math.floor(Math.random()*10)]);
  }
  if (message.content.slice(config.prefix.length).trim() == "hotlines") {
    message.channel.send (["**Trevor project-** https://www.thetrevorproject.org/get-help-now/  **Trans helpline-** https://www.translifeline.org/hotline  **The Befrienders Worldwide member center-** https://www.befrienders.org/  **Suicide hotlines (international)-** http://suicide.org/international-suicide-hotlines.html"]);
  }
  if (command == "warnings") {
    let isAdmin = await hasAdministrator(message.member, message.guild)
    if (!isAdmin) return message.reply("Only admins can use that command!")
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
    let isAdmin = await hasAdministrator(message.member, message.guild)
    if (!isAdmin) return message.reply("Only admins can use that command!")
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
    let isAdmin = await hasAdministrator(message.member, message.guild)
    if (!isAdmin) return message.reply("Only admins can use that command!")
    let user = message.mentions.users.first()
    if (!user) return message.reply("Couldn't find the specified user!")
    const selectedUser = await User.findOne({discordId: user.id})
    selectedUser.warnings = []
    await selectedUser.save()
    message.reply("Successfully removed all warnings from " + user.username + "!")
  }
  if (command == "log"){
    let isAdmin = await hasAdministrator(message.member, message.guild)
    if (!isAdmin) return message.reply("Only admins can use that command!")
    const currentServer = await Server.findOne({discordId: message.guild.id})
    currentServer.adminChannel = message.channel.id
    await currentServer.save()
    message.reply("Successfully set admin channel to " + message.channel.name + "!")
  } 
  if (command == "sr"){
    let isAdmin = await hasAdministrator(message.member, message.guild)
    if (!isAdmin) return message.reply("Only admins can use that command!")
    if (!args[0]) return message.reply("Please provide a role as your first argument to set the staff role!")
    if (args[0].slice(0, 3) != "<@&" || args[0][args[0].length - 1] != ">") return message.reply("Please input a valid role as your argument!");
    let currentServer = await Server.findOne({discordId: message.guild.id})
    currentServer.staffRole = args[0]
    await currentServer.save()
    message.reply("Successfully set staff ping to " + args[0] + "!")
  }
  if(command == "clear") {
    let isAdmin = await hasAdministrator(message.member, message.guild)
    if (!isAdmin) return message.reply("Only admins can use that command!")
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
  if (command === "announce") {
    let isAdmin = await hasAdministrator(message.member, message.guild)
    if (!isAdmin) return message.reply("Only admins can use that command!")
    let count = 0;
    message.guild.members.cache.forEach(member => { 
      if (!member.user.bot) {
        member.user.send(args.join(" ")).catch(error => {
          message.channel.send("Something went wrong while I tried to send " + member.user.username + "a DM");
        }); 
        count++; 
      }
    })
    message.reply("Successfully sent message to " + count + " users!");
  }

  if (command == "help") {
   var category = undefined
   if (args[0]) { 
     category = args[0].trim().toLowerCase();
    }
    const allowedCategories = ["general", "fun", "admin"]
    if (!category || !allowedCategories.includes(category)) {
      message.channel.send({
        "embed": {
          "title": "**Lgbtstripes Commands **",
          "color": 10038562,
          "thumbnail": {
            "url": "https://i.ibb.co/Qd897Py/b4844ea372818413347012c27e194798.jpg"
          },
          "fields": [
            {
              "name": config.prefix + "help general",
              "value": "Have the bot list out the general commands!"
           },
            {
              "name": config.prefix + "help fun",
              "value": "Have the bot list out the fun commands!"
            },
            {
              "name": config.prefix + "help admin",
              "value": "Have bot list out the admin commands!"
            }
          ]
        }
      })
    } else if (category == "general") {
      message.channel.send({
        "embed": {
          "title": "**Lgbtstripes Commands **",
          "color": 10038562,
          "thumbnail": {
            "url": "https://i.ibb.co/Qd897Py/b4844ea372818413347012c27e194798.jpg"
          },
          "fields": [
            {
              "name": "Hi!",
              "value": "Have the bot say hello! **(Say ?hi)**"
            },
            {
              "name": "Laugh",
              "value": "Makes the bot send a laughing gif **(Say ?laugh)**"
            },
            {
              "name": "You're gay",
              "value": "Have the bot tell you about how he feels when you say that **(say ?you're gay)**"
            },
            {
              "name": "Homosexual",
              "value": "Have the bot send you some quality gay **(say ?gay)**"
            },
            {
              "name": "Frick you",
              "value": "Have the bot tell you off for cursing **(say ?fuck you)**"
            },
            {
              "name": "Goodnight!",
              "value": "Have the bot wish you sweet dreams **(Say ?goodnight)**"
            },
            {
              "name": "Ask for a hug!",
              "value": "Have the bot give you a hug **(Say ?can i have a hug?)**"
            },
            {
              "name": "Who's amazing?",
              "value": "Have the bot tell you who are the 2 most amazing people **(?who are the most amazing people in the world?)**"
            }
          ]
        }
      })
    } else if (category == "fun") {
      message.channel.send({
        "embed": {
          "title": "**Lgbtstripes Commands **",
          "color": 10038562,
          "thumbnail": {
            "url": "https://i.ibb.co/Qd897Py/b4844ea372818413347012c27e194798.jpg"
          },
          "fields": [
            {
              "name": "Kittens!",
              "value": "Have the bot send you beautiful gifs of kittens! **(Say ?kitty)**"
            },
            {
              "name": "Puppies!",
              "value": "Have the bot send you beautiful gifs of Puppies! **(Say ?puppy)**"
            },
            {
              "name": "Snek!",
              "value": "Have the bot send you beautiful gifs of Snakes! **(Say ?snek)**"
            },

          ]
        }
      })
    } else if (category == "admin") {
      message.channel.send({
        "embed": {
          "title": "**Lgbtstripes Commands **",
          "color": 10038562,
          "thumbnail": {
            "url": "https://i.ibb.co/Qd897Py/b4844ea372818413347012c27e194798.jpg"
          },
          "fields": [
            {
              "name": "Admin Logs!",
              "value": "Run this command to have the bot log misdemeanors inside a certain channel! **(Say ?log)**"
            },
            {
              "name": "Set Staff Ping!",
              "value": "Run this command (and ping the staff ping) to have the bot ping staff when needed! **(Say ?sr [STAFF PING])**"
            },
            {
              "name": "Give Warnings!",
              "value": "Have the bot warn a user and store it in their warnings! (Say ?warn [USERNAME/PING USER])"
            },
            {
              "name": "List Warnings!",
              "value": "Have the bot list the warnings of a specific user! **(say ?warnings [USERNAME/PING USER])**"
            },
            {
              "name": "Remove Warnings!",
              "value": "Have the bot remove somebody's warnings! **(say ?null [USERNAME/PING USER])**"
            },
            {
              "name": "Announcement",
              "value": "Have the bot send all the members an announcement to their dms **(say ?announce [message])**"
            },
            {
              "name": "Clear Messages!",
              "value": "Have the bot delete some messages in the chat! **(say ?clear [1-99])**"
            },
            {
              "name": "Support hotlines!",
              "value": "Have the bot send some different hotlines **(say ?hotlines)**"
            }
          ]
        }
      })
    }
  }
}); 
                             
client.login(process.env.TOKEN)
