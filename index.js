const Robot = require('./bot')

bot = new Robot();

setInterval(async () => {
  try{

    bot.verifyChangesBTC()

  } catch (error){
    console.log(error)
    return
  }
}, 8000)
