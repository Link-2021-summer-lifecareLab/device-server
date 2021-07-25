const cors = require('cors')
const express = require('express');
const app = express();
const config = require('./config/config')
const router = require('./router/index')
const mqttCLient = require('./service/mqtt')

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cors())
app.use('/', router)

app.listen(config.PORT, () => console.log(`Server is up and running on port ${config.PORT}`));