const axios = require('axios')
const services = require('./../config')

class Usd {
  constructor() {
    this.usd = {}
    this.usd.unit = 0
    this.lastValue = 0
  }

  async verifyChangesUsd(callback) {
    const usd = await this.getDollarInfo()
    const [ unit ] = /\d\d/.exec(usd.bid)

    this.lastValue = usd.bid

    if(this.usd.unit == unit){
        return false
    }

    const variation = ( unit > this.usd.unit ) ? 'Dolar subiu de' : 'Dolar caiu de'

    callback(`${variation} ${this.usd.unit} : \n para valor atual ${usd.bid}`)

    this.usd.unit = unit
  }

  async getDollarInfo() {
    const result = await axios.get(`${services.restCurrencies}/USD`)
    console.log(`${services.restCurrencies}/USD`)
    const [ usd ] = result.data

    return usd
  }

}

module.exports = Usd
