import React, { useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import { Box, Flex } from '@chakra-ui/react';
import SlideDrawer from '../components/miscellaneous/SlideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';
function ChatPage() 
{
  const [fetchAgain, setFetchAgain] = useState(false);

  const {user} = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <SlideDrawer />}
      <Flex d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
          {user && <MyChats fetchAgain={fetchAgain}   />}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}  />
          )}
      </Flex>
    </div>
  );

}

export default ChatPage