import { Text, Tooltip } from '@chakra-ui/react'
import { useState } from 'react'
import { shortenAddress } from '../utils'

const Address = ({ address, ...textProps }) => {
  const [short, setShort] = useState(true)

  return (
    <Tooltip label={short ? address : ''}>
      <Text as="span" {...textProps} display="inline" cursor="pointer" onClick={() => setShort(!short)}>
        {short ? shortenAddress(address) : address}
      </Text>
    </Tooltip>
  )
}

export default Address
