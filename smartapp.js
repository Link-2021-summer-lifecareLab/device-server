const FileContextStore = require('@smartthings/file-context-store')
const SmartApp = require('@smartthings/smartapp');
const fs= require('fs')

const config = require('./config/config')
const mqttClient = require('./service/mqtt')
const contextStore = new FileContextStore('./data/contextStore')

const smartapp = new SmartApp()
    .configureI18n({updateFiles: true})
    // .permissions(['r:devices:*', 'x:devices:*', 'x:devices:*', 'i:deviceprofiles:*'])
    .appId(config.APP_ID)
    .clientId(config.ClientID)
    .clientSecret(config.ClientSecret)
    .disableCustomDisplayName()
    .contextStore(contextStore)
    .page('mainPage', (context, page, configData) => {        
        page.name('디바이스 설정')
        page.section('문열림센서', section => {
            section
                .name('문열림센서')
                .deviceSetting('Door')
                .name('문열림센서 선택')
                .capabilities(['contactSensor']) // 문열림센서에 ContactSensor가 존재함
                .permissions('r')
                .multiple(true)
        });
        page.section('Philips Hue', section => {
            section
                .name('Philips Hue')
                .deviceSetting('Hue')
                .name('전구 선택')
                .capabilities(['colorControl'])
                .permissions('rx')
                .multiple(true)
        });
        page.section('에어모니터', section => {
          section
              .name('에어모니터')
              .deviceSetting('AirMonitor')
              .name('에어모니터 선택')
              .capabilities(['airQualitySensor'])
              .permissions('r')
              .multiple(true)
      });
      page.section('스마트 플러그', section => {
        section
            .name('스마트 플러그')
            .deviceSetting('SmartPlug')
            .name('스마트 플러그')
            .capabilities(['powerConsumptionReport'])
            .permissions('rx')
            .multiple(true)
    });
    page.section('움직임 센서', section => {
      section
          .name('움직임 센서')
          .deviceSetting('Motion')
          .name('움직임 센서')
          .capabilities(['motionSensor'])
          .permissions('r')
          .multiple(true)
    });
        page.complete(true)
    })
    .installed(async(context, installData)=>{
        await context.api.subscriptions.subscribeToDevices(context.config.Door, '*', '*', 'DoorMonitorHandler')
        await context.api.subscriptions.subscribeToDevices(context.config.Hue, '*', '*', 'HueHandler');
        await context.api.subscriptions.subscribeToDevices(context.config.AirMonitor, '*', '*', 'AirMonitorHandler');
        await context.api.subscriptions.subscribeToDevices(context.config.SmartPlug, '*', '*', 'SmartPlugHandler');
        await context.api.subscriptions.subscribeToDevices(context.config.Motion, '*', '*', 'MotionHandler');
        
    })
    // .updated(async(context, updateData)=>{
        
    // })
    .subscribedEventHandler('DoorMonitorHandler', async (context, event) => {
      mqttClient.publish('door/sensor_status', JSON.stringify(event))
    })
    .subscribedEventHandler('HueHandler', async (context, event) => {
      mqttClient.publish('bulb/sensor_status', JSON.stringify(event))
      console.log(event)
    })
    .subscribedEventHandler('AirMonitorHandler', async (context, event) => {
      mqttClient.publish('airmonitor/sensor_status', JSON.stringify(event))
    })
    .subscribedEventHandler('SmartPlugHandler', async (context, event) => {
      mqttClient.publish('plug/sensor_status', JSON.stringify(event))
    })
    .subscribedEventHandler('MotionHandler', async (context, event) => {
      mqttClient.publish('motion/sensor_status', JSON.stringify(event))
    })
    .uninstalled((context, uninstallData)=>{
      const files = fs.readdirSync('./data/contextStore')
      fs.rmSync(`./data/contextStore/${files[0]}`)
    })

module.exports = smartapp