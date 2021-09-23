import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"

import {
  Box,
  Flex,
  Heading,
  Text,
  Center,
  Link,
  Input,
  Button,
  Divider
} from "@chakra-ui/react"

import { ArrowForwardIcon, LockIcon, ExternalLinkIcon } from "@chakra-ui/icons"

import { utils } from "ethers"

import Head from "next/head"
import Page from "../components/page"
import useLocalStorage from "../hooks/useLocalStorage"

export default function Home() {
  const router = useRouter()
  const [watched, setWatched] = useLocalStorage("watched", [])
  const [address, setAddress] = useState("")

  const addWatched = () => {
    setWatched([...watched, address])
    router.push("/contract/" + address)
  }
  return (
    <Page>
      <Head>
        <title>Vester - Create token vesting contracts</title>
        <link rel="icon" href="/favicon.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:creator" content="@lewifree" />
        <meta property="og:url" content="https://vester.projects.sh" />
        <meta property="og:title" content="Vester" />
        <meta
          property="og:description"
          content="A simple way to create, view & manage vesting contracts from the browser."
        />
        <meta
          property="og:image"
          content="https://vester.projects.sh/image.png"
        />
      </Head>

      <Flex
        mt={{ base: 10, md: 20 }}
        w="100%"
        flexDirection={{ base: "column" }}
        alignItems="center"
        justifyContent="center"
      >
        <Flex
          shadow="xl"
          borderRadius="2xl"
          p={10}
          m="4"
          bg={"white"}
          width={{ base: "100%", md: "640px" }}
          flexDirection="column"
          // alignItems="center"
        >
          <Heading size="lg" color="gray.600">
            <LockIcon mr="2" mb="2" />
            Welcome to Vester
          </Heading>
          <Text>
            {"Create, manage, & view vesting using the "}
            <Link
              href="https://docs.openzeppelin.com/contracts/2.x/api/drafts#TokenVesting"
              isExternal
            >
              {`OpenZeppellin vesting contracts`}
              <ExternalLinkIcon mx="5px" />
            </Link>
          </Text>
        </Flex>
        <Flex
          shadow="xl"
          borderRadius="2xl"
          p={10}
          m="4"
          bg={"white"}
          width={{ base: "100%", md: "640px" }}
          flexDirection="column"
          // alignItems="center"
        >
          <Heading size="md">Mint new vesting contract</Heading>
          <Flex alignItems="center">
            <Text>Create your own vesting contract from your browser</Text>
            <Button
              colorScheme="green"
              onClick={() => router.push("/mint")}
              ml="3"
            >
              Go
              <ArrowForwardIcon ml="1" />
            </Button>
          </Flex>
          <Heading my="3" size="md">
            View/Manage Contract
          </Heading>
          <Flex>
            {" "}
            <Input
              placeholder="0xa47f02e...."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Button
              colorScheme="blue"
              isDisabled={address === "" || !utils.isAddress(address)}
              onClick={() => addWatched()}
              ml="3"
            >
              Go
              <ArrowForwardIcon ml="1" />
            </Button>
          </Flex>
          {watched[0] && (
            <>
              <Divider my="3" />
              {watched.map((item) => (
                <Button
                  key={item}
                  variant="ghost"
                  w="fit-content"
                  onClick={() => router.push("/contract/" + item)}
                >
                  <Text>{item}</Text>
                  <ArrowForwardIcon ml="1" />
                </Button>
              ))}
            </>
          )}
        </Flex>
      </Flex>
    </Page>
  )
}
