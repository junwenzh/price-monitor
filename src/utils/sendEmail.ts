import AWS from 'aws-sdk';

interface EmailParams {
  to: string | string[];
  from: string;
  subject: string;
  htmlBody: string;
}

const awsConfig = {
  apiVersion: '2010-12-01',
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
};

const ses = new AWS.SES(awsConfig);

async function sendEmail(emailParams: EmailParams) {
  const params = {
    Destination: {
      ToAddresses: Array.isArray(emailParams.to)
        ? emailParams.to
        : [emailParams.to],
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: emailParams.htmlBody || '',
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: emailParams.subject,
      },
    },
    Source: emailParams.from,
  };

  try {
    await ses.sendEmail(params).promise();
    return true;
  } catch (err) {
    console.error(
      `Error sending email to ${params.Destination.ToAddresses}`,
      err
    );
    return false;
  }
}

export default sendEmail;
