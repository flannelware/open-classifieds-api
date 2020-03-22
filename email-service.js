var aws = require('aws-sdk');
var ses = new aws.SES({region: 'us-east-1'});

module.exports = {
    sendEmail: function sendEmail(emailAddress, data) {
        let params = {
            Destination: {
                ToAddresses: [emailAddress]
            },
            Message: {
                Body: {
                    Text: { Data: "Test"
                    }
                },
                
                Subject: { Data: "Test Email"
                }
            },
            Source: "sourceEmailAddress"
        };
    
        ses.sendEmail(params, function (err, data) {
            if (err) {
                console.log(err);
                context.fail(err);
            } else {
                console.log(data);
                context.succeed(event);
            }
        });
    },
}