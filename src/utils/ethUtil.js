const DECIMALS = (10**18)
export const ETH_ADDRESS = '0x0000000000000000000000000000000000000000'

export const fromWei = (amount) => {
    return (amount/DECIMALS)
}