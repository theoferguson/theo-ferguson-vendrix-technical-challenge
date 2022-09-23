import express, { NextFunction, Response, Request } from 'express';
import { createClient } from 'redis';
import fetch from 'cross-fetch';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import { GET_PAYMENT_CARD_BY_ID } from 'graphql/GetPaymentCardById';
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
// -------------------------------------------------------------
// -------------------------------------------------------------

const app = express();

// Body Parser
app.use(express.json());
let redisClient: any;

(async () => {
  redisClient = createClient();

  redisClient.on('error', (error: unknown) =>
    console.error(`Error : ${error}`)
  );

  await redisClient.connect();
})();

app.use('/', async (req: Request, res: Response, next: NextFunction) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // Send response to OPTIONS requests
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    return res.status(204).send('');
  }
  next();
});

app.use('/users', async (req: Request, res: Response, next: NextFunction) => {
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'GET') {
    const cacheResults = await redisClient.get('users');
    if (cacheResults) {
      console.log('cached users', { data: JSON.parse(cacheResults) });
      return res.status(200).json({
        data: JSON.parse(cacheResults),
      });
    } else {
      console.log('no cached users');
      return res.status(200).json({
        data: [],
      });
    }
  }
  next();
});

/**
 * Second Phase Stub Out
 *
 * TODO: implement endpoint
 */

app.use('/cards/:cardId', async (req: Request, res: Response, next: NextFunction) => {

  const client = new ApolloClient({
    link: new HttpLink({ uri: 'https://api.us.highnoteplatform.com/graphql', fetch }),
    cache: new InMemoryCache(),
    headers: {
      'Content-Type': 'application/json',
      authorization: `Basic ${process.env.HIGHNOTE_API_KEY}`,
    },
  });

  const results = await client.query({ 
    query: GET_PAYMENT_CARD_BY_ID,
    variables: { paymentCardId: process.env.DEV_TEST_CARD }
  });

  if (results) {
    return res.status(200).json({
      data: JSON.parse(results.data),
    });
  } else {
    return results
  }
}
);

app.use('/', async (req: Request, res: Response, next: NextFunction) => {
  res.set('Access-Control-Allow-Origin', '*');
  const cacheResults = await redisClient.get('users');
  if (cacheResults) {
    await redisClient.set(
      'users',
      JSON.stringify([...JSON.parse(cacheResults)])
    );
    const updatedData = await redisClient.get('users');

    console.log('updated cached users', { data: req.body });
    return res.status(200).json({
      data: JSON.parse(updatedData),
    });
  } else {
    await redisClient.set('users', JSON.stringify([req.body]));
    const updatedData = await redisClient.get('users');

    console.log('initiated users', { data: JSON.parse(updatedData) });
    return res.status(200).json({
      data: JSON.parse(updatedData),
    });
  }
});

export default app;

