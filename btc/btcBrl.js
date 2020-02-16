'use strict'

const axios = require('axios')
const services = require('./../config')

 const btcBrl = {

  async getExchangesBtcBrl() {
    const res = await axios.get(services.btcBrazil)
    const exchanges = []
    res.data.forEach(element => {
      if(element.currency === "BRLXBTC")
        exchanges.push(element.exchange)
    });

    return exchanges
  },

  async getBasicDataFromExchange(name) {
      const res = await axios.get(services.btcBrazil + '?exchange=' + name)
      return res.data
  },
}

module.exports = btcBrl
