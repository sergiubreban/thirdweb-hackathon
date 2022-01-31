
import RithmVisualizer from "./RithmVisualizer";
import { Box, Button, Stack, Center, Heading, Flex, useToast, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useBundleDropModule } from "../context";

const Landing = ({ address, onNftClaimed }) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const bundleDropModule = useBundleDropModule();
  const mintNft = () => {
    setIsClaiming(true);
    bundleDropModule
      .claim("0", 1)
      .then(() => {
        onNftClaimed();
      })
      .catch((err) => console.error("failed to claim", err))
      .finally(() => setIsClaiming(false));
  }
  return <>
    <Stack spacing={ 2 }>
      <Center>
        <Heading>Welcome to 🎧 Music DAO</Heading>
      </Center>
      <Center>
        <Text maxW='700px'>This portal offers you the opportinity to vote music while beeing part of an awesome community. In this way we can create top song lists based on community trend. To participate in a voting pool you need to prove your DAO membership with our special NFT.
          When you propose good music to our community you will be rewarded with 1000 BRBM.
        </Text>
      </Center>
    </Stack>
    <Stack spacing={ 2 } marginTop='20vh'>
      <Box position='relative' mx='3'>
        <Center ><RithmVisualizer bars={ 10 } /></Center>
      </Box>
      <Box marginTop='40px' position='relative'>
        <Center >
          <Stack spacing='2'>
            <Text>Mint your free DAO Membership NFT</Text>
            { !!address && <Button
              disabled={ isClaiming }
              onClick={ () => mintNft() }
            >
              { isClaiming ? "Minting..." : "Mint your nft (FREE)" }
            </Button> }
          </Stack>
        </Center>
      </Box>
    </Stack>
  </>
}

export default Landing;