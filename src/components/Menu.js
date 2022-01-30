import { Box, Button, Stack, useColorMode, Text } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

const Menu = ({ hasClaimedNFT }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = hasClaimedNFT || colorMode !== 'light' ? '#fff' : '#1A202C';
  return <Box h='10vh' w='100vw' { ...(hasClaimedNFT && { bg: '#1A202C' }) } transition='background 1s linear' >
    <Stack spacing={ 2 } direction='row-reverse' alignItems='center' h='100%' mx='4'>
      <Button variant='simple' onClick={ toggleColorMode }>
        { colorMode === 'light' ? <MoonIcon color={ textColor } /> : <SunIcon color={ textColor } /> }
      </Button>
      <a href='https://github.com/sergiubreban/thirdweb-hackathon' target='_blank' rel="noreferrer"><Text color={ textColor }>github</Text></a>
    </Stack>
  </Box>
}

export default Menu;