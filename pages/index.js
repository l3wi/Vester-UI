import React, { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { Flex } from "@chakra-ui/react"
import { Box, Heading, Text, Center, Link } from "@chakra-ui/layout"

import { SettingsIcon, EditIcon } from "@chakra-ui/icons"

import Head from "next/head"
import Page from "../components/page"

export default function Home() {
  const router = useRouter()
  return (
    <Page>
      <Head>
        <title>Vester</title>
        <link rel="icon" href="/favicon.png" />
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
          width={{ base: "100%", md: "460px" }}
          flexDirection="column"
          alignItems="center"
          onClick={() => router.push("/mint")}
        >
          <EditIcon w={"80px"} h={"80px"} color="blue.300" mb="3" />
          <Heading size="lg" color="gray.600">
            Create Vesting Contract
          </Heading>
        </Flex>
        <Flex
          shadow="xl"
          borderRadius="2xl"
          p={10}
          bg={"white"}
          width={{ base: "100%", md: "460px" }}
          flexDirection="column"
          alignItems="center"
          onClick={() => router.push("/manage")}
        >
          <SettingsIcon w={"80px"} h={"80px"} color="blue.300" mb="3" />
          <Heading size="lg" color="gray.600">
            Manage Vesting Contract
          </Heading>
        </Flex>
      </Flex>
    </Page>
  )
}
