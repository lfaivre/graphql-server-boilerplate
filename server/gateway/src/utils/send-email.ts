import SparkPost from 'sparkpost';

const apiKey = process.env.SPARKPOST_API_KEY;
if (!apiKey) {
  console.log('NO SPARKPOST API KEY PROVIDED');
  // TODO :: Throw error if API key is not set
}

const client = new SparkPost(apiKey);

export const sendEmail = async (recipient: string, url: string): Promise<void> => {
  if (process.env.NODE_ENV !== 'test') {
    const response = await client.transmissions.send({
      options: {
        sandbox: true,
      },
      content: {
        from: 'testing@sparkpostbox.com',
        subject: 'Please confirm your email.',
        html: `<html><body><p>Confirm your email by clicking <span><a href="${url}">this link</a>.</span></p></body></html>`,
      },
      recipients: [{ address: recipient }],
    });
    console.log('EMAIL CLIENT RESPONSE:', response);
  }
};
