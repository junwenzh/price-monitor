import AWS from 'aws-sdk';

interface EmailParams {
  to: string | string[];
  from: string;
  subject: string;
  item: string;
  url: string;
  targetPrice: number;
  oldPrice: number;
  currentPrice: number;
  unsubscribeUrl: string;
}

const awsConfig = {
  apiVersion: '2010-12-01',
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESSKEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESSKEY,
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
          Data: `
                <style>
                  .flex {
                    display: flex;
                  }
                  .flex-col {
                    flex-direction: column;
                  }
                  .justify-center {
                    justify-content: center;
                  }
                  .items-center {
                    align-items: center;
                  }
                  .shadow {
                    --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
                    --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
                    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
                  }
                  .bg-slate-100 {
                    --tw-bg-opacity: 1;
                    background-color: rgb(241 245 249 / var(--tw-bg-opacity)) /* #f1f5f9 */;
                  }
                  .py-4 {
                    padding-top: 1rem /* 16px */;
                    padding-bottom: 1rem /* 16px */;
                  }
                  .max-w-2xl {
                    max-width: 42rem /* 672px */;
                  }
                  .w-full {
                    width: 100%;
                  }
                  .text-lg {
                    font-size: 1.125rem /* 18px */;
                    line-height: 1.75rem /* 28px */;
                  }
                  .text-xl {
                    font-size: 1.25rem /* 20px */;
                    line-height: 1.75rem /* 28px */;
                  }
                  .font-bold {
                    font-weight: 700;
                  }
                  .font-semibold {
                    font-weight: 600;
                  }
                  .line-through {
                    text-decoration-line: line-through;
                  }
                </style>
                <div class="flex justify-center items-center">
                  <div class="flex flex-col gap-4 justify-center items-center shadow bg-slate-100 py-4 max-w-2xl w-full">
                    <header>
                      <h1 class="text-xl font-bold">Price Drop!</h1>
                    </header>
                    <main class="flex flex-col justify-center items-center">
                      <section class="product">
                        <h2 class="text-lg font-semibold">${emailParams.item}</h2>
                        <h2 class="text-lg font-semibold">${emailParams.currentPrice}</h2>
                        <p>
                          Price when tracked: 
                          <span class="line-through">${emailParams.oldPrice}</span>
                        </p>
                        <p>
                          Desired price: <span class="line-through">${emailParams.targetPrice}</span>
                        </p>
                        <a href='${emailParams.url}' class="text-lg font-semibold">
                          Buy Item
                        </a>
                      </section>
                      <section class="price-history"></section>
                    </main>
                    <footer>
                      <a href='${emailParams.unsubscribeUrl}'>Unsubscribe</a>
                    </footer>
                  </div>
                </div>
            `,
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
