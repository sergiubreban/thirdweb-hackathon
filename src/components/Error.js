import { UnsupportedChainIdError } from "@web3-react/core";
import { useSwitchNetwork } from "@3rdweb/hooks";
import { Box, Text, Center, Heading } from "@chakra-ui/react";

const ErrorView = ({ error }) => {
  const { switchNetwork } = useSwitchNetwork();
  const isNetworkError = error instanceof UnsupportedChainIdError;

  return <Center m='8'>
    { isNetworkError ? <Box cursor='pointer' onClick={ () => switchNetwork(4) } color='#1A202C' p={ 3 } bg='linear-gradient(to bottom, #ff9500, #ff5e3a)' borderRadius='15px'>
      <Heading>Network error!</Heading>
      <Text>Click to change network to Rinkeby</Text>
    </Box> : <Box color='#1A202C' p={ 3 } bg='linear-gradient(to bottom, #ff9500, #ff5e3a)' borderRadius='15px'>
      <Heading>Unexpected Error</Heading>
    </Box> }
  </Center>
}
export default ErrorView