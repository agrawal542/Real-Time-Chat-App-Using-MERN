import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() 
{
    const [show, setShow] = useState(false);
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [loading,setLoading] = useState(false) ;
    const toast = useToast()
    const navigate = useNavigate()

     
    const postDetails = (pics) => 
    {
         setLoading(true)
         if(pics === undefined)
         {
            toast({
              title: 'Please Select an Image.',
              status: 'warning',
              duration: 5000,
              isClosable: true,
              position : "bottom"
            })
            return  ;
         }
         if(pics.type === "image/jpeg" || pics === "image/png")
         {
              const formData = new FormData();
              formData.append('file', pics);
              formData.append('upload_preset', 'chat-app');
              formData.append('cloud_name', 'dpp9fyml5');
              axios.post('https://api.cloudinary.com/v1_1/dpp9fyml5/image/upload', formData)
                .then((response) => {
                  setPic(response.data.url);
                  console.log(response.data.url)
                  setLoading(false);
                })
                .catch((error) => {
                  console.error('Error uploading image to Cloudinary:', error);
                  setLoading(false);
                });
         }
         else {
          toast({
              title: "Please Select an Image!",
              status: "warning",
              duration: 5000,
              isClosable: true,
              position: "bottom",
          });
          setLoading(false);
          return;
        }
    };

   
    const submitHandler = async () => 
    {
         setLoading(true);
         if (!name || !email || !password || !confirmpassword) 
         {
            toast({title: "Please Fill all the Feilds",status: "warning",duration: 5000,isClosable: true,position: "bottom",});
            setLoading(false);
            return;
         }
         if (password !== confirmpassword) 
         {
            toast({ title: "Passwords Do Not Match", status: "warning", duration: 5000, isClosable: true, position: "bottom",});
            return;
         }
         console.log(name, email, password, pic);
        try 
        {
            const config = {
                headers: {
                  "Content-type": "application/json",
                  "Access-Control-Allow-Origin": "*"
                },
            };
            const { data } = await axios.post("https://real-time-chat-app-t6sb.onrender.com/api/user",{name,email,password,pic,},config);
            console.log(data);
            toast({title: "Registration Successful",status: "success",duration: 5000,isClosable: true,position: "bottom",});
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats")
        } 
        catch (error) 
        {
          toast({title: "Error Occured!",description: error.response.data.message,status: "error",duration: 5000,isClosable: true,position: "bottom",});
          setLoading(false);
        }
    };

  return (
   <VStack spacing="3px">
        <FormControl id='first-name' isRequired>
          <FormLabel>Name</FormLabel>
          <Input placeholder= "Enter Your Name" onChange={(e)=> setName(e.target.value)}></Input>
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input type="email" placeholder="Enter Your Email Address" onChange={(e) => setEmail(e.target.value)} />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input type={show ? "text" : "password"} placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />
            <InputRightElement width="4.5rem">
                  <Button onClick={()=>setShow(!show)} h="1.75rem" size="sm">
                      {show ? "Hide" : "Show"}
                  </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="Confirm-password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup size="md">
            <Input type={show ? "text" : "password"} placeholder="Confirm password" onChange={(e) => setConfirmpassword(e.target.value)} />
            <InputRightElement width="4.5rem">
                  <Button onClick={()=>setShow(!show)} h="1.75rem" size="sm" >
                      {show ? "Hide" : "Show"}
                  </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="pic">
            <FormLabel>Upload your Picture</FormLabel>
            <Input type="file" p={1.5} accept="image/*" onChange={(e) => postDetails(e.target.files[0])}/>
        </FormControl>

        <Button isLoading = {loading}  colorScheme="blue" width="100%" style={{ marginTop: 10 }} onClick={submitHandler} >
            Sign Up
        </Button>
   </VStack>
  )
}

export default Signup