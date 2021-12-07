require("./db/mongoose")
const User = require("./models/user")
const Server = require("./models/server")
const Discord = require("discord.js");
const config = require("./config.json");
const fs = require('fs');
const client = new Discord.Client();
const express = require("express")
const path = require("path")
let messagesSent = 0

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
  client.user.setActivity('Game? Lost.', { type: 'PLAYING' });
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
  
  // Increments the variable we created at line 10 by 1
  messagesSent++;
  
  // If the amount of messages sent is divisible by 100 (100, 200, 300...), then we run the code inside
  if (messagesSent % 100 == 0) {
    message.channel.send (["https://tenor.com/view/rickroll-rick-roll-rickastley-spongebob-gif-19367765 \n you also lost the game","https://tenor.com/view/rickroll-rick-roll-gif-18531569","https://tenor.com/view/cute-cat-rick-roll-gif-22622972"][Math.floor(Math.random()*3)]);
  }
    
  // If the message doesn't begin with our prefix, we stop the code here.
  if(message.content.toLowerCase().indexOf(config.prefix.toLowerCase()) !== 0) return;  
  
  var args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  var command = args.shift().toLowerCase();    

  ///Check how long a user has been in a server
  if (command == "info") {
    const username = args.join(" ")
    const data = await User.find({username})
    if (!data) {
      return message.reply("User not found.")
    }
    const seconds = (new Date() - data.joinDate) / 1000
    const days = seconds / 60 / 24
    return message.reply("That user has been on the server for " + days + " days.")
  }
  
  
  // A bunch of commands that send varied gif responses.


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
  if (message.content.slice(config.prefix.length).trim() == "weeb") {
    message.channel.send (["https://tenor.com/view/excited-kirishima-mha-bnha-gif-19438290","https://tenor.com/view/bokunoheroacademia-midoriya-izuku-deku-gif-9214816","https://tenor.com/view/anime-my-hero-academia-serious-gif-12997052","https://tenor.com/view/sailor-moon-suit-old-man-peace-sign-sailor-scout-anime-gif-14298094","https://tenor.com/view/anime-love-cute-smile-gif-15836771","https://tenor.com/view/anime-anime-glasses-stare-glasses-gif-15313333","SIMP https://tenor.com/view/anime-gif-18634855","https://tenor.com/view/yawn-tired-anime-gif-9525859","https://tenor.com/view/trash-disappointed-no-sad-bye-gif-5005980","https://tenor.com/view/okay-yay-anime-gif-9672741","https://tenor.com/view/anime-dance-girl-animedance-gif-7560548","https://tenor.com/view/anime-logic-fly-gif-4880117","https://tenor.com/view/my-little-monster-anime-when-your-mom-tries-to-take-pictures-of-you-family-funny-gif-11802984","https://tenor.com/view/naegi-nagito-hajime-hope-hopesquad-gif-10646324","https://tenor.com/view/danganrompa-monokuma-punishment-anime-execution-gif-17163417","https://tenor.com/view/anime-anime-glasses-stare-glasses-gif-15313333","https://tenor.com/view/anime-gif-18634855","https://tenor.com/view/bokuno-hero-academia-izuku-midoriya-deku-happy-gif-12815749","https://tenor.com/view/cute-anime-cat-dancing-happy-gif-8413959","https://tenor.com/view/boku-no-hero-academia-gif-19160786","https://tenor.com/view/todoroki-boku-no-hero-academia-surprised-todoroki-surprised-boku-no-hero-academia4-gif-18870354","https://tenor.com/view/keigo-takami-boku-no-hero-academia-me-hero-academia-hawks-gif-18362794","https://tenor.com/view/eijiro-otaku-talking-my-hero-academia-boku-no-hero-academia-gif-17920601","https://tenor.com/view/boku-no-hero-academia-anime-sleep-gif-10138904","https://tenor.com/view/todoroki-shoto-todoroki-boku-no-hero-academia-gif-19232615","https://tenor.com/view/todoroki-gif-8850537","https://tenor.com/view/hawks-bnha-hero-keigo-takami-gif-19616942","https://tenor.com/view/hawks-keigo-takami-73181520-gif-18124433","https://tenor.com/view/anime-blackbutler-sebastian-bow-gif-8578229","https://tenor.com/view/heart-undertaker-book-of-atlantic-gif-10900091","https://tenor.com/view/blackbutler-kuroshitsuji-cielphantomhive-sebastianmichaelis-huh-gif-9703590","https://tenor.com/view/black-butler-ciel-smile-wink-anime-gif-6202171","https://tenor.com/view/black-butler-gif-5122288","https://tenor.com/view/anime-sebastian-black-butler-book-of-atlantic-smile-gif-13097197","https://tenor.com/view/black-butler-fabulous-anime-open-door-red-hair-gif-17584872","https://tenor.com/view/black-butler-uwuq-gif-18101923","https://tenor.com/view/black-butler-sebastian-ciel-go-away-bye-gif-15951532","https://tenor.com/view/ciel-black-butler-gif-15301530","https://tenor.com/view/ciel-phantom-hive-black-butler-gif-11102758"][Math.floor(Math.random()*30)]);
  }
  if (message.content.slice(config.prefix.length).trim() == "gn") {
    message.channel.send(["Goodnight, Sleep well! https://tenor.com/search/sleep-gifs","Goodnight! https://tenor.com/view/patrick-sleeping-bed-spongebob-gif-7518157","Sweet dreams! https://tenor.com/view/tonton-friends-sleep-gif-14535339 "," Im tired too https://tenor.com/view/peachcat-pillow-bedtime-goodnight-sleep-with-you-gif-14541089 "][Math.floor(Math.random()*5)]);
  }
  if (message.content.slice(config.prefix.length).trim() == "hug") {
    message.channel.send (["Free hugs for all! https://tenor.com/view/milk-and-mocha-hug-cute-kawaii-love-gif-12535134","Free hugs for all! https://tenor.com/view/hug-anime-love-gif-7324587","Free hugs for all! https://tenor.com/view/hug-darker-than-black-anime-gif-13976210","Free hugs for all! https://tenor.com/view/seraph-love-hug-hugging-anime-gif-4900166","Thats pretty gay. https://tenor.com/view/smh-shake-my-head-cat-no-nope-gif-4864386"][Math.floor(Math.random()*5)]);
  }
  if (message.content.slice(config.prefix.length).trim() == "you're gay") {
    message.channel.send("No you")
  }
  if (message.content.slice(config.prefix.length).trim() == "fuck you") {
    message.author.send (["Please dont curse :pleading_face: :point_right: :point_left: ","No no FUCK YOU","excuse me?"][Math.floor(Math.random()*3)]);
    console.log(Math.random()*3)
  }
  if (message.content.slice(config.prefix.length).trim() == "gay") {
    message.channel.send (["Gay for days >~< https://tenor.com/view/pride-gay-marriage-lgbt-flag-gif-4314904","https://tenor.com/view/really-what-gif-19132749","He dummy thic https://tenor.com/view/big-ass-sponge-bob-square-pants-lgbt-pride-gif-4998019","Sponge says trans rights https://tenor.com/view/queer-rainbow-hands-rainbow-spongebob-squarepants-squarepants-gif-5896065","I want a pride flag :( https://tenor.com/view/lgbt-community-rainbow-flag-gif-13896550","FEEL THE HOMOSEXUALITY https://tenor.com/view/lgbt-rainbow-shine-beam-light-gif-12010762","Pride puppy https://tenor.com/view/dog-cute-happy-samoyed-puppy-gif-14818829","Sounds gay im in https://tenor.com/view/community-chang-gay-gaaaaay-queer-gif-18064201","ooo RAINBOWS https://tenor.com/view/love-heart-lgbt-rainbow-gif-14797188","Yes sorry to break it to you pal https://tenor.com/view/lgbt-rainbow-pride-gif-12040565","Damn right https://tenor.com/view/lgbt-lol-bitch-gif-11484399"][Math.floor(Math.random()*11)]);
  }
  if (message.content.slice(config.prefix.length).trim() == "gts") {
    message.channel.send (["Get your ass to sleep","What are you doing up?","Sleep or no hugs","Sleep now."][Math.floor(Math.random()*4)]);
  }


  //Misc fun commands//
  if (message.content.slice(config.prefix.length).trim() == "g") {
    message.channel.send (["You just lost the game MWAHAHAHAHAHAH","Get rick rolled lololololol (also u lost the game)","Did someone say...GAME..? dang i lost again :("][Math.floor(Math.random()*3)]);
  }
    
  if (command == "jaywantsfuckingvengance") {
    message.channel.send ("You just lost the game MWAHAHAHAHAHAH")
    message.delete();
    console.log
    } 
    if (command == "jaylovesketchupwater") {
      message.channel.send ("https://tenor.com/view/stick-bug-rick-roll-lol-gif-18118062 \n ps. GAEM")
      message.delete();
      console.log
      } 

      if (command == "spam") {
        message.channel.send ("<@678707868769452102>")
      }




  if (command == "hi") {
    message.reply("Hello!");
  }
  if (message.content.slice(config.prefix.length).trim() == "advice") {
    message.channel.send (["Everything not saved will be lost. \n - Nintendo quit screen","Just because you're trash doesn't mean you can't do great things. It's called Garbage Can, not Garbage Cannot.","People say nothing is impossible, but I do nothing every day.","An apple a day keeps anyone away if you throw it hard enough.","Dance like nobody's watching, because they aren't, welcome to gen Z; they're all on their phones.","Knowledge is knowing that a tomato is a fruit; wisdom is not putting it in a fruit salad.","Whenever you think life is boring, just remember we named it Rush hour and all you do is sit still in traffic.","Life is short, so is Levi Ackerman but hes still cool as heck","When nothing goes right, go left.","Whenever you think you can't spell, just look at Max trying to make these commands.","I'm tired of giving advice, could I interest you in a sarcastic comment?","If you're ever sad, just remember.. some people can't see when they close their eyes."][Math.floor(Math.random()*12
    )]);
  } 
  if (message.content.slice(config.prefix.length).trim() == "rq") {
    message.channel.send (["Which would you choose: \n Red pill for invisibility \n Blue pill for teleport","Would you rather live in a water house or a mansion? ","Would you rather use apple products or android products for the rest of your life ","Would you be a ride operator for the biggest dollar coaster in the world? ","Who’s your favorite celebrity","If you could choose one place to eat at where would you choose and why","People or animals ","What’s your favorite color of the pride flag?","Finish the vine “road work ahead...”","Game","Finish the vine “I need a church girl to church...”","If You Had The World’s Attention For 30 Seconds, What Would You Say?","If You Had To Work But Didn’t Need The Money, What Would You Choose To Do?","If You Were Home On A Rainy Sunday Afternoon, What Movie Would You Most Want To See On Television?"," If You Could Dis-Invent One Thing, What Would It Be?","Is There An App That You Hate But Use Anyways?"," What Part Of The Human Face Is Your Favorite?"," Would You Rather Live (Permanently) In A Roller Coaster Park Or In A Zoo?","If You Inherited A Private Jet From A Stranger, What Would You Do With It?","Would You Rather Have Unlimited Sushi For Life Or Unlimited Tacos For Life?","If You Had All The Money In The World, What Would Be The First Thing You’d Buy?","What Are You Most Likely To Become Famous For?","What’s The Best Way To Spend A Rainy Afternoon?","What’s Your Least Favorite Mode Of Transportation?","If You Could Learn Any Language Fluently, What Would It Be?","Is Never Returning Something You Borrowed Considered Stealing? (Asking for a friend)","Favorite Day Of The Week?","If you could replace all of the grass in the world with something else, what would it be?","What movie would be greatly improved if it was made into a musical?","What is something that is really popular now, but in 5 years everyone will look back on and be embarrassed by?","If animals could talk, which would be the rudest?","Which animal do you think would be the most polite?","If you had the power to shrink any one object and carry it with yo in your pocket, which item would it be?","What’s the most ridiculous fact you know?","What’s the best type of cheese?","If the all the States in the USA were represented by food, what food would each state be represented by?","If you would create a holiday, what would it be called and how would we celebrate it? When would this holiday be?","Is a hotdog a sandwich?","What mythical creature would improve the world most if it existed?","How do you feel about putting pineapple on pizza?","Do you fold your pizza when you eat it?","If you had to become an inanimate object for a year, what object would it be?","If you could only eat one food item for the rest of your life, what would it be?","If peanut butter wasn’t called peanut butter, what would it be called?","Toilet paper, over or under?","What fictional character is amazing in their book / show / movie, but would be insufferable if you had to deal with them in mundane everyday situations?","Is cereal soup?","Would you rather sweat melted cheese or have snakes for hair?","What’s the most beautiful place you’ve ever been?","What are your 3 favorite movies?","How would you describe me to your friends?","If you could live in any TV home, what would it be?","If you could eat only 3 foods for the rest of your life, what would they be?","If you could be a cartoon character for a week, who would you be?","If you could be an Olympic athlete, in what sport would you compete?","If you had to live in a different state, what would it be?","What’s your favorite smell in the whole world?","You have lost the game.","Consider yourself rickrolled.","What's the best way of confronting your plumber on how bad of a job they did?","Have you ever had the desire to write your initials in wet cement?","Bicycle or tricycle?","What's the last time you spilled toothpaste on the floor?","If you could travel to any planet, which one would it be?","What would you do if you could walk on water?","Do you enjoy eating paper?","What would you do if 10 rabbits suddenly appeared in your living room?","Would you carry an anvil to the south pole? Why?","What would you do if you grew gills?","What kind of daily activities would become more fun if your best friend was a black hole?","Is it valid to drive on the opposite side of the road in reverse?","Do you own anything that hasn't been invented yet? If so, what is it and how do you make it? (Asking for a friend)"," Would you purposefully cause an avalanche of cheese wheels?","What's the most fun way to violate the laws of thermodynamics?","Would you rather make soap or candles?","What's a random item that could be used as an alternative to flower pots?","What's your go-to computer game?","What's the barrier between something that's conscious and something that's not?","What's your favorite out of the 4 elements?","What's the difference between random noise and music?","Board Games or Card Games?","Video Games or Books?","Physical Books or Digital Books?","Summer or Winter?","Shower or Bath?","Call or Text- nevermind you're all gay i don't even need to ask that","Cake or Pie?","Instagram or Discord?","Pen or Pencil?","Giving or recieving?","Iced Tea or Hot Tea?","Desktop or Laptop?","Jeans or Sweatpants?","Pepsi or Coke?","Tattoos or Piercings?","Reading or Music?","Chicken Nuggets or Hotdogs?","Apple or Android?","Reading or Writing?","Fingerless Gloves or Normal Gloves?","Phone or Ipad?","Yag or Me :(","Hot or Cold","Water or Soda?","Heroes or Villans?","Socks or Barefoot?"][Math.floor(Math.random()*105)]);
  }
  if (message.content.slice(config.prefix.length).trim() == "rg") {
    message.channel.send (["One person says a power, then another person says a restriction.","Make a sentence using the most random words.","Pretend to be ants in an ant colony.","Pretend to be bread.","Talk gibberish and pretend to understand eachother","Start a random contest","Try to talk without vowels","Try to talk using ONLY vowels","Try to talk without using the letters M, N, A, T, or Y","Try to talk without using the letters X, Y, M,N, U, R, S, T, or J"][Math.floor(Math.random()*10)]);
  }
  if (command == "sw") {
    message.channel.send ("Sleep Well!")
    message.delete();
    console.log
    } 

        if (command == "adios") {
          message.channel.send ("https://ibb.co/z8fQs8Z")
          message.delete();
          console.log
          } 

              if (command == "leedle") {
                message.channel.send ("LEEDLE LEEDLE LEEDLE LEE https://tenor.com/view/sponge-bob-patrick-leedle-gif-5888488")
                message.delete();
                console.log
                } 

                if (command == "suggest") {
                  message.channel.send ("https://forms.gle/rKZCc9zNbjKNLMDv7")
                  } 
                  if (message.content.slice(config.prefix.length).trim() == "pat") {
                    message.channel.send (["https://tenor.com/view/pat-good-boy-gif-7220650","https://tenor.com/view/funny-dog-cat-patting-head-gif-4953911","https://tenor.com/view/ao-haru-ride-anime-boy-anime-girl-anime-couple-couple-gif-13576017","https://tenor.com/view/cat-duck-pat-head-cute-gif-17539471","https://tenor.com/view/bunny-too-cute-adorable-head-pat-cute-gif-17246426","https://tenor.com/view/lub-lub-lub-shark-shark-love-catscafe-gif-15488241","https://tenor.com/view/pet-pat-anime-kawaii-cute-gif-13236885","https://tenor.com/view/soe-salome-gschwind-nori-pat-gif-21219489","https://tenor.com/view/levi-ackerman-levi-ackerman-headpat-levi-headpat-attack-on-titan-gif-20696207","https://tenor.com/view/pat-gif-19836590","https://tenor.com/view/horimiya-pat-pat-anime-yuki-yoshikawa-tooru-ishikawa-gif-20865201"][Math.floor(Math.random()*11
                    )]);
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
  if (command == "owa") {
    message.channel.send (" **OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA O OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA O OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA O OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA OWA** \n -Tuesday 2021 ")
    } 
    if (command == "bussin") {
      message.channel.send ("ayo this shit is b-b-b-bussin bussin.")
      } 
      if (message.content.slice(config.prefix.length).trim() == "dino") {
        message.channel.send (["https://ibb.co/p4YMhxm","https://ibb.co/r70xnPz","https://ibb.co/JrVDp5c","https://ibb.co/F0Sy5sm","https://ibb.co/cFkfhyh","https://ibb.co/w7Cbf2n","https://ibb.co/XZ7Jfqy","https://ibb.co/2k8xYJK","https://ibb.co/bdDjKZN"][Math.floor(Math.random()*9)]);
      }
      if (message.content.slice(config.prefix.length).trim() == "lq") {
        message.channel.send (["https://ibb.co/QQ4JDn6","https://ibb.co/h2xJFzm","https://ibb.co/mJtszkW","https://ibb.co/jLhHw09","https://ibb.co/XDvSLbw","https://ibb.co/nDq3tms","https://ibb.co/vJxtHgk","https://ibb.co/51NDFRX","https://ibb.co/fpxZgCV","https://ibb.co/QmY4PD1","https://ibb.co/PFYSYj5","https://ibb.co/gRTFZL8","https://ibb.co/kmB3Gh3","https://ibb.co/GpPjs9N","https://ibb.co/MkwdLtC"][Math.floor(Math.random()*15
        )]);
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
    "description": "[**Trevor project**](https://www.thetrevorproject.org/get-help-now/) \n [**National Suicide Prevention Lifeline**- 800-273-8255]\n [**National Suicide Prevention Lifeline (Espanol)**- 888-628-9454] \n [**National Suicide Prevention Lifeline (Options for Deaf & HOH)**- 800-799-4889]\n [**Crisis Text Line**- Text HELLO to 741741 ]\n [**YouthLine**- Text teen2teen to 839863, or call 1-877-968-8491 ]\n [**Trans Lifeline **- 1-877-565-8860]\n In order to use the hotlines, just click on the one you'd like or call/text the number next to the corresponding hotline!" 
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


      ///PRONOUN TEST

      if (command == "sheher") { 
        message.channel.send (["She looks very pretty today, doesn't she?","Look at her go! She's so amazing.","She left her bag on the floor, but im supposed to meet up with her later to give it to her.","I wonder what she's going to do over the weekend.","She might not want to come over to my house, since her mom doesn't like her being around dogs.","Did she tell you about the homework?","I thought she said that her mom was throwing a party this sunday?","She does not like bunnies.","Lexi is her friend, right?","Earlier Lexi was playing chess with her and she laughed at how confused Lexi was.","She said that she prefers tea instead of coffee.","I'm not too sure how she would feel about a cat.","Didn't she say that her favorite color was red?","She has a really cool name, and it's so unique!","I hope she had fun at her moms birthday party!","She forgot her phone, i'll just have to give it to her tomorrow in first period.","She said she couldn't remember her locker code, so Victoria is going to ask the teacher for her.","Her favorite color is purple? She's so cool!","Awe, it's a shame that she couldn't make it, but I hope she can come next time!","This notebook is hers, so please don't touch it without her premission.","She laughed at her friends funny joke.", "She smiled at her mom.","Her birthday was today and she was going to have a big party.", "She had a practice with her team today.","She laughed as her friend made funny faces."][Math.floor(Math.random()*25)]);
      }
      if (command == "theythem") {
        message.channel.send (["They look awesome today, dont they?","Look at them dance! They're so amazing.","They left their coat on the coatrack, but im supposed to meet up with them later to give it back.","I wonder where they're going this weekend.","They may not want to come over to my house, since they aren't comfortable around snakes.","Did they tell you about what happened yesterday?","What ever happened to their mom throwing them a party tomorrow?","They aren't a big fan of anime.","Max is still their friend right?","Earlier Brandon was playing ROBLOX with them and he said that they told him that they found this new cool game!","They said that they would much rather sit next to the window on an airplane.","I'm not too sure how they feel about having a snake as a pet.","Didn't they say that their favorite color was pink?","They have a really interesting name!","I hope they had fun at their friends party!","They totally forgot about their painting! I'll just take it home to dry then give it to them tomorrow.","They said that they had trouble with the Algebra homework, so Katie and Brandon are going to help them after school in the library.","Their hair color is purple, they just dyed it last night.","They weren't able to come to my party this time, but I hope they can come next time! It wasn't nearly as fun without them.","This sketchbook is theirs, you can't touch it without asking first.","Wow their friend gave them a new game. I hope they like it.","They won a trip to Disneyland. They’re packing their things now.","I know them, I made their cake for their birthday!","Veronica looked at them and smiled. Veronica loved their company.","They went to the movies with their friends today."][Math.floor(Math.random()*25)]);
      }
      if (command == "hehim") { 
        message.channel.send (["He looks very handsome today, doesn't he?","Look at him go! He's so amazing.","He left his bag on the floor, but im supposed to meet up with him later to give it back.","I wonder what he's going to do over the weekend.","He might not want to come over to my house, since his mom doesn't like him being around dogs.","Did he tell you about the homework?","I thought he said that his mom was throwing a party this sunday?","He does not like bunnies.","Jay is his friend, right?","Earlier Lexi was playing chess with him and he laughed at how confused Lexi was.","He said that he prefers his coffee hot instead of iced.","I'm not too sure how he feels about cats.","Didn't he say that his favorite color was orange?","He has a really cool name!","I hope he had fun at his birthday party!","He left his notebook, i'll just have to give it to him tomorrow.","he said he can't remember his locker combination, so Lexi is going to ask the teacher for him.","His favorite color is Aquamarine? He's so cool!","Awe, it's a shame that he couldn't make it, but I hope he can come next time!","This notebook is his, please don't touch it without his premission.","He looked at his medals as he polished them.","His mother said he was at the store.","His friends planed a surprise party for him","He decided to make his famous pie that day","I think that he did great at his first dance recital."][Math.floor(Math.random()*25)]);
      }
      if (command == "shethey") { 
        message.channel.send (["She looks very cool today, dont they?","Look at them go! She's so awesome at everything.","She left her bag on the floor, but im supposed to meet up with them tomorrow to give it back.","I wonder what they're going to do over her summer break.","I don't think they can come over to my house because her mom doesn't like the my dogs.","Did they ever ask you that question she had about the homework?","I thought She said that their mom was throwing her a party for their birthday?","She does not like their cats.","Jay is one of their close friends, right?","Earlier Ramona was playing Genshin Impact with them and Ramona was making fun of how long it took her to get to level 4.","She said that their mom isn't a big fan of energy drinks.","I'm not too sure how she feels about my cats, they may be allergic.","Didn't they say that her favorite color was a light purple?","She has a really cool name, I wonder what made them come up with it.","I hope she had fun at their birthday party!","They left their pencil case behind, so i'll just have to give her it next time i see them.","They said they are having trouble with the english homework, so Max is going to help her with it.","Her favorite color is a navy blue? That's such an interesting color for them to have as a favorite.","Awe, it's a shame that they couldn't show up to the party, but i'm sure she'll definately be there next time!","This notebook is hers, so you can't use it to take notes unless you ask them first."][Math.floor(Math.random()*20)]);
      }
      if (command == "hethey") { 
        message.channel.send (["He looks pretty swagger, dont they?","Look at them sing! He's so good at it!.","He left his things on the floor of the science room, but im supposed to meet up with them this weekend to give it back.","I wonder what they have planned for his birthday.","They aren't allowed to come over to my house because his mom has to work that day.","Do you remember if they asked the teacher about his question during the test?","If I remember correctly, their name was inspired by his favorite show.","They do not like their drawings, he is trying to improve though.","Ace went to their party this weekend and he helped Ace get to know everyone.","I could have sworn just the other day they were playing Roblox and he told me that his favorite game was banned.","They said that he loves energy drinks, but their mom says they aren't allowed to drink them too often.","Do you know if they are allergic to cats? He never gave me a direct answer.","Didn't he say that one of their favorite colors were sky blue?","He has such a cool talent, I wonder where they learned how to do something like that.","I wonder if they like coffee- or maybe he just likes tea instead.","They sometimes leave his notebook behind, but it's alright because I can give it to them after school since me and him go to the library.","He said one of their favorite activities was coding a discord bot until he messed up and accidentally deleted a whole server.","He just lost the game, I wonder how they feel about that.","They couldn't come to the party? That's alright, maybe we can have another one that he can make it to.","Give them back their pencil. You didn't even ask him if you could use it before you took it."][Math.floor(Math.random()*20)]);
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



  ///PRONOUN TEST
  if (command == "pronountest") {
    var category = undefined
    if (args[0]) { 
      category = args[0].trim().toLowerCase();
     }
     if (!category || !allowedCategories.includes(category)) {
       message.channel.send({
         "embed": {
           "title": "**Pronoun Testing **",
           "color": 65526,
           "thumbnail": {
             "url": "https://i.ibb.co/Qd897Py/b4844ea372818413347012c27e194798.jpg"
           },
           "fields": [
             {
               "name": config.prefix + "She Her",
               "value": "Test out some She/Her Pronouns! \n (**Say ?sheher**)"
            },
            {
              "name": config.prefix + "They Them",
              "value": "Test out some They/Them Pronouns! \n (**Say ?theythem**)"
            },
            {
              "name": config.prefix + "He Him",
              "value": "Test out some He/Him Pronouns! \n (**Say ?hehim**)"
            },
            {
              "name": config.prefix + "He They",
              "value": "Test out some He/They Pronouns! \n (**Say ?hethey**)"
            },
            {
              "name": config.prefix + "She They",
              "value": "Test out some She/They Pronouns! \n (**Say ?shethey**)"
            },
            {
              "name": config.prefix + "It Its",
              "value": "Test out some It/Its Pronouns! \n (**Say ?itits** CURRENTLY NOT USABLE)"
            },
            {
              "name": config.prefix + "Ze Zir",
              "value": "Test out some Ze/Zir Pronouns! \n (**Say ?zezir** CURRENTLY NOT USABLE)"
            },
            {
              "name": config.prefix + "Xe Xem",
              "value": "Test out some Xe/Xem Pronouns! \n (**Say ?xexem**) CURRENTLY NOT USABLE"
            }
           ]
         }
       })
     }}

  if (command == "lhelp") {
    var category = undefined
    if (args[0]) { 
      category = args[0].trim().toLowerCase();
     }
     const allowedCategories = ["general", "fun", "admin","support","animals"]
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
             },
             {
               "name": config.prefix + "lhelp animals",
               "value": "Have bot list out the commands that will result in animals!"
             }
           ]
         }
       })
    } else if (category == "general") {
      message.channel.send({
        "embed": {
          "title": "**Lgbtstripes Commands **",
          "color": 2123412,
          "thumbnail": {
            "url": "https://i.ibb.co/Qd897Py/b4844ea372818413347012c27e194798.jpg"
          },
          "fields": [
            {
              "name": "Hi!",
              "value": "Have the bot say hello to check and make sure that it's online and working. **(Say ?hi)**"
            },            {
              "name": "Suggestion",
              "value": "Have the bot present you with a form that allows you to submit a suggestion to be added to the bot. **(Say ?suggest)**"
            }
          ]
        }
      })
    } else if (category == "animals") {
      message.channel.send({
        "embed": {
          "title": "**Lgbtstripes Commands **",
          "color": 3426654,
          "thumbnail": {
            "url": "https://i.ibb.co/Qd897Py/b4844ea372818413347012c27e194798.jpg"
          },
          "fields": [
            {
              "name": "Kittens",
              "value": "Have the bot send a variety of beautiful kittens. **(Say ?kitty)**"
            },
            {
              "name": "Puppy",
              "value": "Makes the bot send a variety of beautiful puppies. **(Say ?puppy)**"
            },
            {
              "name": "Snakes",
              "value": "Have the bot show you some lovely serpents. **(Say ?snek)**"
            },
            {
              "name": "Frogs",
              "value": "Have the bot send you some quality frog. **(Say ?frog)**"
            },
            {
              "name": "Dinosaurs",
              "value": "Have the bot send you some adorable dinosaurs. **(Say ?dino)**"
            },
          ]
        }
      })
    } else if (category == "support") {
      message.channel.send({
        "embed": {
          "title": "**Lgbtstripes Commands **",
          "color": 15844367,
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
          "color": 15105570,
          "thumbnail": {
            "url": "https://i.ibb.co/Qd897Py/b4844ea372818413347012c27e194798.jpg"
          },
          "fields": [
            {
              "name": "Go to sleep!",
              "value": "Have the bot tell you to go to sleep **(Say ?gts)**"
            },
            {
              "name": "Weeb",
              "value": "Have the bot send you some quality anime gifs **(Say ?weeb)**"
            },
            {
              "name": "Asparagus",
              "value": "Have the bot send you some quality asparagus baby pics **(Say ?asparagus)**"
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
              "name": "Random Question!",
              "value": "Have the bot send a random question for you to answer. **(Say ?rq)**"
            },
            {
              "name": "Random Game!",
              "value": "Have the bot send a random game that you can play with your friends! **(Say ?rg)**"
            },
            {
              "name": "Game",
              "value": "Have the bot anonymously make someone loose the game! **(Say ?g)**"
            },
            {
              "name": "Leedle",
              "value": "Have the bot do a good ole' leedle leedle. **(Say ?leedle)**"
            },
            {
              "name": "Adios!",
              "value": "Have the bot send a funny Adios card picture. **(Say ?adios)**"
            },
            {
              "name": "Passive Aggressive Advice",
              "value": "Have the bot give you some sarcastic/passive aggressive advice. **(Say ?advice)**"
            },
            {
              "name": "Sleep well!",
              "value": "Have the bot tell someone to sleep well. **(Say ?sw)**"
            },
            {
              "name": "Headpat",
              "value": "Have the bot give you a nice little headpat **(Say ?pat)**"
            },
            {
              "name": "Low Quality",
              "value": "Have the bot send some funny low quality anime pics.  **(Say ?lq)**"
      }
        

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
              "name": "Check",
              "value": "Check how long a user has been in the server! **(say ?info [@username])**"
            },
            {
              "name": "Server stats",
              "value": "Check the current name of the server and the most recent updated member count! **(say ?server)**"
            },
            {
              "name": "Discord Id",
              "value": "Grab someone's username and discord ID **(say ?id)**"
            },
          

          ]
        }
      })
    }
  }
}); 
                             
client.login(process.env.TOKEN)
