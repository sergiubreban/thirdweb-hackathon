import { Box, Button, Stack, useColorMode, Text, Flex } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import RithmVisualizer from './RithmVisualizer'
import { useEffect, useState } from 'react'

const Menu = ({ hasClaimedNFT, openTour }) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const [showVisualizer, setShowVisualizer] = useState(false)
  const textColor = hasClaimedNFT || colorMode !== 'light' ? '#fff' : '#1A202C'

  useEffect(() => {
    setTimeout(() => setShowVisualizer(!!hasClaimedNFT), 1000)
  }, [hasClaimedNFT])

  return (
    <Box h="10vh" w="100vw" {...(hasClaimedNFT && { bg: '#1A202C' })} transition="background 1s linear">
      <Flex justify="center" h="100%" alignItems="flex-end" w="100%">
        {showVisualizer && <RithmVisualizer bars={10} />}
        <Stack
          spacing={2}
          position="absolute"
          direction="row-reverse"
          alignItems="center"
          top="3vh"
          right="0"
          mx="4"
          className="menu-actions"
        >
          <Button variant="simple" onClick={toggleColorMode}>
            {colorMode === 'light' ? <MoonIcon color={textColor} /> : <SunIcon color={textColor} />}
          </Button>
          <a href="https://github.com/sergiubreban/thirdweb-hackathon" target="_blank" rel="noreferrer">
            <Text color={textColor}>GitHub</Text>
          </a>
          {hasClaimedNFT && (
            <Text mx="2" onClick={() => openTour && openTour()} cursor="pointer" color={textColor}>
              Help
            </Text>
          )}
        </Stack>
      </Flex>
    </Box>
  )
}

export default Menu
