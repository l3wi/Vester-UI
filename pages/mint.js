import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {
  Heading,
  Text,
  Flex,
  Divider,
  Checkbox,
  Input,
  Button,
  ListItem,
  Link,
  OrderedList
} from "@chakra-ui/react"
import { ExternalLinkIcon, CheckCircleIcon } from "@chakra-ui/icons"
import { getUnixTime, differenceInSeconds, add } from "date-fns"

import DatePicker from "../components/DatePicker"
import Head from "next/head"
import Page from "../components/page"
import { useWeb3 } from "../contexts/useWeb3"
import { useAlerts } from "../contexts/useAlerts"

import { mintVester, verifyContract } from "../utils/vester"

export default function Mint() {
  const router = useRouter()
  const { watchTx } = useAlerts()
  const [vesterAddress, setVesterAddress] = useState(false)
  const [beneficiary, setBeneficiary] = useState()
  const [start, setStart] = useState(new Date())
  const [cliff, setCliff] = useState(add(new Date(), { years: 1 }))
  const [duration, setDuration] = useState(add(new Date(), { years: 2 }))
  const [revocable, setRevocable] = useState(true)

  const execute = async () => {
    const cliffSeconds = differenceInSeconds(cliff, start)
    const durationSeconds = differenceInSeconds(duration, start)

    const { address, transaction, constructor } = await mintVester(
      beneficiary,
      getUnixTime(start),
      cliffSeconds,
      durationSeconds,
      revocable
    )
    const executed = await watchTx(
      transaction.hash,
      "Launching Vesting Contract"
    )
    console.log("New Vester", address)
    setVesterAddress(address)

    const verifyResponse = await verifyContract(
      address,
      constructor.substring(2)
    )
    console.log(verifyResponse)
    console.log("Success")
  }

  return (
    <Page>
      <Head>
        <title>Mint a new Vester</title>
        <link rel="icon" href="/favicon.png" />
      </Head>

      <Flex
        mt={{ base: 10 }}
        w="100%"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <Flex
          shadow="xl"
          borderRadius="2xl"
          p={10}
          bg={"white"}
          width={{ base: "100%", md: "600px" }}
          flexDirection="column"
        >
          {!vesterAddress ? (
            <>
              <Heading size="lg" color="gray.700">
                Mint a new Vester
              </Heading>
              <Text mt="2" color="gray.600">
                This UI helps you launch a new vesting contract, verify it on
                Etherscan and then transfer tokens to the newly created vesting
                contract.
              </Text>
              <Divider my="3" />
              <Text>Beneficiary:</Text>
              <Input
                placeholder="eg. 0xc0bebe...."
                value={beneficiary}
                onChange={(e) => setBeneficiary(e.target.value)}
              />

              <Text mt="3">Start Date:</Text>
              <DatePicker selected={start} onChange={(e) => setStart(e)} />

              <Text mt="3">Cliff Date:</Text>
              <DatePicker selected={cliff} onChange={(e) => setCliff(e)} />
              <Text mt="3">End Date:</Text>
              <DatePicker
                selected={duration}
                onChange={(e) => setDuration(e)}
              />

              <Checkbox
                mt="3"
                defaultIsChecked
                value={revocable}
                onChange={() => setRevocable(!revocable)}
              >
                is Revocable?
              </Checkbox>

              <Button onClick={() => execute()} colorScheme="green" mt="2">
                Mint Vester
              </Button>
            </>
          ) : (
            <>
              <Heading size="lg" color="gray.700">
                <CheckCircleIcon color="green.400" mr="2" />
                Vester Contract Minted!
              </Heading>
              <Text mt="2">
                Your new vesting contract has been created. It now can be
                utilised to vest tokens to the beneficiary.
              </Text>
              <Text fontWeight="700" mt="2">
                Next Steps:
              </Text>
              <OrderedList>
                <ListItem>
                  Check the contract is verfied on{" "}
                  <Link
                    href={`https://etherscan.io/address/${vesterAddress}#readContract`}
                    isExternal
                  >
                    Etherscan <ExternalLinkIcon mx="2px" />
                  </Link>
                </ListItem>
                <ListItem>
                  Verify the Start, Cliff and Duration are correct
                </ListItem>
                <ListItem>
                  Send the ERC20 tokens to be vested to{" "}
                  <Link
                    href={`https://etherscan.io/address/${vesterAddress}`}
                    isExternal
                  >
                    {vesterAddress} <ExternalLinkIcon mx="2px" />
                  </Link>
                </ListItem>
              </OrderedList>
            </>
          )}
        </Flex>
      </Flex>
    </Page>
  )
}
