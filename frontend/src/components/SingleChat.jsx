import { Box, Text } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import { FormControl, IconButton, Input, Spinner, useToast } from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from './config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModel';
import UpdateGrouptChatModel from './miscellaneous/UpdateGrouptChatModel';
import axios from 'axios';
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client"
import  Lottie from 'react-lottie'
import animationData from '../animations/typing.json'

const ENDPOINT = "https://real-time-chat-app-t6sb.onrender.com" ;
const socket = io(ENDPOINT);
var selectedChatCompare ;



function SingleChat({ fetchAgain, setFetchAgain }) 
{
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected,setsocketConnected] = useState(false)
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const toast = useToast();
    const { selectedChat, setSelectedChat, user,notification,setNotification } = ChatState()

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice",
        },
      };



    const fetchMessages = async () => 
    {
         if (!selectedChat) return;
    
        try 
        {
            const config = {
                headers: {
                Authorization: `Bearer ${user.token}`,
                },
            };
            setLoading(true);
            
            const { data } = await axios.get(
                `https://real-time-chat-app-t6sb.onrender.com/api/message/${selectedChat._id}`,
                config
            );
            setMessages(data)
            setLoading(false)
            socket.emit("join chat", selectedChat._id);
        } 
        catch (error) 
        {
           toast({title: "Error Occured!",description: "Failed to Load the Messages",status: "error",duration: 5000,isClosable: true,position: "bottom",});
        }
      };

    const sendMessage = async (event) => 
    {
        if (event.key === "Enter" && newMessage) 
        {
            socket.emit("stop typing", selectedChat._id);
            try 
            {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "https://real-time-chat-app-t6sb.onrender.com/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat,
                    },
                    config
                );
                // console.log(data)

                socket.emit("new message", data);
                setMessages([...messages, data]);
                console.log(messages)
            } 
            catch (error) 
            {
                toast({title: "Error Occured!",description: "Failed to send the Message",status: "error",duration: 5000,isClosable: true,position: "bottom",});
            }
          }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
    
        if (!socketConnected) 
           return;
    
        if (!typing) 
        {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => 
        {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) 
            {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
      };
  
    
    useEffect(() => 
    {
        socket.on("connect", () => {
            console.log("connected to the server of socket.io");
          });
        socket.emit("setup",user)
        socket.on('connected',()=>{
            setsocketConnected(true)
        })
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []) ;


    useEffect(() => {
        fetchMessages();
    
        selectedChatCompare = selectedChat;
        // eslint-disable-next-line
      }, [selectedChat]);


    

       
    useEffect(() => 
    {
        socket.on("message recieved", (newMessageRecieved) => 
        {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) 
            {
                if (!notification.includes(newMessageRecieved)) 
                {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } 
            else 
            {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    
      
    

    return (
        <>
          {selectedChat ? (
            <>
                <Text fontSize={{ base: "28px", md: "30px" }} pb={3} px={2} w="100%" fontFamily="Work sans" display="flex" justifyContent={{ base: "space-between" }} alignItems="center">
                    <IconButton display={{ base: "flex", md: "none" }} icon={<ArrowBackIcon />} onClick={() => setSelectedChat("")}/>
                     {(!selectedChat.isGroupChat ? 
                            (
                                <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal
                                    user={getSenderFull(user, selectedChat.users)}
                                />
                                </>
                            ) : (
                                <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGrouptChatModel

                                    fetchMessages={fetchMessages}
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                />
                                </>
                            ))
                        }
                </Text>
                
                <Box display="flex" flexDir="column" justifyContent="flex-end" p={3} bg="#E8E8E8" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
                    {loading ? (
                       <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto"/>
                    ) : (
                    <div className="messages">
                        <ScrollableChat messages={messages} />
                    </div>
                    )}
        
                    <FormControl onKeyDown={sendMessage} id="first-name" isRequired mt={3}>
                        {istyping ? (
                            <div>
                            <Lottie
                                options={defaultOptions}
                                // height={50}
                                width={70}
                                style={{ marginBottom: 15, marginLeft: 0 }}
                            />
                            </div>
                        ) : (
                            <></>
                        )}
                        <Input variant="filled" bg="#E0E0E0" placeholder="Enter a message.." value={newMessage} onChange={typingHandler}/>
                    </FormControl>
                </Box>
            </>
          ) : (
            // to get socket.io on same page
            <Box display="flex" alignItems="center" justifyContent="center" h="100%">
              <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                   Click on a user to start chatting
              </Text>
            </Box>
          )}
        </>
      );
}

export default SingleChat