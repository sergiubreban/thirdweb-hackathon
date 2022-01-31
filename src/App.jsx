import { useSwitchNetwork, useWeb3 } from "@3rdweb/hooks";
import { useEffect, useRef, useState } from "react";
import Dashboard from "./components/Dashboard";
import { UnsupportedChainIdError } from "@web3-react/core";
import { useBundleDropModule, useSdk } from "./context";
import Menu from "./components/Menu";
import { Box, Text, Button, Center, Heading, Stack, Flex, useToast } from "@chakra-ui/react";
import RithmVisualizer from "./components/RithmVisualizer";
import Tour from 'reactour'


const App = () => {
  const bundleDropModule = useBundleDropModule();
  const sdk = useSdk();
  const { connectWallet, address, error, provider } = useWeb3();
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const signer = provider?.getSigner?.();
  const landingRef = useRef();
  const toast = useToast();

  useEffect(() => {
    sdk.setProviderOrSigner(signer);
  }, [sdk, signer]);

  useEffect(() => {
    if (!address) {
      return;
    }

    // Check if the user has the NFT by using bundleDropModule.balanceOf
    return bundleDropModule
      .balanceOf(address, "0")
      .then((balance) => {
        // If balance is greater than 0, they have our NFT!
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
        } else {
          setHasClaimedNFT(false);
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
      });
  }, [address, bundleDropModule, setHasClaimedNFT]);

  return <>
    <Menu hasClaimedNFT={ hasClaimedNFT } openTour={ () => setIsTourOpen(true) } />
    <Flex h='100vh' flexDirection='column'>
      <Box mb='2'>
        { !error && !address ? (<>
          <Center>
            <Heading>Welcome to MusicDAO</Heading>
          </Center>
          <Center><Button variant='outline' onClick={ () => connectWallet("injected") } className="btn-hero">
            Connect your wallet
          </Button>
          </Center>
        </>) :
          <Box { ...(hasClaimedNFT && { className: 'disappear' }) } ref={ landingRef }><Landing networkError={ error instanceof UnsupportedChainIdError } onNftClaimed={ () => {
            toast({
              title: 'Your just mint your NFT!',
              description: "No you have access to the platform!",
              status: 'success',
              duration: 9000,
              isClosable: true
            })
            setHasClaimedNFT(true)
            setTimeout(() => setIsTourOpen(true), 1000) // wait for the animation to end
          } } /></Box>
        }
      </Box>
      <Box flex='1' { ...(!hasClaimedNFT && { bg: '#1A202C' }) } transition='background 1s linear'>
        <Box h='3px' w='100%' bg='#fff' boxShadow={ 'inset 0 0 0.5em 0 #fff, 0 0 0.5em 0 #fff' } />
        { hasClaimedNFT && <Box p='4'>
          <Dashboard />
          <Tour
            steps={ steps }
            isOpen={ isTourOpen }
            onRequestClose={ () => setIsTourOpen(false) } />
        </Box> }
      </Box>

    </Flex>
  </>
};

const steps = [
  {
    selector: '.menu-actions',
    content: 'From here you can visit project Github Page for accessing the code or switch the Color Theme.',
  },
  {
    selector: '.comunity-tab',
    content: 'Here you can find informations about the community',
  },
  {
    selector: '.proposal-tab',
    content: 'Here you can find the music list!',
  },
  {
    selector: '.proposal-filters',
    content: 'You can filter the list using this panel.',
  },
  {
    selector: '.proposal-vote',
    content: 'You can vote the proposal here',
  },
  {
    selector: '.proposal-form',
    content: 'From here you can share your music to the community.',
  },
]

const Landing = ({ onNftClaimed, networkError }) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const bundleDropModule = useBundleDropModule();

  const mintNft = () => {
    setIsClaiming(true);
    bundleDropModule
      .claim("0", 1)
      .then(() => {
        onNftClaimed();
        console.log(
          `🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`
        );
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
            { networkError ? <NetworkError /> : <>
              <Text>Mint your free DAO Membership NFT</Text>
              <Button
                disabled={ isClaiming }
                onClick={ () => mintNft() }
              >
                { isClaiming ? "Minting..." : "Mint your nft (FREE)" }
              </Button>
            </> }
          </Stack>
        </Center>
      </Box>
    </Stack>
  </>
}
const NetworkError = () => {
  const { switchNetwork } = useSwitchNetwork();
  return (
    <Flex mt='10vh'>
      <Box flex='1'><Text as='h2' textStyle='h2' fontWeight='600'>Please connect to Rinkeby</Text>
        <Text fontWeight='600'>
          This dapp only works on the Rinkeby network, please switch networks
          in your connected wallet.
        </Text>
      </Box>
      <Box flex='1' position='relative' bottom={ 0 } cursor='pointer' onClick={ () => {
        console.log("switch")
        switchNetwork(4)
      } } color='#1A202C' p={ 3 } bg='linear-gradient(to bottom, #ff9500, #ff5e3a)' borderRadius='15px'>
        <Heading>Network error!</Heading>
        <Text>Click to change network to Rinkeby</Text>
      </Box>
    </Flex>
  );
}
export default App;
