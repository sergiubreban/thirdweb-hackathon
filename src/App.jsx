import { useWeb3 } from "@3rdweb/hooks";
import { useEffect, useRef, useState } from "react";
import Dashboard from "./components/Dashboard";
import { UnsupportedChainIdError } from "@web3-react/core";
import { useBundleDropModule, useSdk } from "./context";
import Menu from "./components/Menu";
import { Box, Text, Button, Center, Heading, Stack, Flex } from "@chakra-ui/react";


const App = () => {
  const bundleDropModule = useBundleDropModule();
  const sdk = useSdk();
  const { connectWallet, address, error, provider } = useWeb3();
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const signer = provider?.getSigner?.();
  const landingRef = useRef();

  useEffect(() => {
    // We pass the signer to the sdk, which enables us to interact with our deployed contract!
    sdk.setProviderOrSigner(signer);
  }, [sdk, signer]);

  useEffect(() => {
    // If they don't have an connected wallet, exit!
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
    <Menu hasClaimedNFT={ hasClaimedNFT } />
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
          <Box { ...(hasClaimedNFT && { className: 'disappear' }) } ref={ landingRef }><Landing networkError={ error instanceof UnsupportedChainIdError } onNftClaimed={ () => setHasClaimedNFT(true) } /></Box>
        }
      </Box>
      <Box flex='1' { ...(!hasClaimedNFT && { bg: '#1A202C' }) } transition='background 1s linear'>
        <Box h='3px' w='100%' bg='#fff' boxShadow={ 'inset 0 0 0.5em 0 #fff, 0 0 0.5em 0 #fff' } />
        { hasClaimedNFT && <Box p='4'><Dashboard /> </Box> }
      </Box>

    </Flex>
  </>
};

const Landing = ({ onNftClaimed, networkError }) => {
  const [isClaiming, setIsClaiming] = useState(false);
  const bundleDropModule = useBundleDropModule();

  const mintNft = () => {
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
    bundleDropModule
      .claim("0", 1)
      .then(() => {
        // Set claim state.
        onNftClaimed();
        // Show user their fancy new NFT!
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
        <Text maxW='700px'>This portal offers you the opportinity to vote music inside a category. In this way we can create top song lists based on community trend. To participate in a voting pool you need to prove your DAO membership with our special NFT.
          When you propose good music to our community you will be rewarded with 1000 BRBM.
        </Text>
      </Center>
    </Stack>
    <Stack spacing={ 2 } marginTop='20vh'>
      <Box position='relative' mx='3'>
        <div className="now playing" id="music">
          <span className="bar n1">A</span>
          <span className="bar n2">B</span>
          <span className="bar n3">c</span>
          <span className="bar n4">D</span>
          <span className="bar n5">E</span>
          <span className="bar n6">F</span>
          <span className="bar n7">G</span>
          <span className="bar n8">H</span>
          <span className="bar n1">A</span>
          <span className="bar n2">B</span>
          <span className="bar n3">c</span>
          <span className="bar n4">D</span>
          <span className="bar n5">E</span>
          <span className="bar n6">F</span>
          <span className="bar n7">G</span>
          <span className="bar n8">H</span>
        </div>
      </Box>
      <Box marginTop='40px'>
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
  return (
    <Box mt='10vh'>
      <Text as='h2' textStyle='h2' fontWeight='600'>Please connect to Rinkeby</Text>
      <Text fontWeight='600'>
        This dapp only works on the Rinkeby network, please switch networks
        in your connected wallet.
      </Text>
    </Box>
  );
}
export default App;
