import { useState } from "react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Flex,
  Box,
  Center,
  Image,
  Link,
  Heading,
  Text,
  useDisclosure,
  Button,
  Input,
  InputGroup,
  InputRightAddon,
  IconButton
} from "@chakra-ui/react"
import { AddIcon } from "@chakra-ui/icons"

import { getVesterInfo } from "../../utils/vester"
import useAlerts from "../../contexts/useAlerts"

export default function VesterModal({ func }) {
  const { addAlert } = useAlerts()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [address, setAddress] = useState("")
  const [token, setToken] = useState("")

  const add = async () => {
    try {
      const vesterData = await getVesterInfo(address, token)
      console.log(vesterData)
      func(address, token, vesterData)
      setAddress("")
      setToken("")
      onClose()
    } catch (error) {
      console.log(error)
      addAlert("fail", "Couldn't fetch data. Check inputs")
    }
  }

  return (
    <>
      <IconButton colorScheme="green" icon={<AddIcon />} onClick={onOpen} />

      <Modal
        isOpen={isOpen}
        onClose={onClose}
        isCentered
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add a Vester</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Vester Address:</Text>
            <Input
              placeholder="eg. 0xc0bebe...."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Text>Vested Token:</Text>
            <Input
              placeholder="eg. 0xc0bebe...."
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />

            <Button
              colorScheme="green"
              mt="2"
              onClick={() => add(address, token)}
            >
              Add Vester
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
