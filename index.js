import 'dotenv/config'
import { Telegraf } from 'telegraf'

import Robot from './bot.js'

const bot = new Telegraf(process.env.token)
const instance = new Robot(bot);

setInterval(async () => {
  try{
    instance.watchChanges()

  } catch (error){
    console.error(error)
    return
  }
}, 8000)

bot.launch()
