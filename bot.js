'use strict'

const env      = require('./.env')
const Telegraf = require('telegraf')
const Markup   = require('telegraf/markup')
const axios    = require('axios')
const Brazil   = require( './brazil' )

const bot    = new Telegraf(env.token)
const brazil = new Brazil()

const keyboardInitial = () => Markup.keyboard([['BTC Bitstamp'], ['Brasil Exchanges']]).resize().extra()

bot.start(ctx => {
    const from = ctx.update.message.from

    if(from.id != env.id){
        ctx.reply(`Sinto muito mais não falo com vc!, ${from.first_name}!`)
        return;
    }

     ctx.reply(
        `Ao seu dispor, mano loko!!, ${from.first_name}!\nO que vc quer hoje meu consagrado?`,
        keyboardInitial()
    )
})

bot.hears('BTC Bitstamp', async ctx => {
    const res = await axios.get('https://www.bitstamp.net/api/ticker/')
    ctx.reply(`Valor da última transação na Bitstamp: ${res.data.last}`, keyboardInitial())
})

bot.hears('Brasil Exchanges', ctx => {
    ctx.reply('Selecione Alguma Exchange no teclado de opções!', brazil.keyboardBrazilExchanges())
})

bot.hears(brazil.exchanges, async ctx => {
    try{
        const res = await brazil.getBasicDataFromExchange(ctx.match)
        ctx.replyWithHTML(`Ultimos Valores na Exchange ${ctx.match}: \n\n Compra: ${res.BuyPrice} \n Venda: ${res.SellPrice} \n Ultima Transação: <code>${res.Last}</code>\n Volume: ${res.Vol} \n <pre>Variação: ${res.LastVariation}% </pre>`,
        brazil.keyboardBrazilExchanges()
        )
    } catch (error){
        ctx.reply(`A api da exchange ${ctx.match} está temporarimante indisponivel tente novamente mais tarde`)
    }
})

bot.hears('< Voltar', ctx => {
    ctx.reply(
        'Escolha Entre as opções do Teclado',
        keyboardInitial()
    )
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
            `BTC Saiu da casa ${controlBTC.value}00 \n Agora está na casa dos ${unit}00: \n valor atual ${res.data.last}`,
            keyboardInitial()
        )

        controlBTC.value = unit
    } catch (error){
        return
    }
}, 5000)

bot.startPolling()