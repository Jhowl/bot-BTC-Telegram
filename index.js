const axios = require('axios')
const Robot = require('./bot.js')

const controlBTC = {}
controlBTC.bitstamp = {}
controlBTC.bitstamp.unit = ''

bot = new Robot();

setInterval(async () => {
  try{
    const res  = await axios.get('https://www.bitstamp.net/api/ticker/')
    const unit = /\d/.exec(/\d{3}[.]/.exec(res.data.last)[0])[0]

    controlBTC.bitstamp.value = res.data.last

    bot.setLastTransactionValue(controlBTC.bitstamp.value)

    if( controlBTC.bitstamp.unit == unit ){
        return
    }

    bot.sendMessages(`BTC Saiu da casa ${controlBTC.bitstamp.unit}00 \n Agora está na casa dos ${unit}00: \n valor atual ${res.data.last}`)

    controlBTC.bitstamp.unit = unit
  } catch (error){
    console.log(error)
    return
  }
}, 8000)
