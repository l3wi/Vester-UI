import { ethers, ContractFactory } from "ethers"
import { web3, getSymbol, fetchBalance } from "./ethers"
import { Contract, Provider } from "ethers-multicall"
import fetch from "isomorphic-fetch"
import { Vester, VesterCode } from "../contracts"

export const verifyContract = async (address, constructor) => {
  const response = await fetch(
    "/api/verify?address=" + address + "&constructor=" + constructor
  ).then((res) => res.json())
  return response
}

export const getTokens = async (address) => {
  const url = `https://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc`
  const response = await fetch(url).then((res) => res.json())
  let tokens = []
  try {
    response.result.map((tx) => {
      if (tokens.findIndex((item) => item.symbol === tx.tokenSymbol) === -1) {
        tokens.push({ address: tx.contractAddress, symbol: tx.tokenSymbol })
      }
    })
    return tokens
  } catch (error) {
    return []
  }
}

export const mintVester = async (
  beneficiary,
  start,
  cliffDuration,
  duration,
  revocable
) => {
  let iface = new ethers.utils.Interface(Vester.abi)
  const constructor = iface.encodeDeploy([
    beneficiary,
    start,
    cliffDuration,
    duration,
    revocable
  ])

  const signer = web3.getSigner()
  const factory = new ContractFactory(Vester.abi, Vester.bytecode, signer)
  const contract = await factory.deploy(
    beneficiary,
    start,
    cliffDuration,
    duration,
    revocable
  )
  return {
    address: contract.address,
    transaction: contract.deployTransaction,
    constructor
  }
}

export const getVesterInfo = async (address) => {
  const ethcallProvider = new Provider(web3)
  await ethcallProvider.init()
  const vester = new Contract(address, Vester.abi)

  const calls = [
    vester.owner(),
    vester.beneficiary(),
    vester.start(),
    vester.cliff(),
    vester.duration(),
    vester.revocable()
  ]

  const [owner, beneficiary, start, cliff, duration, revocable] =
    await ethcallProvider.all(calls)

  return {
    owner,
    beneficiary,
    start: start.toString(),
    cliff: cliff.toString(),
    duration: duration.toString(),
    revocable
  }
}

export const getVesterToken = async (address, token) => {
  const balance = await fetchBalance(token.address, address)

  const ethcallProvider = new Provider(web3)
  await ethcallProvider.init()
  const vester = new Contract(address, Vester.abi)

  const calls = [
    vester.releaseableAmount(token.address),
    vester.released(token.address),
    vester.revoked(token.address)
  ]

  const [releaseableAmount, released, revoked] = await ethcallProvider.all(
    calls
  )

  return {
    address: token.address,
    symbol: token.symbol,
    balance: parseFloat(balance),
    releaseableAmount: parseFloat(ethers.utils.formatEther(releaseableAmount)),
    released: parseFloat(ethers.utils.formatEther(released)),
    revoked
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
