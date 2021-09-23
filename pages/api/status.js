// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import fetch from "isomorphic-fetch"
import { VesterCode } from "../../contracts"
import FormData from "form-data"

const Route = async (req, res) => {
  const { guid } = req.query
  console.log("Verifying:", address)
  const url = "https://api-ropsten.etherscan.io/api"
  // const url = 'https://api.etherscan.io/api'

  const data = {
    guid, //Replace with your Source Code GUID receipt above
    module: "contract",
    action: "checkverifystatus"
  }

  let formData = new FormData()
  Object.entries(data).map((obj) => formData.append(obj[0], obj[1]))

  const response = await fetch(url, {
    method: "POST",
    body: formData
  }).then((res) => res.json())

  console.log(response)

  res.status(200).json(response.result)
}
export default Route
