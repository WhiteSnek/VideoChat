import React, { useState } from 'react';
import ChatBox from '../components/ChatBox';
import VideoBox from '../components/VideoBox';
import { Grid, Box } from '@mui/material';
import BottomNavigation from '../components/BottomNavigation'; // Adjust the import path as needed

const Home = () => {
  const [openCamera, setOpenCamera] = useState(false)
  const [openMic, setOpenMic] = useState(false)
  const [endCall, setEndCall] = useState(false)
  const [username,setUsername] = useState('')
  console.log(username)
  return (
    <Box sx={{ p: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={9}>
          <VideoBox openCamera={openCamera} openMic={openMic} username={username}/>
        </Grid>
        <Grid item xs={12} md={3}>
          <ChatBox endCall={endCall} setUsername={setUsername} />
        </Grid>
      </Grid>
      <BottomNavigation setOpenCamera={setOpenCamera} setOpenMic={setOpenMic} openCamera={openCamera} openMic={openMic} setEndCall={setEndCall} />
    </Box>
  );
};

export default Home;
