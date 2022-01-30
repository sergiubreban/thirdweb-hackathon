import { useWeb3 } from "@3rdweb/hooks";
import { Box, Button, Flex } from "@chakra-ui/react";
import { Stack, Text } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useEffect, useMemo, useState } from "react";
import { useTokenModule, useVoteModule } from "../context";
import { ProposalStateMapper } from "../dataMapper";
import { getYoutubeId } from "../utils";
import Address from "./Address";

const jsonParser = (data) => {
  try {
    return JSON.parse(data);
  } catch (error) {
    return {}
  }
}
const ProposalItem = (props) => {
  const { proposal } = props;
  const [isVoting, setIsVoting] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const tokenModule = useTokenModule()
  const voteModule = useVoteModule()
  console.log({ proposal })
  const { address } = useWeb3();
  useEffect(() => {
    // Check if the user has already voted on the first proposal.
    voteModule
      .hasVoted(proposal.proposalId, address)
      .then((hasVoted) => {
        setHasVoted(hasVoted);
      })
      .catch((err) => {
        console.error("failed to check if wallet has voted", err);
      });
  }, [proposal, address, setHasVoted, voteModule]);

  const voteProposal = async (type) => {
    const vote = {
      proposalId: proposal.proposalId,
      vote: type
    }

    try {
      const delegation = await tokenModule.getDelegationOf(address);
      if (delegation === ethers.constants.AddressZero) {
        await tokenModule.delegateTo(address);
      }
      try {
        // then we check if the proposal is open for voting (state === 1 means it is open)
        if (proposal.state === 1) {
          // if it is open for voting, we'll vote on it
          console.log("successfully voted", vote.proposalId, vote.vote);
          await voteModule.vote(vote.proposalId, vote.vote);
          setHasVoted(true);
        }
      } catch (err) {
        console.error("failed to vote", err);
      }
    } catch (err) {
      console.error("failed to delegate tokens");
    } finally {
      // in *either* case we need to set the isVoting state to false to enable the button again
      setIsVoting(false);
    }
  }

  const execute = async () => {
    try {
      if (proposal.state === 4) {
        setIsExecuting(true)
        await voteModule.execute(proposal.proposalId);
        console.log('executed')
      }
    } catch (err) {
      console.error("failed to execute votes", err);
    }
    setIsExecuting(false)
  }
  console.log({ proposal })
  const proposalDescription = proposal.description;
  const { link, amount, genre } = useMemo(() => jsonParser(proposalDescription), [proposalDescription])
  if (!link) {
    return null;
  }
  return <Stack spacing='5' boxShadow='inset 0 1px 0 0 rgba(255, 255, 255, 0.1)' border='1px solid #182738' borderRadius='15px' p='15px' m='4'>
    <Stack direction={ 'row' } spacing='1'>
      <Box bg={ `proposalStatus.genre` } px='1' borderRadius='5px'><Text color='#000'>{ genre }</Text></Box>
      <Box bg={ `proposalStatus.${proposal.state}` } px='1' borderRadius='5px'>{ ProposalStateMapper[proposal.state] }</Box>
      { hasVoted && <Box bg={ `proposalStatus.1` } px='1' borderRadius='5px'>voted</Box> }
    </Stack>
    <Flex justify='space-between'>
      <Text>Proposer: <Address address={ proposal.proposer } /></Text>
      <Text>Prize: { amount }</Text>
    </Flex>
    { link && <EmbedLink link={ link } /> }
    <Flex justify='space-around'>
      { hasVoted ? <Text>Already Voted</Text> :
        proposal.votes.map((vote) => (<Button variant='simple' key={ vote.type } isLoading={ isVoting } onClick={ () => voteProposal(vote.type) } >
          { vote.label }
        </Button>)
        ) }
      { proposal.state === 4 && <Button isLoading={ isExecuting } onClick={ () => execute() } >
        execute
      </Button> }
    </Flex>
  </Stack>
}

const EmbedLink = ({ link }) => {
  const youtubeId = getYoutubeId(link);
  const [show, setShow] = useState(false);

  return youtubeId ? <iframe title='youtube-iframe' src={ `https://www.youtube.com/embed/${youtubeId}` } width="100%" height="380" frameBorder="0" allowtransparency="true" allow="encrypted-media" /> :
    <>
      <Button onClick={ () => setShow(true) }>Go to song</Button>
      { show && <iframe title='spotify-iframe' src={ link } width="100%" height="380" frameBorder="0" allowtransparency="true" allow="encrypted-media" /> }
    </>
}

export default ProposalItem