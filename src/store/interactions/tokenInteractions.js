import Token from  '../../abis/Token.json'
import { tokenLoaded } from '../actions/tokenActions'

export const loadToken = async (web3, dispatch) => {
    const networkId = await web3.eth.net.getId()
    const networks = Token.networks
    
    if(networks[networkId] === undefined) {
        return null
    } else {
        const address = networks[networkId].address
        const abi = Token.abi
        const token = new web3.eth.Contract(abi, address)
        dispatch(tokenLoaded(token))
        return token
    }
}