'use strict'

const axios = require('axios')
class Brazil {

    constructor() {
        this.urlConsulta = 'http://watcher.foxbit.com.br/api/Ticker'
    
        this.exchanges = [
            '3xBit',
            'BitBlue',
            'BitcoinToYou',
            'BitcoinTrade',
            'Brabex',
            'BrasilBitcoin',
            'Braziliex',
            'BtcBolsa',
            'CitCoin',
            'Coin2001',
            'CryptoMkt',
            'FlowBtc',
            'Foxbit',
            'MercadoBitcoin',
            'OmniTrade',
            'PagCripto',
            'Profitfy',
            'TemBtc',
            'TrocaNinja',
            'Walltime',
        ]
    }

    async getBasicDataFromExchange(name) {
        const res = await axios.get(this.urlConsulta + '?exchange=' + name)
        return res.data
    }
}

module.exports = Brazil