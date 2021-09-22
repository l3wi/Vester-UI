import { ethers } from "ethers"
import { web3, getSymbol } from "./ethers"
import { Contract, Provider } from "ethers-multicall"

import { Vester } from "../contracts"

export const getVesterInfo = async (address, token) => {
  console.log("Args:", address, token)
  const tokenSymbol = await getSymbol(token)

  const ethcallProvider = new Provider(web3)
  await ethcallProvider.init()
  const vester = new Contract(address, Vester.abi)

  const calls = [
    vester.owner(),
    vester.beneficiary(),
    vester.start(),
    vester.cliff(),
    vester.duration(),
    vester.releaseableAmount(token),
    vester.released(token),
    vester.revocable(),
    vester.revoked(token)
  ]

  const [
    owner,
    beneficiary,
    start,
    cliff,
    duration,
    releaseableAmount,
    released,
    revocable,
    revoked
  ] = await ethcallProvider.all(calls)

  return {
    owner,
    beneficiary,
    start: start.toString(),
    cliff: cliff.toString(),
    duration: duration.toString(),
    releaseableAmount: ethers.utils.formatEther(releaseableAmount),
    released: ethers.utils.formatEther(released),
    revocable,
    revoked,
    symbol: tokenSymbol
  }
}

export const updateDelegate = async (address, token, delegate) => {
  const signer = web3.getSigner()
  const vester = new ethers.Contract(address, Vester.abi, signer)

  const response = await vester.delegate(token, delegate)
  return response.hash
}
export const releaseTokens = async (address, token, amount) => {
  const signer = web3.getSigner()
  const vester = new ethers.Contract(address, Vester.abi, signer)

  const response = await vester.release(token, ethers.utils.parseUnits(amount))
  return response.hash
}
export const transferBenificary = async (address, value) => {
  const signer = web3.getSigner()
  const vester = new ethers.Contract(address, Vester.abi, signer)

  const response = await vester.transferBenificary(value)
  return response.hash
}
