import { Box, Tab, TabList, TabPanel, TabPanels, Tabs, Center, Container, Heading, Stack, Text } from "@chakra-ui/react";
import Community from "./Community";
import ProposalForm from "./ProposalForm";
import Proposals from "./Proposals";

const Dashboard = () => {

  return <Container maxW='6xl'>
    <Stack spacing='4'>
      <Center><Heading fontSize='3rem'>🎧 DAO BRB MUSIC</Heading></Center>
      <Center><Text>Congratulations on being a member</Text></Center>
      <ProposalForm />
    </Stack>
    <Box mt='5vh'>
      <Tabs>
        <TabList>
          <Tab>Music</Tab>
          <Tab>Community</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Proposals />
          </TabPanel>
          <TabPanel>
            <Community />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>

  </Container >
}
// 
export default Dashboard;