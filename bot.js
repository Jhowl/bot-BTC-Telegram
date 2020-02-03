'use strict'

const env = require('./.env')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const brazil = require( './brazil' )
const axios = require('axios')

const telegram = new Telegraf(env.token)

class Bot {
  constructor(){
      this.bitcoinControl = {}
      this.brazilExchanges = []
      this.bitcoinControl.unit = ''

      this.startBot()
      this.messagesDefault()
  }

  async verifyChangesBTC() {
    const res  = await axios.get('https://www.bitstamp.net/api/ticker/')
    const unit = /\d/.exec(/\d{3}[.]/.exec(res.data.last)[0])[0]

    this.bitcoinControl.lastValue = res.data.last

    if(this.bitcoinControl.unit == unit){
        return
    }

    this.sendMessages(`BTC Saiu da casa ${this.bitcoinControl.unit}00 \n Agora está na casa dos ${unit}00: \n valor atual ${res.data.last}`)

    this.bitcoinControl.unit = unit
  }

  keyboardInitial() {
    return Markup.keyboard([['BTC Bitstamp'], ['Brasil Exchanges']]).resize().extra()
  }

  sendMessages(message) {
    telegram.telegram.sendMessage(
      env.id,
      message,
      this.keyboardInitial()
    )
  }

  async keyboardBrazilExchanges() {
    const keys = await brazil.getExchangesBrazil()
    keys.push('< Voltar')
    this.brazilExchanges = keys

    this.messagesDefault()
    return Markup.keyboard(keys).resize().extra()
}

  startBot () {
    telegram.start(ctx => {
      const from = ctx.update.message.from

      if(from.id != env.id){
          ctx.reply(`Sinto muito mais não falo com vc!, ${from.first_name}!`)
          return;
      }

      ctx.reply(
          `Ao seu dispor, mano loko!!, ${from.first_name}!\nO que vc quer hoje meu consagrado?`,
          this.keyboardInitial()
      )
    })

    telegram.startPolling()
  }

  messagesDefault () {
    telegram.hears('BTC Bitstamp', ctx => {
        ctx.reply(`Valor da última transação na Bitstamp: ${this.bitcoinControl.lastValue}`, this.keyboardInitial())
    })

    telegram.hears('Brasil Exchanges', async ctx => {
        ctx.reply('Selecione Alguma Exchange no teclado de opções!', await this.keyboardBrazilExchanges())
    })

    telegram.hears(this.brazilExchanges, async ctx => {
      try{
          const res = await brazil.getBasicDataFromExchange(ctx.match)

          ctx.replyWithHTML(`Ultimos Valores na Exchange ${ctx.match}: \n\n Compra: ${res.buyPrice} \n Venda: ${res.sellPrice} \n Ultima Transação: <code>${res.last}</code>\n Volume: ${res.vol} \n <pre>Variação: ${res.lastVariation}% </pre>`,
          )
      } catch (error){
          ctx.reply(`A api da exchange ${ctx.match} está temporarimante indisponivel tente novamente mais tarde`)
      }
    })

    telegram.hears('< Voltar', ctx => {
        ctx.reply(
            'Escolha Entre as opções do Teclado',
            this.keyboardInitial()
        )
    })
  }
}

module.exports = Bot
