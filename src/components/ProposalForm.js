import { Button, Input, Select, Stack, Tooltip } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useVoteModuleActions } from "../context";
import { WarningIcon } from '@chakra-ui/icons'

const genres = ['Hip Hop', 'Rock', 'Reggae', 'Country', 'Funk', 'Soul', 'Blues', 'electronic', 'Pop', 'Jazz', 'Disco', 'Vocal', 'Traditional', 'party']
const ProposalForm = () => {
  const [link, setLink] = useState('');
  const { addProposalVote } = useVoteModuleActions();
  const [genre, setGenre] = useState('');
  const linkRef = useRef(null)
  const genreRef = useRef(null)

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

  return <Stack direction='row' alignItems='center'>
    <Tooltip label='Copy / Paste a Youtube or Spotify link here! If your proposal wins the vote, you will win 1000 tokens! Each proposal can be voted within 24 hours(STOP VOTE after 24h).'>
      <WarningIcon />
    </Tooltip>
    <Input ref={ linkRef } type='text' placeholder="Youtube / Spotify Link" value={ link } onChange={ (e) => setLink(e.target.value) } />
    <Select ref={ genreRef } value={ genre } onChange={ (e) => setGenre(e.target.value) } placeholder='Select a genre' w='220px'>
      { genres.map((genre) => <option key={ genre } value={ genre }>{ genre }</option>) }
    </Select>
    <Button onClick={ (e) => {
      e.preventDefault();
      submitForm()
    } }>Propose</Button>
  </Stack>
}

export default ProposalForm;