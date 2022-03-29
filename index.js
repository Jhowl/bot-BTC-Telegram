import Robot from './bot.js'

const bot = new Robot();

setInterval(async () => {
  try{

    bot.watchChanges()

  } catch (error){
    console.error(error)
    return
  }
}, 8000)
