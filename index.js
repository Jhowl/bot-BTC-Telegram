const Robot = require('./bot')

bot = new Robot();

setInterval(async () => {
  try{

    bot.verifyChanges()

  } catch (error){
    console.error(error)
    return
  }
}, 8000)
