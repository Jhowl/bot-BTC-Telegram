import { Markup } from 'telegraf'
import btcBrl from './btc/btcBrl.js'
import btcUsd from './btc/btcUsd.js'
import usd from './usd/index.js'
class Bot {
  constructor(bot) {
    this.bot = bot
    this.startBot()
    this.brazilExchanges = []
    this.btcUsd = new btcUsd()
    this.usd = new usd()
    this.messagesDefault()
  }

  keyboardInitial() {
    return Markup.keyboard([['BTC Bitstamp'], ['Brasil Exchanges'], ['Valor Dolar']])
  }

  sendMessages(message) {
    this.bot.telegram.sendMessage(
      process.env.id,
      message,
    )
  }

  async watchChanges() {
    try {
      await Promise.all([
        this.btcUsd.verifyChangesBTC(this.sendMessages.bind(this)),
        this.usd.verifyChangesUsd(this.sendMessages.bind(this)),
      ])
    } catch (error) {
      console.error(error)
    }
  }

  async keyboardBrazilExchanges() {
    const keys = await btcBrl.getExchangesBtcBrl()
    keys.push('< Voltar')
    this.brazilExchanges = keys

    this.messagesDefault()
    return Markup.keyboard(keys)
  }

  startBot() {
    this.bot.start(ctx => {
      const from = ctx.update.message.from

      ctx.reply(
        `Bot for wath btc is started ${from.first_name}!\n`,
        this.keyboardInitial()
      )
    })
  }

  messagesDefault() {
    this.bot.hears('BTC Bitstamp', ctx => {
      ctx.reply(`Valor da última transação na Bitstamp: ${this.btcUsd.bitcoinControl.lastValue}`, this.keyboardInitial())
    })

    this.bot.hears('Brasil Exchanges', async ctx => {
      ctx.reply('Selecione Alguma Exchange no teclado de opções!', await this.keyboardBrazilExchanges())
    })

    this.bot.hears('Valor Dolar', async ctx => {
      ctx.reply(`Valor do dolar: ${this.usd.lastValue}`, this.keyboardInitial())
    })

    this.bot.hears(this.brazilExchanges, async ctx => {
      try {
        const res = await btcBrl.getBasicDataFromExchange(ctx.match)

        ctx.replyWithHTML(`Ultimos Valores na Exchange ${ctx.match}: \n\n Compra: ${res.buyPrice} \n Venda: ${res.sellPrice} \n Ultima Transação: <code>${res.last}</code>\n Volume: ${res.vol} \n <pre>Variação: ${res.lastVariation}% </pre>`,
        )
      } catch (error) {
        ctx.reply(`A api da exchange ${ctx.match} está temporarimante indisponivel tente novamente mais tarde`)
      }
    })

    this.bot.hears('< Voltar', ctx => {
      ctx.reply(
        'Escolha Entre as opções do Teclado',
        this.keyboardInitial()
      )
    })
  }
}

export default Bot
