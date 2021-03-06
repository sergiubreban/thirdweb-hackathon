import { useWeb3 } from '@3rdweb/hooks'
import { Box, Button, Flex, useColorMode, Center, Heading, Stack, Text, Select, Skeleton } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useVoteModule } from '../context'
import { ProposalStateMapper } from '../dataMapper'
import { genres } from '../utils'
import ProposalItem from './ProposalItem'

const defaultPerPage = 3
const Proposals = () => {
  const { proposals } = useVoteModule()
  const [limit, setLimit] = useState(defaultPerPage)
  const [hasMore, setHasMore] = useState(true)
  const [filteredProposals, setFilteredProposals] = useState([])
  const [stateFilters, setStateFilters] = useState([0, 1, 3, 4])
  const [genreFilter, setGenreFilter] = useState(null)

  const { colorMode } = useColorMode()

  useEffect(() => {
    let filterList = [...proposals]
    if (stateFilters.length > 0 || genreFilter) {
      filterList = filterList?.filter?.(
        (p) => stateFilters.indexOf(p.state) > -1 && (!genreFilter || p.genre === genreFilter)
      )
    }

    setFilteredProposals(filterList)
    setHasMore(filterList.length > defaultPerPage)
  }, [proposals, stateFilters, genreFilter, setFilteredProposals])

  const { address } = useWeb3()

  const toggleStateFilter = (key) => {
    setStateFilters(stateFilters.indexOf(key) > -1 ? stateFilters.filter((f) => f !== key) : [...stateFilters, key])
  }

  const fetchMore = () => {
    const newLimit = limit + defaultPerPage

    setTimeout(() => {
      if (newLimit >= filteredProposals.length) {
        setHasMore(false)
      }
      setLimit(newLimit)
    }, 1000)
  }

  if (!address) {
    return null
  }

  return (
    <Flex
      direction="row"
      mt="6"
      spacing="2"
      color="#fff"
      bg={colorMode === 'light' ? '#1A202Ced' : `#008fee10`}
      borderRadius="15px"
      p="4"
    >
      <Box flex="1">
        <Box position="sticky" top="20px" p="3">
          <ProposalFilters
            stateFilters={stateFilters}
            toggleStateFilter={toggleStateFilter}
            genre={genreFilter}
            handleGenreChange={setGenreFilter}
          />
        </Box>
      </Box>
      <Box flex="3" className="proposal-list">
        <Center>
          <Text fontWeight="600">Go over proposals and vote if you are for or against it</Text>
        </Center>
        <Center mt="2">
          <Heading fontSize="1.4rem">Active Proposals</Heading>
        </Center>
        <InfiniteScroll
          dataLength={limit}
          next={fetchMore}
          hasMore={hasMore}
          loader={
            <Stack spacing={3} padding="20px" mt="40px">
              <Skeleton h="20px" />
              <Skeleton h="20px" />
              <Skeleton h="20px" />
            </Stack>
          }
          endMessage={
            <Box textAlign="center" m="20px">
              <b>Yay! You have seen it all</b>
            </Box>
          }
        >
          {filteredProposals.slice(0, limit).map((proposal, i) => (
            <ProposalItem key={`${proposal.proposalId}_${i}`} proposal={proposal} />
          ))}
        </InfiniteScroll>
      </Box>
    </Flex>
  )
}

const ProposalFilters = ({ stateFilters, genre, toggleStateFilter, handleGenreChange }) => {
  const [showLegend, setShowLegend] = useState(false)

  return (
    <Box className="proposal-filters">
      <Text my="4">Genre</Text>
      <Select value={genre ?? ''} onChange={(e) => handleGenreChange(e.target.value)} placeholder="All" w="220px">
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </Select>
      <Text my="4">State</Text>
      <Flex flexWrap="wrap">
        {[0, 1, 4, 3].map((key) => {
          // { Object.keys(ProposalStateMapper).map((key) => {
          const intKey = parseInt(key)

          return (
            <Button
              w="80px"
              size="xs"
              margin="0 10px 10px 0"
              key={key}
              bg={stateFilters.indexOf(intKey) > -1 ? `proposalStatus.${key}` : ''}
              onClick={() => toggleStateFilter(intKey)}
            >
              {ProposalStateMapper[key]}
            </Button>
          )
        })}
      </Flex>
      <Button variant="simple" mt="20px" size="xs" onClick={() => setShowLegend(!showLegend)}>
        <Text>{`${showLegend ? 'hide' : 'show'} legend`}</Text>
      </Button>
      {showLegend && (
        <Stack spacing="2" my="2" fontSize="10px">
          <Text>"Pending" - proposals that are just posted. These items becomes ready for voting is seconds</Text>
          <Text>"Active" - proposals ready for you to respond.</Text>
          <Text>"Succeeded" - succeeded proposals by vote</Text>
          <Text>"Defeated" - defeated proposals by vote</Text>
        </Stack>
      )}
    </Box>
  )
}

export default Proposals
