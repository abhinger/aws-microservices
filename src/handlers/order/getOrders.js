import AWS from 'aws-sdk';
import createHttpError from 'http-errors';
import middleware from '../../lib/middleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

/**
 * get all orders
 *
 * @param {object} event containg all the information about the event execution ex: body, headers
 * @param {object} context containing some meta data of app
 * @return {array} orders array in response
 */
async function getOrders(event, context) {
  let orders;
  try {
    const result = await dynamodb
      .scan({
        TableName: process.env.ORDER_TABLE_NAME,
      })
      .promise();
    orders = result.Items;
  } catch (error) {
    throw new createHttpError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(orders),
  };
}

export const handler = middleware(getOrders);
