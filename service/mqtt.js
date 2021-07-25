const mqtt = require('mqtt')
const config = require('../config/config')
const {changeStatus} = require('../api/api')

const mqttCLient  = mqtt.connect({
  protocol: 'mqtt',
  host: config.MQTT_BROKER_IP,
  port: config.MQTT_BROKER_PORT  
})

mqttCLient.on('connect', function () {
  console.log('MQTT 연결됨')
})
const topics = ['bulb/change', 'plug/change']
mqttCLient.subscribe(topics)

mqttCLient.on('message', (topic, data)=>{
  // console.log(topic, JSON.parse(data.toString()))
  let parsedData = JSON.parse(data.toString())
  const deviceId = parsedData.deviceId
  delete parsedData.deviceId
  changeStatus(deviceId, parsedData)
})

module.exports = mqttCLient