'use client'

import {Box, Stack, Modal, Typography, TextField, Button, Autocomplete} from "@mui/material"
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore'
import { CameraComponent } from "./camera.js"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #007EA7',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

const buttonStyle = {
  boxShadow: 6,
  p: 1,
  bgcolor: '#003249',
  '&:hover': {
    bgcolor: '#007EA7',
  },
  fontFamily: 'Monospace',
  color: '#ffffff'
}


export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  
  const handleSearch = (event, value) => {
    setSearchTerm(event.target.value);
    if (searchTerm == '') {
      setResults(inventory);
    } else {
      const filteredResults = inventory.filter(item =>
      item.name.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      setResults(filteredResults);
    }
  };
  
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() })
    })
    setInventory(inventoryList)
    setResults(inventoryList)
  }
  
  useEffect(() => {
    updateInventory()
  }, [])
  
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }
    await updateInventory()
  }
  
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }
  
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
      bgcolor={"#CCDBDC"}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Typography id="modal-modal-description" variant="h8" component="h5">
            Add with Item Name
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              sx = { buttonStyle }
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
          <Typography id="modal-modal-description" variant="h8" component="h5">
            Add with Photo
          </Typography>
          <CameraComponent />
        </Box>
      </Modal>
      <Box border={'5px solid #007EA7'} borderRadius={"8px"}>
        <Box
          width="800px"
          height="70px"
          bgcolor={'#9AD1D4'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
          borderBottom={'5px solid #007EA7'}
        >
          <Typography variant={'h4'} color={'#003249'} textAlign={'center'} fontFamily={'Inter'}>
            Inventory Items
          </Typography>
        </Box>
        <Box bgcolor={'#9AD1D4'} p={2}
        ><TextField
          label="Search"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          fullWidth
        /></Box>
        <Box bgcolor={"#9AD1D4"}>
        </Box>
        <Stack width="800px" height="300px" spacing={0} overflow={'auto'}>
          {results.map(({name, quantity}) => (
            <Box
              key={name}
              width="100%"
              minHeight="70px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#9AD1D4'}
              paddingX={4}
            >
              <Typography variant={'h5'} color={'#003249'} textAlign={'center'} fontFamily={'Inter'}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant={'h5'} color={'#003249'} textAlign={'center'} fontFamily={'Inter'}>
                Quantity: {quantity}
              </Typography>
              <Button variant="contained" sx = { buttonStyle } onClick={() => removeItem(name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
      <Button sx={ buttonStyle } variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
    </Box>
  )
  
}
