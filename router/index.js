const express = require('express')
const router = express.Router()
const smartapp = require('../smartapp')
const fs = require('fs')
const {getSensorStatus, getSensorDescription, } = require('../api/api')
const ids = require('../data/schema.json')
const { runInThisContext } = require('vm')

router.post('/', (req,res)=>{ 
  smartapp.handleHttpCallback(req,res)
})

router.get('/', (req,res)=>{
  res.sendStatus(200)
})

router.get('/test', async (req,res)=>{
  const descriptions = await Promise.all(ids.map(id=>getSensorDescription(id)))
  const sensorData = await Promise.all(ids.map(id=>getSensorStatus(id)))
  let result = []
  
  for(let i=0;i<descriptions.length;i++){
    const data = {...descriptions[i], ...sensorData[i]}
    result.push(data)
  }
  
  res.send(result)
})

router.get('/status', async(req,res)=>{
  const files = fs.readdirSync('./data/contextStore')
  const installedAppConfig = require(`../data/contextStore/${files[0]}`)
  
  const config = installedAppConfig.config
  const modules = Object.keys(config)
  let ids = []
  modules.forEach(module=>{
    ids = [...ids, ...config[module].map(device=>device.deviceConfig.deviceId)]
  })
  
  const descriptions = await Promise.all(ids.map(id=>getSensorDescription(id)))  
  const sensorData = await Promise.all(ids.map(id=>getSensorStatus(id)))
  let result = []
  for(let i=0; i<descriptions.length; i++){
    const data = {...descriptions[i], ...sensorData[i]}
    result.push(data)
  }
  res.send(result)
})

module.exports = router