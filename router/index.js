const express = require('express')
const router = express.Router()
const smartapp = require('../smartapp')
const fs = require('fs')
const {getDeviceInitialStatus} = require('../api/api')
const ids = require('../data/schema.json')

router.post('/', (req,res)=>{ 
  smartapp.handleHttpCallback(req,res)
})

router.get('/', (req,res)=>{
  res.sendStatus(200)
})

router.get('/status', async(req,res)=>{
  const result = await getDeviceInitialStatus()
  res.send(result)
})

module.exports = router