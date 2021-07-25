const mqtt = require('mqtt')
const config = require('../config/config')
const mqttCLient  = mqtt.connect({
  protocol: 'mqtt',
  host: config.MQTT_BROKER_IP,
  port: config.MQTT_BROKER_PORT  
})

mqttCLient.on('connect', function () {
  console.log('MQTT 연결됨')
})

module.exports = mqttCLient