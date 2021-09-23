// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fetch from "isomorphic-fetch"
import { VesterCode } from "../../contracts"
import FormData from "form-data"

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const Route = async (req, res) => {
  const { address, constructor } = req.query
  console.log("Verifying:", address)
  console.log("Constructor:", constructor)

  await delay(3000)

  // const url = "https://api-ropsten.etherscan.io/api"
  const url = "https://api.etherscan.io/api"

  const data = {
    apikey: process.env.APIKEY, //A valid API-Key is required
    module: "contract", //Do not change
    action: "verifysourcecode", //Do not change
    contractaddress: address, //Contract Address starts with 0x...
    sourceCode: VesterCode, //Contract Source Code (Flattened if necessary)
    constructorArguements: constructor,
    codeformat: "solidity-single-file", //solidity-single-file (default) or solidity-standard-json-input (for std-input-json-format support
    contractname: "Vester", //ContractName (if codeformat=solidity-standard-json-input, then enter contractname as ex: erc20.sol:erc20)
    compilerversion: "v0.5.17+commit.d19bba13", // see https://etherscan.io/solcversions for list of support versions
    optimizationUsed: 1, //0 = No Optimization, 1 = Optimization used (applicable when codeformat=solidity-single-file)
    runs: 200,
    licenseType: 12
  }

  let formData = new FormData()
  Object.entries(data).map((obj) => formData.append(obj[0], obj[1]))

  const response = await fetch(url, {
    method: "POST",
    body: formData
  }).then((res) => res.json())

  console.log(response)

  res.status(200).json({ guid: response.result })
}
export default Route
