const axios = require('axios')
const config = require('../config/config')
const fs = require('fs')
const files = fs.readdirSync('./data/contextStore')
const installedAppConfig = require(`../data/contextStore/${files[0]}`)

const authedAxios = axios.create({
    headers: {
        Authorization: `Bearer ${installedAppConfig.authToken}`
    }
})

async function getDeviceInitialStatus(){
  return new Promise(async (resolve, reject)=>{
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
    resolve(result)
  }).catch(err=>{
      reject(err)
  })
  
}

function getSensorStatus(DEVICE_ID){
    return new Promise((resolve, reject)=>{        
            const url = `${config.URL}/${DEVICE_ID}/status`
            authedAxios.get(url).then((result)=>{
                const sensor = result.data.components.main
                resolve(sensor)
        }).catch((err)=>{
            if(err) {
                const err_message = `${err} 오류가 발생했습니다`
                reject(err_message)
            }
        })
    })
}

function getSensorDescription(DEVICE_ID){
    return new Promise((resolve, reject)=>{
        const url = `${config.URL}/${DEVICE_ID}`
        authedAxios.get(url).then((result)=>{
            resolve({
                deviceId: result.data.deviceId,
                label: result.data.label,
                categories: result.data.components[0].categories[0].name
            })
        })
    })
}

function changeStatus(DEVICE_ID, data){
    return new Promise((resolve, reject)=>{
        const url = `${config.URL}/${DEVICE_ID}/commands`
        
        data = {
            "commands": [{
                ...data
            }]
        }
        console.log(url, data)
        authedAxios.post(url, data).then(result=>{})
    }).catch((err)=>{
        if(err) {
            const err_message = `${err} 오류가 발생했습니다`
            reject(err_message)
        }
    })
}

module.exports = {getSensorStatus, getSensorDescription, changeStatus, getDeviceInitialStatus}