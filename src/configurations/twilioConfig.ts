// eslint-disable-next-line @typescript-eslint/no-var-requires
const Twilio = require('twilio');
import * as process from 'process';

// export default () => ({
//   //@ts-ignore
//   twilio: new Twilio(
//     process.env.TWILIO_ACCOUNT_SID,
//     process.env.TWILIO_AUTH_TOKEN,
//   ),
// });

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  },
  tw: new Twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN),
});
