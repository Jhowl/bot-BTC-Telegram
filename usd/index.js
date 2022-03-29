import axios from 'axios'
import services from './../config/index.js'

class Usd {
  constructor() {
    this.usd = {}
    this.usd.unit = 0
    this.lastValue = 0
  }

  async verifyChangesUsd(callback) {
    const usd = await this.getCurrencyInfo('usd')
    const [ unit ] = /\d\d/.exec(usd.bid)

    this.lastValue = usd.bid

    if(this.usd.unit == unit){
        return false
    }

    const variation = ( unit > this.usd.unit ) ? 'Dolar subiu de' : 'Dolar caiu de'

    callback(`${variation} ${this.usd.unit} : \n para valor atual ${usd.bid}`)

    this.usd.unit = unit
  }

  async getCurrencyInfo(name) {
    const result = await axios.get(`${services.restCurrencies}/${name}`)
    const [ currency ] = result.data

    return currency
  }
}

export default Usd
