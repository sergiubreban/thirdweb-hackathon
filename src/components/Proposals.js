import { useWeb3 } from "@3rdweb/hooks";
import { Box, Button, Flex, useColorMode, Center, Heading, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useVoteModule } from "../context";
import { ProposalStateMapper } from "../dataMapper";
import ProposalItem from "./ProposalItem";


const Proposals = () => {
  // const bundleDropModule = useBundleDropModule();
  const voteModule = useVoteModule()
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [activeFilters, setActiveFilters] = useState([1, 3, 4]); // default items to vote
  const { colorMode } = useColorMode();

  useEffect(() => {
    setFilteredProposals(activeFilters.length > 0 ? proposals?.filter?.((p) => activeFilters.indexOf(p.state) > -1) : proposals);
  }, [proposals, activeFilters, setFilteredProposals]);

  const { address } = useWeb3();

  // Retrieve all our existing proposals from the contract.
  useEffect(() => {
    // A simple call to voteModule.getAll() to grab the proposals.
    voteModule
      .getAll()
      .then((proposals) => {
        // Set state!
        setProposals(proposals);
        console.log("🌈 Proposals:", proposals)
      })
      .catch((err) => {
        console.error("failed to get proposals", err);
      });

  }, [voteModule, setProposals]);

  if (!address) {
    return null
  }

  const toggle = (key) => {
    setActiveFilters(activeFilters.indexOf(key) > -1 ? activeFilters.filter((f) => f !== key) : [...activeFilters, key])
  }

  return <Flex direction='row' mt='6' spacing='2' color='#fff' bg={ colorMode === 'light' ? '#1A202Ced' : `#008fee10` } borderRadius='15px' p='4'>
    <Box flex='1'>
      <Box position='sticky' top='20px' p='3' >
        <ProposalFilters activeFilters={ activeFilters } toggle={ toggle } />
      </Box>
    </Box>
    <Box flex='3'>
      <Center><Text fontWeight='600'>Go over proposals and vote if you are for or against it</Text></Center>
      <Center mt='2'><Heading fontSize='1.4rem'>Active Proposals</Heading></Center>
      { filteredProposals?.map?.((proposal) => <ProposalItem key={ proposal.proposalId } proposal={ proposal } />) }
    </Box >
  </Flex >
}

const ProposalFilters = ({ activeFilters, toggle }) => {
  const [showLegend, setShowLegend] = useState(false);

  return <>
    <Text mb='4'>Filter by proposal state</Text>
    <Flex flexWrap='wrap'>
      { [1, 4, 3].map((key) => {
        // { Object.keys(ProposalStateMapper).map((key) => {
        const intKey = parseInt(key);

        return <Button
          // flex={ ['40%', '30%', '20%'] }
          // flex='25%'
          w='80px'
          size='xs'
          margin='0 10px 10px 0'
          key={ key }
          bg={ activeFilters.indexOf(intKey) > -1 ? `proposalStatus.${key}` : '' }
          onClick={ () => toggle(intKey) }>
          { ProposalStateMapper[key] }
        </Button>
      }) }
    </Flex>
    <Button variant='simple' mt='20px' size='xs' onClick={ () => setShowLegend(!showLegend) }><Text>{ `${showLegend ? 'hide' : 'show'} legend` }</Text></Button>
    { showLegend && <Stack spacing='2' my='2' fontSize='10px'>
      <Text>"Active" - proposals ready for you to respond.</Text>
      <Text>"Succeeded" - succeeded proposals by vote</Text>
      <Text>"Defeated" - defeated proposals by vote</Text>
    </Stack> }
  </>
}

export default Proposals;