const env = require('../.env')
const Telegraf = require('telegraf')
const moment = require('moment')
const Markup = require('telegraf/markup')
const axios = require('axios')
const bot = new Telegraf(env.token)

bot.start(async ctx => {
    const from = ctx.update.message.from

    if(from.id != env.id){
        ctx.reply(`Sinto muito mais não falo com vc!, ${from.first_name}!`)
        return;
    }

    await ctx.reply(`Ao seu dispor, mano loko!!, ${from.first_name}!\nO que vc quer hoje meu consagrado?`, 
        Markup.keyboard('BTC Bitstamp').resize().extra())
})

const controlBTC = {}
controlBTC.value = 0 

setInterval(async () => {
    const res = await axios.get('https://www.bitstamp.net/api/ticker/')
    if( controlBTC.value == /\d/.exec(/\d{3}[.]/.exec(res.data.last)[0])[0] ){
        return
    }

    controlBTC.value = /\d/.exec(/\d{3}[.]/.exec(res.data.last)[0])[0]
    bot.telegram.sendMessage(env.id, `Valor da última transação na Bitstamp: ${res.data.last}`)
}, 5000)

bot.hears('BTC Bitstamp', async ctx => {
    console.log('oi')
    const res = await axios.get('https://www.bitstamp.net/api/ticker/')
    ctx.reply(`Valor da última transação na Bitstamp: ${res.data.last}`)  
}) 

bot.startPolling()