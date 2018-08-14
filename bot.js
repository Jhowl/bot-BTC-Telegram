'use strict'

const env = require('./.env')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const axios = require('axios')
const Brazil = require( './brazil' )

const bot = new Telegraf(env.token)
const brazil = new Brazil()

const keyboard = Markup.keyboard([['BTC Bitstamp'], ['Brasil Exchanges']]).resize().extra()

bot.start(async ctx => {
    const from = ctx.update.message.from

    if(from.id != env.id){
        ctx.reply(`Sinto muito mais não falo com vc!, ${from.first_name}!`)
        return;
    }

    await ctx.reply(`Ao seu dispor, mano loko!!, ${from.first_name}!\nO que vc quer hoje meu consagrado?`,
       keyboard)
})

const controlBTC = {}
controlBTC.value = ''

setInterval(async () => {
    try{
        const res  = await axios.get('https://www.bitstamp.net/api/ticker/')
        const unit = /\d/.exec(/\d{3}[.]/.exec(res.data.last)[0])[0]

        if( controlBTC.value == unit ){
            return
        }

        bot.telegram.sendMessage(
            env.id, 
            `BTC Saiu da casa ${controlBTC.value} \n Agora está na casa dos ${unit}00: \n valor atual ${res.data.last}`,
            keyboard
        )

        controlBTC.value = unit
    } catch (error){
        return
    }
}, 5000)

bot.hears('BTC Bitstamp', async ctx => {
    const res = await axios.get('https://www.bitstamp.net/api/ticker/')
    ctx.reply(`Valor da última transação na Bitstamp: ${res.data.last}`, keyboard)
})

bot.hears('Brasil Exchanges', ctx => {
    ctx.reply(`Valor da última transação na Bitstamp: ${brazil.exchanges}`, Markup.keyboard(brazil.exchanges).resize().extra())
})

bot.hears(brazil.exchanges, async ctx => {
    try{
        const res = await brazil.getBasicDataFromExchange(ctx.match)
        ctx.replyWithHTML(`Ultimos Valores na Exchange ${ctx.match}: \n\n Compra: ${res.BuyPrice} \n Venda: ${res.SellPrice} \n Ultima Transação: <code>${res.Last}</code>\n Volume: ${res.Vol} \n <pre>Variação: ${res.LastVariation}% </pre>`
            , Markup.keyboard(brazil.exchanges).resize().extra()
        )
    } catch (error){
        ctx.reply(`A api da exchange ${ctx.match} está temporarimante indisponivel tente novamente mais tarde`)
    }
})

bot.startPolling()