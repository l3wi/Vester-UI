import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {
  Heading,
  Text,
  Flex,
  Divider,
  Checkbox,
  Input,
  Button
} from "@chakra-ui/react"

import { getUnixTime } from "date-fns"

import DatePicker from "../components/DatePicker"
import Head from "next/head"
import Page from "../components/page"
import { useWeb3 } from "../contexts/useWeb3"

export default function Mint() {
  const router = useRouter()

  const [beneficiary, setBeneficiary] = useState()
  const [start, setStart] = useState(new Date())
  const [cliff, setCliff] = useState(new Date())
  const [duration, setDuration] = useState("")
  const [revocable, setRevocable] = useState(true)

  const execute = () => {
    const obj = {
      beneficiary,
      start: getUnixTime(start),
      cliffDuration: getUnixTime(cliff),
      duration: duration * 86400,
      revocable
    }
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
          <Heading size="lg" color="gray.700">
            Mint a new Vester
          </Heading>
          <Text mt="2" color="gray.600">
            This UI helps you launch a new vesting contract, verify it on
            Etherscan and then transfer tokens to the newly created vesting
            contract.
          </Text>
          {/* <Divider my="3" /> */}

          <Text mt="3">Beneficiary:</Text>
          <Input
            placeholder="eg. 0xc0bebe...."
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
          />

          <Text mt="3">Start Date:</Text>
          <DatePicker selected={start} onChange={(e) => setStart(e)} />

          <Text mt="3">Cliff Length (Days):</Text>
          <DatePicker selected={cliff} onChange={(e) => setCliff(e)} />

          <Text mt="3">Vesting Duration (Days):</Text>
          <Input
            placeholder="eg. 365"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />

          <Checkbox
            mt="3"
            defaultIsChecked
            value={revocable}
            onChange={() => setRevocable(!revocable)}
          >
            is Revocable?
          </Checkbox>

          <Button colorScheme="green" mt="2">
            Review Details
          </Button>
        </Flex>
      </Flex>
    </Page>
  )
}
