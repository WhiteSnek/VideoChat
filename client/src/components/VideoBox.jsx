import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Avatar } from "@mui/material";
import { usePeer } from "../providers/Peer";
import { useSocket } from "../providers/SocketProvider";

const VideoBox = ({ openCamera, openMic, username }) => {
  const { peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream } = usePeer();
  const { socket } = useSocket();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const streamRef = useRef(null);
  const [remoteName, setRemoteName] = useState();
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const [avatarColor, setAvatarColor] = useState(getRandomColor());

  useEffect(() => {
    const playVideo = async () => {
      try {
        const constraints = { video: openCamera, audio: openMic };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const videoElement = localVideoRef.current;
        videoElement.srcObject = stream;
        streamRef.current = stream;
        sendStream(stream);
        console.log("Local MediaStream:", stream);
        console.log("Remote Stream:", remoteStream)
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    if (openCamera || openMic) {
      playVideo();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        localVideoRef.current.srcObject = null;
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [openCamera, openMic ]);

  const handleRoomJoin = useCallback(async ({ room, name }) => {
    try {
      const offer = await createOffer();
      console.log("Offer created:", offer);
      socket.emit('call-user', { name, offer });
      setRemoteName(name);
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  }, [createOffer, socket]);

  const handleIncomingCall = useCallback(async ({ from, offer }) => {
    try {
      const answer = await createAnswer(offer);
      console.log("Answer created:", answer);
      socket.emit('call-accepted', { name: from, answer });
    } catch (error) {
      console.error("Error creating answer:", error);
    }
  }, [createAnswer, socket]);

  const handleCallAccept = useCallback(async ({ answer }) => {
    try {
      if (peer.signalingState === "have-remote-offer" || peer.signalingState === "have-local-offer") {
        await setRemoteAnswer(answer);
        console.log("Call accepted:", answer);
      } else {
        console.warn("Peer connection is not in the correct state to set the remote answer.");
      }
    } catch (error) {
      console.error("Error setting remote answer:", error);
    }
  }, [peer, setRemoteAnswer]);

  useEffect(() => {
    socket.on("room-joined", handleRoomJoin);
    socket.on("incoming-call", handleIncomingCall);
    socket.on('call-accepted', handleCallAccept);

    return () => {
      socket.off("room-joined", handleRoomJoin);
      socket.off("incoming-call", handleIncomingCall);
      socket.off('call-accepted', handleCallAccept);
    };
  }, [handleRoomJoin, handleIncomingCall, handleCallAccept, socket]);

  useEffect(() => {
    if (remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStream;
      console.log("Remote stream: ", remoteStream)
      console.log("Remote MediaStream set.");
    }
  }, [remoteStream]);

  const handleNegotiation = useCallback(async () => {
    if (peer.signalingState === "stable") {
      try {
        const localOffer = await peer.createOffer();
        await peer.setLocalDescription(localOffer);
        socket.emit('call-user', { name: remoteName, offer: localOffer });
        console.log("Negotiation complete:", localOffer);
      } catch (error) {
        console.error("Error during negotiation:", error);
      }
    }
  }, [peer, socket, remoteName]);

  useEffect(() => {
    peer.addEventListener("negotiationneeded", handleNegotiation);
    return () => {
      peer.removeEventListener("negotiationneeded", handleNegotiation);
    };
  }, [handleNegotiation, peer]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: 'auto',
        aspectRatio: '16/9',
        backgroundColor: !openCamera ? 'grey.800' : 'transparent',
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!openCamera && (
        <Avatar
          sx={{
            width: 80,
            height: 80,
            bgcolor: avatarColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {username}
        </Avatar>
      )}
      <video
        ref={localVideoRef}
        autoPlay
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: openCamera ? 'block' : 'none',
        }}
      />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: remoteStream ? 'block' : 'none',
        }}
      />
    </Box>
  );
};

export default VideoBox;
