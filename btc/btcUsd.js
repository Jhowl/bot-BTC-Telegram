import axios from 'axios'
import services from './../config/index.js'

class btcUsd {
  constructor() {
    this.bitcoinControl = {}
    this.bitcoinControl.unit = ''
  }

  async verifyChangesBTC(callback) {
    const res  = await axios.get(services.btcBitstamp)
    const unit = /\d/.exec(/\d{3}[.]/.exec(res.data.last)[0])[0]

    // console.log(this.bitcoinControl.unit)
    // console.log(unit)
    // console.log(this.bitcoinControl.unit == unit)

    this.bitcoinControl.lastValue = res.data.last

    if(this.bitcoinControl.unit == unit){
        return false
    }

    callback(`BTC Saiu da casa ${this.bitcoinControl.unit}00
      Agora está na casa dos ${unit}00:
      valor atual ${res.data.last}`)

    this.bitcoinControl.unit = unit
  }

}

export default btcUsd
