import { Box, Container, Flex, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Login from '../components/Authentication/Login'
import Signup from '../components/Authentication/Signup'
import { useNavigate } from 'react-router-dom'

function Homepage() 
{
  const navigate = useNavigate()

  useEffect(()=>{
      const userInfo = JSON.parse(localStorage.getItem("userInfo"))
     
      if(!userInfo) navigate('/chats')
  },[navigate])


  return (
    <Container maxw='xl' centerContent marginBottom="5px">
      <Flex w="100%" d="flex" justifyContent="center"  alignItems="center" p={3} bg="white"  m="40px 0 15px 0" borderRadius="lg" borderWidth="1px">
            <Text fontSize="4xl" fontFamily="Work sans" >
                  Real-Time-Chat-App
            </Text>
      </Flex>
      
       <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
          <Tabs isFitted variant="soft-rounded">
              <TabList mb="1em">
                  <Tab>Login</Tab>
                  <Tab>Sign Up</Tab>
              </TabList>
              <TabPanels>
                  <TabPanel>
                       <Login/>
                  </TabPanel>
                  <TabPanel>
                      <Signup/>
                  </TabPanel>
              </TabPanels>
            </Tabs>
       </Box>
    </Container>
  )
}

export default Homepage