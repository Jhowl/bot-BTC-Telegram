const axios = require('axios')

class btcUsd {
  constructor(telegram) {
    this.bitcoinControl = {}
    this.bitcoinControl.unit = ''

    this.telegram = telegram
  }

  async verifyChangesBTC(callback) {
    const res  = await axios.get('https://www.bitstamp.net/api/ticker/')
    const unit = /\d/.exec(/\d{3}[.]/.exec(res.data.last)[0])[0]

    this.bitcoinControl.lastValue = res.data.last

    if(this.bitcoinControl.unit == unit){
        return false
    }

    this.bitcoinControl.unit = unit

    callback(`BTC Saiu da casa ${this.bitcoinControl.unit}00 \n Agora está na casa dos ${unit}00: \n valor atual ${res.data.last}`)
  }

}

module.exports = btcUsd
