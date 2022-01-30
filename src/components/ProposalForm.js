import { Button, Input, Select, Stack, Tooltip, useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useVoteModule } from "../context";
import { WarningIcon } from '@chakra-ui/icons'
import { genres } from "../utils";

const ProposalForm = () => {
  const [link, setLink] = useState('');
  const { actions: { addProposalVote, state } } = useVoteModule();
  const [genre, setGenre] = useState('');
  const linkRef = useRef(null)
  const genreRef = useRef(null)
  const toast = useToast()

  const submitForm = () => {
    if (genre && link) {
      addProposalVote({ link, genre });
      setLink('');
    } else if (!link) {
      linkRef.current.focus()
    } else if (!genre) {
      genreRef.current.focus()
    }
  }

  useEffect(() => {
    if (state === 'success') {
      toast({
        title: 'Proposal created.',
        description: "Your proposal is now in the blockchain, it will appear in the list a few seconds!",
        status: 'success',
        duration: 9000,
        isClosable: true
      })
    } else if (state === 'error') {
      toast({
        title: 'Proposal not created.',
        description: "An error has occured, please try again",
        status: 'error',
        duration: 9000,
        isClosable: true
      })
    }
  }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

  return <Stack direction='row' alignItems='center'>
    <Tooltip label='Copy / Paste a Youtube or Spotify link here! If your proposal wins the vote, you will win 1000 tokens! Each proposal can be voted within 24 hours(STOP VOTE after 24h).'>
      <WarningIcon />
    </Tooltip>
    <Input ref={ linkRef } type='text' placeholder="Youtube / Spotify Link" value={ link } onChange={ (e) => setLink(e.target.value) } />
    <Select ref={ genreRef } value={ genre } onChange={ (e) => setGenre(e.target.value) } placeholder='Select a genre' w='220px'>
      { genres.map((genre) => <option key={ genre } value={ genre }>{ genre }</option>) }
    </Select>
    <Button isLoading={ state === 'loading' } onClick={ (e) => {
      e.preventDefault();
      submitForm()
    } }>Propose</Button>
  </Stack>
}

export default ProposalForm;