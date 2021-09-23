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
  Grid,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  IconButton,
  Select,
  Link
} from "@chakra-ui/react"
import {
  WarningTwoIcon,
  ArrowBackIcon,
  ExternalLinkIcon
} from "@chakra-ui/icons"
import Head from "next/head"
import Page from "../../components/page"
import VesterModal from "../../components/VesterModal"

import { useWeb3 } from "../../contexts/useWeb3"
import { useAlerts } from "../../contexts/useAlerts"
import useLocalStorage from "../../hooks/useLocalStorage"

import {
  getVesterInfo,
  updateDelegate,
  releaseTokens,
  transferBenificary,
  getTokens,
  getVesterToken
} from "../../utils/vester"
import { commas } from "../../utils/helpers"
import { ethers, utils } from "ethers"
import { format, fromUnixTime, add } from "date-fns"

export default function Manage() {
  const router = useRouter()
  const { address } = router.query
  const { addAlert, watchTx } = useAlerts()
  const { web3, connectWallet, disconnectWallet, account, balance } = useWeb3()

  const [data, setData] = useState(false)
  const [tokens, setTokens] = useState([])
  const [focusedToken, setFocusedToken] = useState(false)
  const [writable, setWritable] = useState({})

  const updateWritable = (key, data) => {
    setWritable({ ...writable, [key]: data })
  }

  //   const addVester = async (address, token, vesterData) => {
  //     if (watched.findIndex((item) => item.address === address) === -1) {
  //       setWatched([...watched, { address, token }])
  //       setData([...data, vesterData])
  //       addAlert("success", "Vester Added")
  //     }
  //   }

  //   const removeVester = (i) => {
  //     if (watched.length === 1) {
  //       setData([])
  //       setWatched([])
  //     } else {
  //       const newData = [...data.splice(i, 1)]
  //       const newWatched = [...watched.splice(i, 1)]
  //       console.log(newData)
  //       // setData()
  //       setWatched(newWatched)
  //     }
  //   }

  const execute = async (action, value) => {
    switch (action) {
      case "delegate":
        const delegateHash = await updateDelegate(
          address,
          focusedToken.address,
          value
        )
        watchTx(delegateHash)
        break
      case "release":
        const releaseHash = await releaseTokens(
          address,
          focusedToken.address,
          utils.parseEther(value.toString()).toString()
        )
        watchTx(releaseHash)

        break
      case "transfer":
        const tansferHash = await transferBenificary(address, value)
        watchTx(tansferHash)
        break
      default:
        break
    }
  }

  useEffect(async () => {
    if (address) {
      console.log(address)
      const data = await getVesterInfo(address)
      setData(data)
      console.log("Settings:", data)

      const tokens = await getTokens(address)
      if (tokens[0]) {
        const tokenInfo = await Promise.all(
          tokens.map((item) => getVesterToken(address, item))
        )
        console.log("Tokens:", tokenInfo)
        setTokens(tokenInfo)
      }
    }
  }, [address])

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
          width={{ base: "100%", md: "640px" }}
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex>
            <IconButton
              variant="ghost"
              aria-label="Back a page"
              icon={<ArrowBackIcon />}
              onClick={() => router.push("/")}
            />
            {address && (
              <Heading size="lg" color="gray.700">
                Contract:{" "}
                <Link
                  href={"https://etherscan.io/address/" + address}
                  isExternal
                >
                  {address.slice(0, 10)}... <ExternalLinkIcon mx="2px" />
                </Link>
              </Heading>
            )}
          </Flex>
          <Flex alignItems="center">
            {account === data.owner && <Badge colorScheme="red">OWNER</Badge>}
            {account === data.beneficiary && (
              <Badge colorScheme="green">BENEFICIARY</Badge>
            )}
            {account != data.beneficiary && account != data.owner && (
              <Badge>READ-ONLY</Badge>
            )}
          </Flex>
        </Flex>

        {data && (
          <Flex
            shadow="xl"
            borderRadius="2xl"
            p={5}
            mb="4"
            bg={"white"}
            width={{ base: "100%", md: "640px" }}
            flexDirection="column"
          >
            <Flex flexDirection="column">
              <Grid
                w="100%"
                justifyContent="space-between"
                templateColumns="repeat(3, min(160px))"
                gap={2}
              >
                <Stat>
                  <StatLabel>Owner</StatLabel>
                  <Link
                    href={"https://etherscan.io/address/" + data.owner}
                    isExternal
                  >
                    <StatNumber whiteSpace="nowrap">
                      {data.owner.slice(0, 8)}... <ExternalLinkIcon mx="2px" />
                    </StatNumber>
                  </Link>
                </Stat>
                <Stat>
                  <StatLabel>Beneficiary</StatLabel>
                  <Link
                    href={"https://etherscan.io/address/" + data.beneficiary}
                    isExternal
                  >
                    <StatNumber whiteSpace="nowrap">
                      {data.beneficiary.slice(0, 8)}...{" "}
                      <ExternalLinkIcon mx="2px" />
                    </StatNumber>
                  </Link>
                </Stat>
                <Stat>
                  <StatLabel>Is Revocable?</StatLabel>
                  <StatNumber whiteSpace="nowrap">
                    {data.revocable ? "True" : "False"}
                  </StatNumber>
                </Stat>
                {/* <Stat>
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
                  </Stat> */}
                <Stat>
                  <StatLabel>Start Date</StatLabel>
                  <StatNumber>
                    {format(fromUnixTime(data.start), "MM/dd/yyyy")}
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>Cliff Date</StatLabel>
                  <StatNumber>
                    {format(fromUnixTime(data.cliff), "MM/dd/yyyy")}
                  </StatNumber>
                </Stat>
                <Stat>
                  <StatLabel>End Date</StatLabel>
                  <StatNumber>
                    {format(
                      add(fromUnixTime(data.cliff), {
                        seconds: data.duration
                      }),
                      "MM/dd/yyyy"
                    )}
                  </StatNumber>
                </Stat>
              </Grid>
              <Heading size="md" color="gray.600" my="3">
                Tokens:
              </Heading>
              {tokens[0] ? (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Symbol</Th>
                      <Th isNumeric>Released</Th>
                      <Th isNumeric>Releasable</Th>
                      <Th isNumeric>Total Tokens</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {tokens &&
                      tokens.map((token) => (
                        <Tr key={token.address}>
                          <Td>{token.symbol}</Td>
                          <Td isNumeric whiteSpace="nowrap">
                            {commas(token.released)} {token.symbol}
                          </Td>
                          <Td isNumeric whiteSpace="nowrap">
                            {commas(token.releaseableAmount)} {token.symbol}
                          </Td>
                          <Td isNumeric whiteSpace="nowrap">
                            {commas(token.released + token.balance)}{" "}
                            {token.symbol}
                          </Td>
                        </Tr>
                      ))}
                  </Tbody>
                </Table>
              ) : (
                <>
                  <Text>
                    No tokens found in Vester. Send tokens to begin vesting
                  </Text>
                </>
              )}

              {account === data.beneficiary || account === data.owner ? (
                <Heading size="md" color="gray.600" my="3">
                  Writable:
                </Heading>
              ) : null}
              {account === data.beneficiary && (
                <>
                  <Box>
                    <Heading size="sm">Set Delegate</Heading>
                    <Flex>
                      <Input
                        placeholder="eg. 0xA3fe1..."
                        value={writable["delegate"]}
                        isInvalid={
                          writable["delegate"] != null &&
                          !ethers.utils.isAddress(writable["delegate"])
                        }
                        onChange={(e) =>
                          updateWritable("delegate", e.target.value)
                        }
                      />
                      <Button
                        onClick={() =>
                          execute("delegate", writable["delegate"])
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
                          writable["transfer"] != null &&
                          !ethers.utils.isAddress(writable["transfer"])
                        }
                        value={writable["transfer"]}
                        onChange={(e) =>
                          updateWritable("transfer", e.target.value)
                        }
                      />
                      <Button
                        onClick={() =>
                          execute("transfer", writable["transfer"])
                        }
                        ml="3"
                      >
                        Execute
                      </Button>
                    </Flex>
                  </Box>
                  <Box>
                    <Heading size="sm">
                      Release Tokens{" "}
                      {focusedToken && `(${focusedToken.symbol})`}
                    </Heading>
                    {!focusedToken ? (
                      <Select
                        placeholder="Select token"
                        onChange={(e) =>
                          setFocusedToken(
                            tokens.find((t) => t.symbol === e.target.value)
                          )
                        }
                      >
                        {tokens.map((token) => (
                          <option
                            key={"address" + token.symbol}
                            value={token.symbol}
                          >
                            {token.symbol}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Flex alignItems="center">
                        <InputGroup>
                          <Input
                            placeholder="eg. 34292.293"
                            pr="4rem"
                            value={writable["release"]}
                            onChange={(e) =>
                              updateWritable("release", e.target.value)
                            }
                          />
                          <InputRightElement width="4rem">
                            <Button
                              onClick={() =>
                                updateWritable(
                                  "release",
                                  focusedToken.releaseableAmount
                                )
                              }
                            >
                              Max
                            </Button>
                          </InputRightElement>
                        </InputGroup>

                        <Button
                          onClick={() =>
                            execute("release", writable["release"])
                          }
                          ml="3"
                        >
                          Execute
                        </Button>
                        <CloseButton
                          ml={2}
                          onClick={() => setFocusedToken(false)}
                        />
                      </Flex>
                    )}
                  </Box>
                </>
              )}
            </Flex>
          </Flex>
        )}
        {!data && (
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
