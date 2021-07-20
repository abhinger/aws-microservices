import AWS from 'aws-sdk';
import createHttpError from 'http-errors';
import middleware from '../lib/middleware';
import { getBookByID } from './getBook';

const dynamodb = new AWS.DynamoDB.DocumentClient();

/**
 * get orders by orderPlacedBy
 *
 * @param {object} event containg all the information about the event execution ex: body, headers
 * @param {object} context containing some meta data of app
 * @return {object} orders placed data in response
 */
async function getUserOrders(event, context) {
  const { email: orderPlacedBy } = event.requestContext.authorizer;
  let orders;
  try {
    const params = {
      TableName: process.env.ORDER_TABLE_NAME,
      IndexName: 'buyerEmail',
      KeyConditionExpression: 'orderPlacedBy = :orderPlacedBy',
      ExpressionAttributeValues: {
        ':orderPlacedBy': orderPlacedBy,
      },
    };
    const result = await dynamodb.query(params).promise();
    orders = result.Items;
  } catch (error) {
    throw new createHttpError.InternalServerError(error);
  }
  if (!orders) {
    throw new createHttpError.NotFound('No Order Placed');
  }
  const userOrders = await Promise.all(
    orders.map(async (order) => {
      const bookDetails = await getBookByID(order.bookId);
      return { ...order, bookdetails: { ...bookDetails } };
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify(userOrders),
  };
}
export const handler = middleware(getUserOrders);
