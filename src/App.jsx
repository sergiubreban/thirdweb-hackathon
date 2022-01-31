import { useWeb3 } from '@3rdweb/hooks'
import { useEffect, useState } from 'react'
import Dashboard from './components/Dashboard'
import { useBundleDropModule, useSdk } from './context'
import Menu from './components/Menu'
import { Box, Button, Center, Flex, useToast } from '@chakra-ui/react'
import Tour from 'reactour'
import Landing from './components/Landing'
import ErrorView from './components/Error'
import { tourSteps } from './tourSteps'

const App = () => {
  const bundleDropModule = useBundleDropModule()
  const sdk = useSdk()
  const { connectWallet, address, error, provider } = useWeb3()
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false)
  const [isTourOpen, setIsTourOpen] = useState(false)
  const signer = provider?.getSigner?.()
  const toast = useToast()

  useEffect(() => {
    sdk.setProviderOrSigner(signer)
  }, [sdk, signer])

  useEffect(() => {
    if (!address) {
      hasClaimedNFT && setHasClaimedNFT(false)
      return
    }

    return bundleDropModule
      .balanceOf(address, '0')
      .then((balance) => {
        if (balance.gt(0)) {
          setHasClaimedNFT(true)
        } else {
          setHasClaimedNFT(false)
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false)
      })
  }, [address, bundleDropModule, setHasClaimedNFT]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Menu hasClaimedNFT={hasClaimedNFT} openTour={() => setIsTourOpen(true)} />
      <Flex h="100vh" flexDirection="column">
        <Box mb="2">
          {(!!error || !address) && (
            <Center>
              <Button variant="outline" onClick={() => connectWallet('injected')} className="btn-hero">
                Connect your wallet
              </Button>
            </Center>
          )}
          <Box {...(hasClaimedNFT && { className: 'disappear' })}>
            <Landing
              address={address}
              onNftClaimed={() => {
                toast({
                  title: 'Your just mint your NFT!',
                  description: 'No you have access to the platform!',
                  status: 'success',
                  duration: 9000,
                  isClosable: true,
                })
                setHasClaimedNFT(true)
                setTimeout(() => setIsTourOpen(true), 1000) // wait for the animation to end
              }}
            />
          </Box>
        </Box>
        <Box flex="1" {...(!hasClaimedNFT && { bg: '#1A202C' })} transition="background 1s linear">
          {error && <ErrorView error={error} />}
          <Box h="3px" w="100%" bg="#fff" boxShadow={'inset 0 0 0.5em 0 #fff, 0 0 0.5em 0 #fff'} />
          {hasClaimedNFT && (
            <Box p="4">
              <Dashboard />
              <Tour steps={tourSteps} isOpen={isTourOpen} onRequestClose={() => setIsTourOpen(false)} />
            </Box>
          )}
        </Box>
      </Flex>
    </>
  )
}

export default App
