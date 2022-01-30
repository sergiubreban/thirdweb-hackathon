import { Box } from "@chakra-ui/react";
import { useMemo, useState } from "react";

const RithmVisualizer = ({ bars }) => {
  const [playing, setPlaying] = useState(true)

  const elements = useMemo(() => new Array(bars).fill(null).map((_, i) => <Box style={ { animationDelay: `${Math.random() * 3}s` } } key={ i } as='span' className="bar" />), [bars]);
  return <Box className={ `playing ${!playing ? 'paused' : ''}` } onClick={ () => setPlaying(!playing) }>
    { elements }
  </Box>
}

export default RithmVisualizer;