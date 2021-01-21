require("./db/mongoose")
const User = require("./models/user")
const Server = require("./models/server")
const Discord = require("discord.js");
const config = require("./config.json");
const fs = require('fs');
const client = new Discord.Client();
const express = require("express")
const path = require("path")

// Starting up our website.
const app = express()
app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"))
});
app.get("/password", async (req, res) => {
  if (req.query.entry === process.env.PASSWORD) {
    const userInfo = await User.find({})
    let userString = ""
    userInfo.forEach((user) => {
        if (user.username != undefined) {
          userString += `<strong>${user.username}</strong> (${user.discordId}) joined at ${user.joinDate}<br><strong>Warnings: </strong>`
          let warnings = ""
          user.warnings.forEach((w) => {
            warnings += w.warning + ", "
          })
          userString += `${(warnings == "") ? "None" : warnings.substr(0, warnings.length - 2)}<br><br>`
        }
    })
    res.status(200).send(userString)
  }
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
  client.user.setActivity('Robot more like roBITCH', { type: 'PLAYING' });
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
    message.reply(["https://tenor.com/view/cute-kitty-best-kitty-alex-cute-pp-kitty-omg-yay-cute-kitty-munchkin-kitten-gif-15917800","https://tenor.com/view/hello-hi-cute-kitten-cat-gif-14881975","https://tenor.com/view/kittens-cats-cute-gif-10978982","https://tenor.com/view/kitten-gif-9102344","https://tenor.com/view/kitten-gif-7660902","https://tenor.com/view/kittens-cute-cat-pet-cheeks-gif-16382546","https://tenor.com/view/sweet-sleep-love-kitties-hug-gif-12304006","https://tenor.com/view/good-night-cuddle-cuddle-love-you-sweetheart-gif-19393403","https://tenor.com/view/cat-navidad-gif-19414881","https://tenor.com/view/cat-surprise-what-cats-cats-of-the-internet-gif-19423109","https://tenor.com/view/pokemon-kittie-cute-pokemon-go-gif-5852119"][Math.floor(Math.random()*11)]);
  }
  
  if (command == "puppy") {
    message.reply(["https://tenor.com/view/swing-puppies-gif-10865180","https://tenor.com/view/cute-cat-dog-puppy-gif-9847428","https://tenor.com/view/please-doggy-cute-puppy-gif-6206352","https://tenor.com/view/read-book-sleepy-boring-sleep-gif-13660152","https://tenor.com/view/dog-tounge-puppy-golden-retriever-gif-7275200","https://tenor.com/view/puppy-bellyrub-husky-gif-11753153","https://tenor.com/view/dog-puppy-struggling-bowl-gif-3953506","https://tenor.com/view/funny-animals-puppy-cute-animals-dogs-cuddle-gif-11740020","https://tenor.com/view/dogs-puppies-cute-chill-gif-8475096","https://tenor.com/view/shy-smile-blushing-hehe-shiba-gif-16163577","https://tenor.com/view/funny-corgi-lol-moment-tongue-out-dog-cute-gif-16140567"][Math.floor(Math.random()*11)]);
  }
  if (command == "snek") {
    message.reply(["https://tenor.com/view/snake-hiss-crawling-gif-14744345","https://tenor.com/view/surprise-cereal-snake-wasnt-expecting-that-gif-4846480","https://tenor.com/view/snake-gentleman-hatehat-cute-tongue-gif-12731748","https://tenor.com/view/yassssnake-yas-snake-yass-gif-12932110","https://tenor.com/view/snakes-animal-hiss-gif-17893457","https://tenor.com/view/hiss-tiny-aww-aw-awe-gif-3960725","https://tenor.com/view/tiny-snake-going-in-circle-ring-cute-animals-gif-16117912","https://tenor.com/view/cute-snake-jawn-good-morning-wake-up-gif-17002140","https://tenor.com/view/cute-boop-snake-gif-5440100","https://tenor.com/view/spider-meme-snake-funny-cute-gif-13398395","https://tenor.com/view/snake-adorable-gif-8228527","https://tenor.com/view/snakes-animal-hiss-gif-17893457","https://tenor.com/view/cat-snake-shook-shocked-scared-gif-12070275","https://tenor.com/view/snake-hand-gif-6199080","https://tenor.com/view/get-off-me-spongebob-spongebob-squarepants-ahh-scream-gif-18462295","https://tenor.com/view/cats-snakes-cat-snake-tail-gif-11138102","https://tenor.com/view/rotating-snake-confused-snake-snek-cute-snakes-pet-snakes-gif-13806464","https://tenor.com/view/top-hat-snakes-ritz-mustache-gif-3519672","https://tenor.com/view/snaking-climbing-sneaking-up-the-tree-snakes-gif-13777951","https://tenor.com/view/la-gata-serpientes-con-bracitos-serpiente-animal-snakes-with-arms-gif-16444494"][Math.floor(Math.random()*22)]);
  }
  if (message.content.slice(config.prefix.length).trim() == "frog") {
    message.channel.send (["https://tenor.com/view/hendery-way-v-frog-gif-14537187","https://tenor.com/view/frog-animated-tease-gif-11398429","https://tenor.com/view/chillin-gif-10127369","https://tenor.com/view/frog-fat-caress-animal-gif-17015097","https://tenor.com/view/rain-sticker-rainy-precipitation-frog-gif-12899597","https://tenor.com/view/frog-gif-19288492","https://tenor.com/view/put-hat-on-frog-viralhog-frog-wears-hat-frog-gif-19436312","https://tenor.com/view/frog-detective-walking-amphibian-gif-19679307","https://tenor.com/view/frog-dispenser-gif-19457954","https://tenor.com/view/frog-2020-water-this-is-fine-gif-19662045","https://tenor.com/view/froge-gif-18656581","https://tenor.com/view/dance-frog-gif-17776815"][Math.floor(Math.random()*12)]);
  }
  if (message.content.slice(config.prefix.length).trim() == "rat") {
    message.channel.send (["https://tenor.com/view/rat-post-this-rat-rats-rat-dance-bouncing-rat-gif-16831053","https://tenor.com/view/rat-banner-gif-18467093","https://tenor.com/view/rat-stealing-pizza-jumping-gif-18609834","https://tenor.com/view/rat-bathing-rat-taking-abath-rat-in-sink-rodent-gif-18309165","https://tenor.com/view/rat-shower-god-cute-gif-18332281","https://tenor.com/view/trickortreat-candy-mouse-halloween-gif-4582381","https://tenor.com/view/rat-trumpet-glitch-musical-intrument-gif-17146530","https://tenor.com/view/happy-year-of-the-happy-rat-pet-rat-cute-adorable-belly-rub-gif-16192760","https://tenor.com/view/rat-petting-gif-10511968","https://tenor.com/view/rats-queen-rat-queen-princess-rat-gif-4882771","https://tenor.com/view/rat-eating-spaghetti-cute-gif-11451413","https://tenor.com/view/rat-gif-10942909"][Math.floor(Math.random()*12)]);
  }
  if (message.content.slice(config.prefix.length).trim() == "you're gay") {
    message.channel.send("I Know","No you")
  }
  if (message.content.slice(config.prefix.length).trim() == "fuck you") {
    message.author.send (["Please dont curse :pleading_face: :point_right: :point_left","No no FUCK YOU","excuse me?"][Math.floor(Math.random()*3)]);
    console.log(Math.random()*3)
  }
  if (message.content.slice(config.prefix.length).trim() == "gn") {
    message.channel.send(["Goodnight, Sleep well! https://tenor.com/search/sleep-gifs","Goodnight! https://tenor.com/view/patrick-sleeping-bed-spongebob-gif-7518157","Sweet dreams! https://tenor.com/view/tonton-friends-sleep-gif-14535339 "," Im tired too https://tenor.com/view/peachcat-pillow-bedtime-goodnight-sleep-with-you-gif-14541089 "][Math.floor(Math.random()*5)]);
  }
  
  if (message.content.slice(config.prefix.length).trim() == "hug") {
    message.channel.send (["Free hugs for all! https://tenor.com/view/milk-and-mocha-hug-cute-kawaii-love-gif-12535134","Free hugs for all! https://tenor.com/view/hug-anime-love-gif-7324587","Free hugs for all! https://tenor.com/view/hug-darker-than-black-anime-gif-13976210","Free hugs for all! https://tenor.com/view/seraph-love-hug-hugging-anime-gif-4900166","Thats pretty gay. https://tenor.com/view/smh-shake-my-head-cat-no-nope-gif-4864386"][Math.floor(Math.random()*5)]);
  }

  if (message.content.slice(config.prefix.length).trim() == "gay") {
    message.channel.send (["Gay for days >~< https://tenor.com/view/pride-gay-marriage-lgbt-flag-gif-4314904","https://tenor.com/view/really-what-gif-19132749","He dummy thic https://tenor.com/view/big-ass-sponge-bob-square-pants-lgbt-pride-gif-4998019","Sponge says trans rights https://tenor.com/view/queer-rainbow-hands-rainbow-spongebob-squarepants-squarepants-gif-5896065","I want a pride flag :( https://tenor.com/view/lgbt-community-rainbow-flag-gif-13896550","FEEL THE HOMOSEXUALITY https://tenor.com/view/lgbt-rainbow-shine-beam-light-gif-12010762","Pride puppy https://tenor.com/view/dog-cute-happy-samoyed-puppy-gif-14818829","Sounds gay im in https://tenor.com/view/community-chang-gay-gaaaaay-queer-gif-18064201","ooo RAINBOWS https://tenor.com/view/love-heart-lgbt-rainbow-gif-14797188","Yes sorry to break it to you pal https://tenor.com/view/lgbt-rainbow-pride-gif-12040565","Damn right https://tenor.com/view/lgbt-lol-bitch-gif-11484399"][Math.floor(Math.random()*11)]);
  }
  if (message.content.slice(config.prefix.length).trim() == "gts") {
    message.channel.send (["Get your ass to sleep","What are you doing up?","Sleep or no hugs","Sleep now."][Math.floor(Math.random()*4)]);
  }
  if (message.content.slice(config.prefix.length).trim() == "weeb") {
    message.channel.send (["https://tenor.com/view/excited-kirishima-mha-bnha-gif-19438290","https://tenor.com/view/bokunoheroacademia-midoriya-izuku-deku-gif-9214816","https://tenor.com/view/anime-my-hero-academia-serious-gif-12997052","https://tenor.com/view/sailor-moon-suit-old-man-peace-sign-sailor-scout-anime-gif-14298094","https://tenor.com/view/anime-love-cute-smile-gif-15836771","https://tenor.com/view/anime-anime-glasses-stare-glasses-gif-15313333","SIMP https://tenor.com/view/anime-gif-18634855","https://tenor.com/view/yawn-tired-anime-gif-9525859","https://tenor.com/view/trash-disappointed-no-sad-bye-gif-5005980","https://tenor.com/view/okay-yay-anime-gif-9672741","https://tenor.com/view/anime-dance-girl-animedance-gif-7560548","https://tenor.com/view/anime-logic-fly-gif-4880117","https://tenor.com/view/my-little-monster-anime-when-your-mom-tries-to-take-pictures-of-you-family-funny-gif-11802984","https://tenor.com/view/naegi-nagito-hajime-hope-hopesquad-gif-10646324","https://tenor.com/view/danganrompa-monokuma-punishment-anime-execution-gif-17163417","https://tenor.com/view/anime-anime-glasses-stare-glasses-gif-15313333","https://tenor.com/view/anime-gif-18634855","https://tenor.com/view/bokuno-hero-academia-izuku-midoriya-deku-happy-gif-12815749","https://tenor.com/view/cute-anime-cat-dancing-happy-gif-8413959","https://tenor.com/view/boku-no-hero-academia-gif-19160786","https://tenor.com/view/todoroki-boku-no-hero-academia-surprised-todoroki-surprised-boku-no-hero-academia4-gif-18870354","https://tenor.com/view/keigo-takami-boku-no-hero-academia-me-hero-academia-hawks-gif-18362794","https://tenor.com/view/eijiro-otaku-talking-my-hero-academia-boku-no-hero-academia-gif-17920601","https://tenor.com/view/boku-no-hero-academia-anime-sleep-gif-10138904","https://tenor.com/view/todoroki-shoto-todoroki-boku-no-hero-academia-gif-19232615","https://tenor.com/view/todoroki-gif-8850537","https://tenor.com/view/hawks-bnha-hero-keigo-takami-gif-19616942","https://tenor.com/view/hawks-keigo-takami-73181520-gif-18124433","https://tenor.com/view/anime-blackbutler-sebastian-bow-gif-8578229","https://tenor.com/view/heart-undertaker-book-of-atlantic-gif-10900091","https://tenor.com/view/blackbutler-kuroshitsuji-cielphantomhive-sebastianmichaelis-huh-gif-9703590","https://tenor.com/view/black-butler-ciel-smile-wink-anime-gif-6202171","https://tenor.com/view/black-butler-gif-5122288","https://tenor.com/view/anime-sebastian-black-butler-book-of-atlantic-smile-gif-13097197","https://tenor.com/view/black-butler-fabulous-anime-open-door-red-hair-gif-17584872","https://tenor.com/view/black-butler-uwuq-gif-18101923","https://tenor.com/view/black-butler-sebastian-ciel-go-away-bye-gif-15951532","https://tenor.com/view/ciel-black-butler-gif-15301530","https://tenor.com/view/ciel-phantom-hive-black-butler-gif-11102758"][Math.floor(Math.random()*30)]);
  }
  ///Lost the game///
  if (command == "g") {
    message.delete();
    message.channel.send("You have all lost the game MWAHAHAHAHAHAHAH!");
  }



  //Moderator exposing

  if (message.content.slice(config.prefix.length).trim() == "emax") {
    message.channel.send (["https://ibb.co/9nSzs1W","https://ibb.co/G7vR9q9","https://ibb.co/jhzWM3H","https://ibb.co/sqb64mX","https://ibb.co/1m76GCx","https://ibb.co/vdjgz5N"][Math.floor(Math.random()*6)]);
  }

  if (message.content.slice(config.prefix.length).trim() == "elil") {
    message.channel.send (["https://ibb.co/68mLvvg","https://ibb.co/kSM0z5N","https://ibb.co/M2f9nj6","https://ibb.co/MM9tcmS","https://ibb.co/D9V86XQ","https://ibb.co/McpK4Gk","https://ibb.co/5hxZS7q","https://ibb.co/fMjWqqp","https://ibb.co/0YGCLX2","https://ibb.co/Dt0VtBZ"][Math.floor(Math.random()*10)]);
  }
    
  if (message.content.slice(config.prefix.length).trim() == "ecin") {
    message.channel.send (["https://ibb.co/4sY5TfB","https://ibb.co/8XGXx1Q","https://ibb.co/DCppKC6","https://ibb.co/v32WkmF","https://ibb.co/NY22mWV","https://ibb.co/cvWN3FJ","https://ibb.co/qmGZ0p3","https://ibb.co/7gWV0N3","https://ibb.co/9r6mR8z","https://ibb.co/Q7wVKHJ","https://ibb.co/xqjysMp","https://ibb.co/kD4Y8xx","https://ibb.co/4P3nkt5" ][Math.floor(Math.random()*13
    )]);
  }

  if (message.content.slice(config.prefix.length).trim() == "ejasper") {
    message.channel.send (["https://ibb.co/sbtyjGC","https://ibb.co/rfxFvGR","https://ibb.co/MRdy3TL","https://ibb.co/h8RdZQv","https://ibb.co/Ss2223j","https://ibb.co/g392Djv"][Math.floor(Math.random()*6
    )]);
  }
  if (message.content.slice(config.prefix.length).trim() == "echan") {
    message.channel.send (["https://ibb.co/MG7CR2D","https://ibb.co/Z6WgFbb","https://ibb.co/M89zmNB","https://ibb.co/CvVv6SQ"][Math.floor(Math.random()*4
    )]);
  } 
  if (message.content.slice(config.prefix.length).trim() == "eketchup") {
    message.channel.send (["https://ibb.co/B6X5DbD","https://ibb.co/PcFPr8F","https://ibb.co/9yDb1Fq","https://ibb.co/8XVBwqZ"][Math.floor(Math.random()*4
    )]);
  } 


//Mod fun commands
  if (message.content.slice(config.prefix.length).trim() == "asparagus") {
    message.channel.send (["https://ibb.co/GvxKX7S","https://ibb.co/0VmcPGk","https://ibb.co/Db2tzSG","https://ibb.co/KNxbP06","https://ibb.co/SdwsZhb"][Math.floor(Math.random()*5)]);
  }
  


//support commands
//hotlines
if (message.content.slice(config.prefix.length).trim() == "ihotlines") {
  message.channel.send({"embed": {  
    "description": "[**Befrienders**](https://www.befrienders.org/) \n [**International Suicide Hotlines**](http://suicide.org/international-suicide-hotlines.html) \n [**DID based hotlines (UK)**](https://www.firstpersonplural.org.uk/) \n [**Suicide Hotlines (UK)**](https://www.therapyroute.com/article/suicide-hotlines-and-crisis-lines-in-the-united-kingdom) \n [**Trans helpline (US AND CAN) **](https://www.translifeline.org/hotline) \n In order to use the hotlines, just click on the one you'd like!" 
  }})
}
if (message.content.slice(config.prefix.length).trim() == "ahotlines") {
  message.channel.send({"embed": {  
    "description": "[**Trevor project**](https://www.thetrevorproject.org/get-help-now/) \n In order to use the hotlines, just click on the one you'd like!" 
  }})
}
if (message.content.slice(config.prefix.length).trim() == "aushotlines") {
  message.channel.send({"embed": {  
    "description": "[**Lifeline Australia**](https://www.lifeline.org.au/) \n [**Beyond Blue**](https://www.beyondblue.org.au/) \n [**Kids helpline**](https://kidshelpline.com.au/) \n [**Headspace**](https://headspace.org.au/eheadspace/) \n In order to use the hotlines, just click on the one you'd like!" 
  }})
}

if (message.content.slice(config.prefix.length).trim() == "inspiring") {
  message.author.send (["Keep your head up, you got this! https://tenor.com/view/smooth-sea-quote-quotes-inspirational-inspiration-gif-17364919","https://tenor.com/view/quote-love-sayings-inspirational-lovequotes-gif-13213754","https://tenor.com/view/deep-dark-darkquotes-deepquotes-gif-14621617","https://tenor.com/view/inspirational-quote-inspirational-dont-lose-hope-hope-stars-come-out-gif-17365896","https://tenor.com/view/aahandfield-drewisme-strong-inspirational-inspirational-quotes-gif-17496352","https://tenor.com/view/you-can-do-anything-inspirational-cracker-gif-11101966"][Math.floor(Math.random()*6)]);
}
    ///check in
    if (command == "checkup") {
      message.channel.send (["How is everyone doing today? Just a reminder if you ever need to rant or talk to anyone our support channels are always open, just head on into one and say the command ?support to chat with someone who can help!","I hope everyone is having a wonderful day! Make sure you are staying hydrated, I'm proud of you. \n if you ever need anyone to talk to, support is always here to chat. "][Math.floor(Math.random()*2)]);
      message.delete();
      console.log
      } 
    if (command == "support") { 
      message.channel.send ("<@&791517216364560424> I'd like some help please. Thank you so much in advance!");
    }
  
///warnings
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

  if (command == "lhelp") {
   var category = undefined
   if (args[0]) { 
     category = args[0].trim().toLowerCase();
    }
    const allowedCategories = ["general", "fun", "admin","support"]
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
              "name": config.prefix + "lhelp general",
              "value": "Have the bot list out the general commands!"
           },
            {
              "name": config.prefix + "lhelp fun",
              "value": "Have the bot list out the fun commands!"
            },
            {
              "name": config.prefix + "lhelp admin",
              "value": "Have bot list out the admin commands!"
            },
            {
              "name": config.prefix + "lhelp support",
              "value": "Have bot list out the support commands!"
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
              "value": "Have the bot wish you sweet dreams **(Say ?gn)**"
            },
            {
              "name": "Ask for a hug!",
              "value": "Have the bot give you a hug **(Say ?hug)**"
            },
            {
              "name": "Who's amazing?",
              "value": "Have the bot tell you who are the 2 most amazing people **(?who are the most amazing people in the world?)**"
            }
          ]
        }
      })
    } else if (category == "support") {
      message.channel.send({
        "embed": {
          "title": "**Lgbtstripes Commands **",
          "color": 10038562,
          "thumbnail": {
            "url": "https://i.ibb.co/Qd897Py/b4844ea372818413347012c27e194798.jpg"
          },
          "fields": [
            {
              "name": "International hotlines!",
              "value": "Have the bot send some different International hotlines **(say ?ihotlines)**"
            },
            {
            "name": "US hotlines!",
            "value": "Have the bot send some different US hotlines **(say ?ahotlines)**"
          },
        
          {
            "name": "Inspiring quotes",
            "value": "Have the bot offer you some words of wisdom **(Say ?inspiring)**"
          },
          {
            "name": "Support Dispatch",
            "value": "Have the bot ping support dispatch **(Say ?support)**"
          },
           
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
            {
              "name": "Go to sleep!",
              "value": "Have the bot tell you to go to sleep **(Say ?gts)**"
            },
            {
              "name": "Weeb",
              "value": "Have the bot send you some quality anime gifs **(Say ?weeb)**"
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

          ]
        }
      })
    }
  }
}); 
                             
client.login(process.env.TOKEN)
