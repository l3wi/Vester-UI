import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {
  Heading,
  Text,
  Flex,
  Divider,
  Checkbox,
  Box,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  Stat,
  StatLabel,
  StatNumber,
  CloseButton,
  Badge,
  Grid
} from "@chakra-ui/react"
import { WarningTwoIcon } from "@chakra-ui/icons"
import Head from "next/head"
import Page from "../components/page"
import VesterModal from "../components/VesterModal"

import { useWeb3 } from "../contexts/useWeb3"
import { useAlerts } from "../contexts/useAlerts"
import useLocalStorage from "../hooks/useLocalStorage"

import {
  getVesterInfo,
  updateDelegate,
  releaseTokens,
  transferBenificary
} from "../utils/vester"
import { commas } from "../utils/helpers"
import { ethers } from "ethers"
import { format, fromUnixTime, add } from "date-fns"

export default function Manage() {
  const router = useRouter()
  const { addAlert, watchTx } = useAlerts()
  const { web3, connectWallet, disconnectWallet, account, balance } = useWeb3()

  const [watched, setWatched] = useLocalStorage("watched", [])
  const [data, setData] = useState([])

  const [writable, setWritable] = useState({})

  const updateWritable = (key, data) => {
    setWritable({ ...writable, [key]: data })
  }

  const addVester = async (address, token, vesterData) => {
    if (watched.findIndex((item) => item.address === address) === -1) {
      setWatched([...watched, { address, token }])
      setData([...data, vesterData])
      addAlert("success", "Vester Added")
    }
  }

  const removeVester = (i) => {
    if (watched.length === 1) {
      setData([])
      setWatched([])
    } else {
      const newData = [...data.splice(i, 1)]
      const newWatched = [...watched.splice(i, 1)]
      console.log(newData)
      // setData()
      setWatched(newWatched)
    }
  }

  const execute = async (i, action, value) => {
    switch (action) {
      case "delegate":
        const delegateHash = await updateDelegate(
          watched[i].address,
          watched[i].token,
          value
        )
        watchTx(delegateHash)
        break
      case "release":
        const releaseHash = await releaseTokens(
          watched[i].address,
          watched[i].token,
          value
        )
        watchTx(releaseHash)

        break
      case "transfer":
        const tansferHash = await transferBenificary(watched[i].address, value)
        watchTx(tansferHash)
        break
      default:
        break
    }
  }

  useEffect(async () => {
    const allData = await Promise.all(
      watched.map((item) => getVesterInfo(item.address, item.token))
    )
    setData(allData)
  }, [])

  return (
    <Page>
      <Head>
        <title>Manage a Vester</title>
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
          py={5}
          width={{ base: "100%", md: "600px" }}
          justifyContent="space-between"
        >
          <Heading size="lg" color="gray.700">
            Manage Vesting Contracts
          </Heading>
          <VesterModal func={addVester} />
        </Flex>

        {data[0] &&
          data.map((vester, i) => (
            <Flex
              shadow="xl"
              borderRadius="2xl"
              p={5}
              mb="4"
              bg={"white"}
              width={{ base: "100%", md: "600px" }}
              flexDirection="column"
              key={"vester" + i}
            >
              <Flex flexDirection="column">
                <Flex
                  w="100%"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Heading size="lg">
                    Contract: {watched[i].address.slice(0, 10)}...
                  </Heading>
                  <Flex alignItems="baseline">
                    {account === vester.owner && (
                      <Badge colorScheme="red">OWNER</Badge>
                    )}
                    {account === vester.beneficiary && (
                      <Badge colorScheme="green">BENEFICIARY</Badge>
                    )}
                    {account != vester.beneficiary &&
                      account != vester.owner && <Badge>READ-ONLY</Badge>}
                    <CloseButton ml={2} onClick={() => removeVester(i)} />
                  </Flex>
                </Flex>
                <Heading size="md" color="gray.600" my="3">
                  Readable:
                </Heading>
                <Grid
                  w="100%"
                  justifyContent="space-between"
                  templateColumns="repeat(3, min(160px))"
                  gap={2}
                >
                  <Stat>
                    <StatLabel>Owner</StatLabel>
                    <StatNumber>{vester.owner.slice(0, 8)}...</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Beneficiary</StatLabel>
                    <StatNumber>{vester.beneficiary.slice(0, 8)}...</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Is Revocable</StatLabel>
                    <StatNumber whiteSpace="nowrap">
                      {vester.revocable ? "True" : "False"}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Vested Token</StatLabel>
                    <StatNumber>{vester.symbol}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Released Tokens</StatLabel>
                    <StatNumber>{`${commas(vester.released)}`}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Releasable Token</StatLabel>
                    <StatNumber>{`${commas(
                      vester.releaseableAmount
                    )}`}</StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Start Date</StatLabel>
                    <StatNumber>
                      {format(fromUnixTime(vester.start), "MM/dd/yyyy")}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>Cliff Date</StatLabel>
                    <StatNumber>
                      {format(fromUnixTime(vester.cliff), "MM/dd/yyyy")}
                    </StatNumber>
                  </Stat>
                  <Stat>
                    <StatLabel>End Date</StatLabel>
                    <StatNumber>
                      {format(
                        add(fromUnixTime(vester.cliff), {
                          seconds: vester.duration
                        }),
                        "MM/dd/yyyy"
                      )}
                    </StatNumber>
                  </Stat>
                </Grid>
                {account === vester.beneficiary || account === vester.owner ? (
                  <Heading size="md" color="gray.600" my="3">
                    Writable:
                  </Heading>
                ) : null}
                {account === vester.beneficiary && (
                  <>
                    <Box>
                      <Heading size="sm">Set Delegate</Heading>
                      <Flex>
                        <Input
                          placeholder="eg. 0xA3fe1..."
                          value={writable[i + "delegate"]}
                          isInvalid={
                            writable[i + "delegate"] != null &&
                            !ethers.utils.isAddress(writable[i + "delegate"])
                          }
                          onChange={(e) =>
                            updateWritable(i + "delegate", e.target.value)
                          }
                        />
                        <Button
                          onClick={() =>
                            execute(i, "delegate", writable[i + "delegate"])
                          }
                          ml="3"
                        >
                          Execute
                        </Button>
                      </Flex>
                    </Box>
                    <Box>
                      <Heading size="sm">Release Tokens</Heading>
                      <Flex>
                        <InputGroup>
                          <Input
                            placeholder="eg. 34292.293"
                            pr="4rem"
                            value={writable[i + "release"]}
                            onChange={(e) =>
                              updateWritable(i + "release", e.target.value)
                            }
                          />
                          <InputRightElement width="4rem">
                            <Button
                              onClick={() =>
                                updateWritable(
                                  i + "release",
                                  vester.releaseableAmount
                                )
                              }
                            >
                              Max
                            </Button>
                          </InputRightElement>
                        </InputGroup>

                        <Button
                          onClick={() =>
                            execute(i, "release", writable[i + "release"])
                          }
                          ml="3"
                        >
                          Execute
                        </Button>
                      </Flex>
                    </Box>
                    <Box>
                      <Heading size="sm">Transfer Beneficiary</Heading>
                      <Flex>
                        <Input
                          placeholder="eg. 0xA3fe1..."
                          isInvalid={
                            writable[i + "transfer"] != null &&
                            !ethers.utils.isAddress(writable[i + "transfer"])
                          }
                          value={writable[i + "transfer"]}
                          onChange={(e) =>
                            updateWritable(i + "transfer", e.target.value)
                          }
                        />
                        <Button
                          onClick={() =>
                            execute(i, "transfer", writable[i + "transfer"])
                          }
                          ml="3"
                        >
                          Execute
                        </Button>
                      </Flex>
                    </Box>
                  </>
                )}
              </Flex>
            </Flex>
          ))}
        {!data[0] && (
          <Flex
            shadow="xl"
            borderRadius="2xl"
            p={10}
            bg={"white"}
            width={{ base: "100%", md: "600px" }}
            alignItems="center"
            flexDirection="column"
          >
            <WarningTwoIcon color="gray.500" w="120" h="120" />
            <Heading color="gray.500">No Vesters Found</Heading>
            <Heading color="gray.500" size="sm">
              Add some Vesters to begin by clicking the + button above
            </Heading>
          </Flex>
        )}
        <Flex>
          <Divider my="4" />
        </Flex>
      </Flex>
    </Page>
  )
}
