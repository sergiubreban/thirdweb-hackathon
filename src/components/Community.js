import { ethers } from "ethers";
import { Box, Center, Flex, Heading, IconButton, Image, Link, Stack, Table, Tbody, Td, Text, Th, Thead, Tr, useColorMode } from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import { useBundleDropModule, useTokenModule } from "../context";
import Address from "./Address";
import { BsTwitter, BsGithub, BsMedium, BsLinkedin } from 'react-icons/bs';
import { BiWorld } from 'react-icons/bi';

const Community = () => {
  const tokenModule = useTokenModule()
  const bundleDropModule = useBundleDropModule();
  const [memberAddresses, setMemberAddresses] = useState([]);
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  const { colorMode } = useColorMode();

  const memberList = useMemo(() => {
    return memberAddresses.concat(['trest', 'trest1', 'trest2', 'trest3', 'trest212', 'trest3234', 'trest22', 'trest36', 'trest3623', 'trest361', 'trest36122', 'trest362345', 'trest36111', 'trest362324']).map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // If the address isn't in memberTokenAmounts, it means they don't
          // hold any of our token.
          memberTokenAmounts[address] || 0,
          18,
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  // This useEffect grabs the # of token each member holds.
  useEffect(() => {
    // Grab all the balances.
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log("👜 Amounts", amounts)
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error("failed to get token amounts", err);
      });
  }, [tokenModule]);

  useEffect(() => {
    // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT
    // with tokenId 0.
    bundleDropModule
      .getAllClaimerAddresses("0")
      .then((addresess) => {
        console.log("🚀 Members addresses", addresess)
        setMemberAddresses(addresess);
      })
      .catch((err) => {
        console.error("failed to get member list", err);
      });
  }, [bundleDropModule]);

  return <Flex >
    <Stack flex='1' m='3' spacing={ 3 }>

      <Box color='#fff' bg={ colorMode === 'light' ? '#1A202Ced' : `#008fee10` } margin='12px' borderRadius='15px' p='4' flex='1' >
        <Center>
          <Stack direction='row' spacing={ 2 }><Text>Author:</Text> <Text fontWeight='600'>Sergiu Breban</Text></Stack>
          <Stack direction='row' mx='2'>
            <Link href='https://breban.ro' target='_blank'><IconButton aria-label='linkedin' borderRadius='25px' _hover={ { bg: '#1A202C44' } } icon={ <BiWorld /> } color='dark' /></Link>
            <Link href='https://www.linkedin.com/in/sergiu-breban-13ba63b1/' target='_blank'><IconButton aria-label='linkedin' borderRadius='25px' _hover={ { bg: '#1A202C44' } } icon={ <BsLinkedin /> } color='dark' /></Link>
            <Link href='https://sergiubreban.medium.com/' target='_blank'><IconButton aria-label='medium' borderRadius='25px' _hover={ { bg: '#1A202C44' } } icon={ <BsMedium /> } color='dark' /></Link>
            <Link href='https://github.com/sergiubreban' target='_blank'><IconButton aria-label='github' borderRadius='25px' _hover={ { bg: '#1A202C44' } } icon={ <BsGithub /> } color='dark' /></Link>
            <Link href='https://twitter.com/SergiuBreban' target='_blank'><IconButton aria-label='twitter' borderRadius='25px' _hover={ { bg: '#1A202C44' } } icon={ <BsTwitter /> } color='dark' /></Link>

          </Stack>
        </Center>
      </Box>
      <Box color='#fff' bg={ colorMode === 'light' ? '#1A202Ced' : `#008fee10` } margin='12px' borderRadius='15px' p='4' flex='1' >
        <Center><Heading fontSize='1.2rem'>Member List</Heading></Center>
        <Table>
          <Thead>
            <Tr>
              <Th><Text color='#fff' >Address</Text></Th>
              <Th><Text color='#fff' >Token Amount</Text></Th>
            </Tr>
          </Thead>
          <Tbody>
            { memberList.map((member) => {
              return (
                <Tr key={ member.address }>
                  <Td><Address fontSize='.8rem' address={ member.address } /></Td>
                  <Td><Text fontSize='.8rem'>{ member.tokenAmount }</Text></Td>
                </Tr>
              );
            }) }
          </Tbody>
        </Table>
      </Box>
    </Stack>
    <Stack flex='1' position='sticky' top='5vh' alignItems='center' spacing={ 2 } h='330px' color='#fff' bg={ colorMode === 'light' ? '#1A202Ced' : `#008fee10` } margin='12px' borderRadius='15px' p='4' >
      <Link target='_blank' href={ `https://testnets.opensea.io/assets/${bundleDropModule.address}/0` }>Opensea NFT</Link>
      <Box border='1px solid #fff' className="rotate-animation"><Image h='250px' w='auto' src='https://ipfs.thirdweb.com/ipfs/QmSrUXP7wKp6NnunNhxrwDL7uEAzD1B3pQggQ1b1ZC1MCK/0' /></Box>
    </Stack>
  </Flex>
}

export default Community