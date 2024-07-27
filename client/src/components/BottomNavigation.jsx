import React from 'react';
import { Box, IconButton, ThemeProvider, createTheme, Stack } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import CallEndIcon from '@mui/icons-material/CallEnd';
import PeopleIcon from '@mui/icons-material/People';
import ChatIcon from '@mui/icons-material/Chat';
import MicOffIcon from '@mui/icons-material/MicOff';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#1c1c1c',
      paper: '#1c1c1c',
    },
    text: {
      primary: '#ffffff',
    },
  },
});

const BottomNavigation = ({setOpenCamera, setOpenMic, openMic, openCamera, setEndCall}) => {
    const handleCameraToggle = () => {
        setOpenCamera(prevState => !prevState);
      };
    const handleMicToggle = () => {
        setOpenMic(prevState => !prevState)
    }
  return (
    <ThemeProvider theme={darkTheme}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 16,
          left: '50%',
          transform: 'translateX(-50%)',
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderRadius: 2,
          boxShadow: 3,
          p: 1,
          zIndex: 10,
        }}
      >
        <Stack direction="row" spacing={4} justifyContent="center">
          <IconButton color="inherit" onClick={handleMicToggle}>
            {openMic ? <MicOffIcon/> :<MicIcon />}
          </IconButton>
          <IconButton color="inherit" onClick={handleCameraToggle}>
            {openCamera ? <VideocamOffIcon /> : <VideocamIcon />}
          </IconButton>
          <IconButton color="inherit">
            <ChatIcon />
          </IconButton>
          <IconButton color="inherit">
            <PeopleIcon />
          </IconButton>
          <IconButton color="inherit" sx={{backgroundColor: 'red'}} onClick={setEndCall}>
            <CallEndIcon />
          </IconButton>
        </Stack>
      </Box>
    </ThemeProvider>
  );
};

export default BottomNavigation;
