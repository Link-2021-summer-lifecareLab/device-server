const config = require('../config/config')
const SmartApp = require('@smartthings/smartapp');
const express = require('express')
const router = express.Router()
const axios = require('axios')
const baseUrl = 'https://api.smartthing.com';

const smartapp = new SmartApp()
    .configureI18n({updateFiles: true})
    // .permissions(['r:devices:*', 'x:devices:*', 'x:devices:*', 'i:deviceprofiles:*'])
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
                .name('스위치 선택')
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
    .updated(async(context, updateData)=>{
        // console.log(context.api.subscriptions)
        console.log(updateData)
        // await context.api.subscriptions.delete() // clear any existing configuration
        await context.api.subscriptions.subscribeToDevices(context.config.Door, '*', '*', 'DoorMonitorHandler')
        await context.api.subscriptions.subscribeToDevices(context.config.Hue, '*', '*', 'HueHandler');
        await context.api.subscriptions.subscribeToDevices(context.config.AirMonitor, '*', '*', 'AirMonitorHandler');
        await context.api.subscriptions.subscribeToDevices(context.config.SmartPlug, '*', '*', 'SmartPlugHandler');
        await context.api.subscriptions.subscribeToDevices(context.config.Motion, '*', '*', 'MotionHandler');
    })
    .subscribedEventHandler('DoorMonitorHandler', async (context, event) => {
      // console.log(context, event)
      console.log(event.value)
    })
    .subscribedEventHandler('HueHandler', async (context, event) => {
      // console.log(context, event)
      // console.log(event.value)
    })
    .subscribedEventHandler('AirMonitorHandler', async (context, event) => {
      // console.log(context, event)
      // console.log(event.value)
    })
    .subscribedEventHandler('SmartPlugHandler', async (context, event) => {
      // console.log(context, event)
      // console.log(event.value)
    })
    .subscribedEventHandler('MotionHandler', async (context, event) => {
      // console.log(context, event)
      // console.log(event.value)
    })
    
    .appId(config.APP_ID)
    .clientId(config.ClientID)
    .clientSecret(config.ClientSecret)
    .disableCustomDisplayName()
    // .enableEventLogging(2)

router.post('/', (req,res)=>{ 
  smartapp.handleHttpCallback(req,res)
//   axios.get(req.body.confirmationData.confirmationUrl)
})

router.get('/', (req,res)=>{
    // res.send('가을')
    res.sendStatus(200)
})

module.exports = router