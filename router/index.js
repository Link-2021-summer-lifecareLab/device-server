const express = require('express')
const router = express.Router()
const smartapp = require('../smartapp')
const {getSensorStatus, getSensorDescription} = require('../api/api')
const ids = require('../data/schema.json')

router.post('/', (req,res)=>{ 
  smartapp.handleHttpCallback(req,res)
})

router.get('/', (req,res)=>{
  res.sendStatus(200)
})

router.get('/status', async (req,res)=>{
  const descriptions = await Promise.all(ids.map(id=>getSensorDescription(id)))
  const sensorData = await Promise.all(ids.map(id=>getSensorStatus(id)))
  let result = []
  
  for(let i=0;i<descriptions.length;i++){
    const data = {...descriptions[i], ...sensorData[i]}
    result.push(data)
  }
  res.send(result)
})

module.exports = router