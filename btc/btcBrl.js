'use strict'

const axios = require('axios')
const services = require('./../config')

 const btcBrl = {

  async getExchangesBtcBrl() {
    const res = await axios.get(services.btcBrazil)
    const exchanges = res.data.map(item => (item.currency === "BRLXBTC") ? item.exchange : '');

    return exchanges.filter(item => item ? item : false)
  },

  async getBasicDataFromExchange(name) {
      const res = await axios.get(services.btcBrazil + '?exchange=' + name)
      return res.data
  },
}

module.exports = btcBrl
