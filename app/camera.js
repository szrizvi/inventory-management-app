import React, { useState, useRef } from "react";
import { Stack, Button, Box, Hidden } from "@mui/material";
import { Camera } from "react-camera-pro";

const buttonStyle = {
  boxShadow: 6,
  p: 1,
  bgcolor: '#003249',
  '&:hover': {
    bgcolor: '#007EA7',
  },
  fontFamily: 'Monospace',
  color: '#ffffff',
};

export const CameraComponent = () => {
  const camera = useRef(null);
  const [image, setImage] = useState(null);
  const [photoTaken, setPhotoTaken] = useState(false);

  return (
    <Stack width="100%" spacing={2} direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
        { photoTaken ? (
            <>
                <Box width="100vw" height="200px" position="relative" border="1px solid #007EA7" borderRadius="8px" overflow="hidden">
                <img src={image} alt='Taken photo' />
                </Box>
                <Stack direction={'column'} spacing={2} justifyContent={'space-between'} alignItems={'center'}>
                <Button
                    variant="outlined"
                    sx={buttonStyle}
                    onClick={() =>  {
                        setPhotoTaken(false)
                        }
                    }
                >
                Retake Photo
                </Button>
                <Button
                    variant="outlined"
                    sx={buttonStyle}
                    onClick={() =>  {
                        console.log("TODO: Upload img to firebase + add item")
                        }
                    }
                >
                Add from Photo
                </Button>
                </Stack>
            </>
        ) : (
            <>
                <Box width="100vw" height="200px" position="relative" border="1px solid #007EA7" borderRadius="8px" overflow="hidden">
                    <Camera ref={camera} />
                </Box>
                <Button
                    variant="outlined"
                    sx={buttonStyle}
                    onClick={() =>  {
                        setImage(camera.current.takePhoto())
                        setPhotoTaken(true)
                    }
                    }
                >
                    Take Photo
                </Button>
            </>
        )   
    }
    </Stack>
  );
}
