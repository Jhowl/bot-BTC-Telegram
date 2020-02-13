const axios = require('axios')

class btcUsd {
  constructor() {
    this.bitcoinControl = {}
    this.bitcoinControl.unit = ''
  }

  async verifyChangesBTC(callback) {
    const res  = await axios.get('https://www.bitstamp.net/api/ticker/')
    const unit = /\d/.exec(/\d{3}[.]/.exec(res.data.last)[0])[0]

    this.bitcoinControl.lastValue = res.data.last

    if(this.bitcoinControl.unit == unit){
        return false
    }

    callback(`BTC Saiu da casa ${this.bitcoinControl.unit}00 \n Agora está na casa dos ${unit}00: \n valor atual ${res.data.last}`)

    this.bitcoinControl.unit = unit
  }

}

module.exports = btcUsd
