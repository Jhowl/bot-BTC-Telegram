'use strict'

const env = require('./.env')
const Telegraf = require('telegraf')
const Markup = require('telegraf/markup')
const btcBrl = require( './btc/btcBrl.js' )
const btcUsd = require( './btc/btcUsd.js' )

const telegram = new Telegraf(env.token)

class Bot {
  constructor(){
      this.startBot()
      this.brazilExchanges = []

      // btcBrl(telegram)
      this.btcUsd = new btcUsd(telegram)
      this.messagesDefault()
  }

  keyboardInitial() {
    return Markup.keyboard([['BTC Bitstamp'], ['Brasil Exchanges']]).resize().extra()
  }

  sendMessages(message) {
    telegram.telegram.sendMessage(
      env.id,
      message,
      // this.keyboardInitial()
    )
  }

  async verifyChanges () {
    await this.btcUsd.verifyChangesBTC(this.sendMessages)
  }

  async keyboardBrazilExchanges() {
    const keys = await btcBrl.getExchangesBtcBrl()
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
        ctx.reply(`Valor da última transação na Bitstamp: ${this.btcUsd.bitcoinControl.lastValue}`, this.keyboardInitial())
    })

    telegram.hears('Brasil Exchanges', async ctx => {
        ctx.reply('Selecione Alguma Exchange no teclado de opções!', await this.keyboardBrazilExchanges())
    })

    telegram.hears(this.brazilExchanges, async ctx => {
      try{
          const res = await btcBrl.getBasicDataFromExchange(ctx.match)

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
