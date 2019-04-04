'use strict'

const env      = require('./.env')
const Telegraf = require('telegraf')
const Markup   = require('telegraf/markup')
const Brazil   = require( './brazil' )

const telegram = new Telegraf(env.token)
const brazil = new Brazil()

class Bot {
    constructor(){
        this.keyboardInitial = Markup.keyboard([['BTC Bitstamp'], ['Brasil Exchanges']]).resize().extra()
        this.bitcoinControl  = {}
    }
    
    setLastTransactionValue = (value) => {
        this.bitcoinControl.lastValue = value
    }

    // telegram.start(ctx => {
    //     const from = ctx.update.message.from

    //     if(from.id != env.id){
    //         ctx.reply(`Sinto muito mais não falo com vc!, ${from.first_name}!`)
    //         return;
    //     }

    //     ctx.reply(
    //         `Ao seu dispor, mano loko!!, ${from.first_name}!\nO que vc quer hoje meu consagrado?`,
    //         keyboardInitial()
    //     )
    // })

    // telegram.hears('BTC Bitstamp', ctx => {
    //     ctx.reply(`Valor da última transação na Bitstamp: ${bitcoinControl.lastValue}`, keyboardInitial())
    // })

    // telegram.hears('Brasil Exchanges', ctx => {
    //     ctx.reply('Selecione Alguma Exchange no teclado de opções!', brazil.keyboardBrazilExchanges())
    // })

    // telegram.hears(brazil.exchanges, async ctx => {
    //     try{
    //         const res = await brazil.getBasicDataFromExchange(ctx.match)
    //         ctx.replyWithHTML(`Ultimos Valores na Exchange ${ctx.match}: \n\n Compra: ${res.BuyPrice} \n Venda: ${res.SellPrice} \n Ultima Transação: <code>${res.Last}</code>\n Volume: ${res.Vol} \n <pre>Variação: ${res.LastVariation}% </pre>`,
    //         brazil.keyboardBrazilExchanges()
    //         )
    //     } catch (error){
    //         ctx.reply(`A api da exchange ${ctx.match} está temporarimante indisponivel tente novamente mais tarde`)
    //     }
    // })

    // telegram.hears('< Voltar', ctx => {
    //     ctx.reply(
    //         'Escolha Entre as opções do Teclado',
    //         keyboardInitial()
    //     )
    // })

    // telegram.startPolling()
}

module.exports = bot