const SmartApp = require('@smartthings/smartapp');

const smartapp = new SmartApp()
// If you do not have it yet, omit publicKey() - i.e. PING lifecycle
// Usage of '@' symbol informs SDK to fetch from local disk using `fs` package.
//  .publicKey('@smartthings_rsa.pub')
    .enableEventLogging(2)
    .page('mainPage', (context, page, configData) => {
        page
            .name('SmartApp Authorization Example')
            .complete(true)
            .section('my-section', section => {
                section
                    .paragraphSetting('my-paragraph')
                    .text('SmartApp Authorization Example')
                    .description('An example of how to authorize incoming SmartThings requests to your SmartApp.')

            })
    });

module.exports = smartapp
