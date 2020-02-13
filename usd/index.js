const axios = require('axios')

class Usd {
  constructor() {
    this.usd = {}
    this.usd.unit = ''
    this.serviceUrl = 'https://economia.awesomeapi.com.br/USD'
  }

  async verifyChangesUsd(callback) {
    const result = await axios.get(this.serviceUrl)
    const [ usd ] = result.data
    const [ unit ] = /\d\d/.exec(usd.bid)

    this.usd.lastValue = usd.bid

    if(this.usd.unit == unit){
        return false
    }

    callback(`Dolar Saiu da casa ${this.usd.unit} \n Agora está na casa dos ${unit}: \n valor atual ${usd.bid}`)

    this.usd.unit = unit
  }

}

module.exports = Usd
