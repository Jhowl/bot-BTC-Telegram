'use strict'

const axios = require('axios')
const env = require('./../.env')


 const btcBrl = {
  // constructor() {
  //     this.env.urlConsulta = 'https://watcher.foxbit.com.br/api/Ticker'
  //     this.exchanges = []
  //     this.getExchangesBtcBrl();
  // }

  async getExchangesBtcBrl() {
    const res = await axios.get(env.urlConsulta)
    const exchanges = []
    res.data.forEach(element => {
      if(element.currency === "BRLXBTC")
        exchanges.push(element.exchange)
    });

    return exchanges
  },

  async getBasicDataFromExchange(name) {
    console.log(env.urlConsulta + '?exchange=' + name)
      const res = await axios.get(env.urlConsulta + '?exchange=' + name)
      return res.data
  },
}

module.exports = btcBrl
