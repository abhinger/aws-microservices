import AWS from 'aws-sdk';
import createHttpError from 'http-errors';
import { v4 as uuid } from 'uuid';
import middleware from '../lib/middleware';
import { getBookByID } from './getBook';
import { updateStockById } from './updateStock';

const dynamodb = new AWS.DynamoDB.DocumentClient();

/**
 * placing a order
 *
 * @param {object} event containg all the information about the event execution ex: body, headers
 * @param {object} context containing some meta data of app
 * @return {object} inserted data in response
 */
async function placeOrder(event, context) {
  const { email: orderPlacedBy } = event.requestContext.authorizer;
  const { id: bookId } = event.pathParameters;
  const { quantity, address } = event.body;

  const book = await getBookByID(bookId);

  if (book.stock < quantity) {
    throw new createHttpError.Forbidden('Sotck unavailable');
  }

  const now = new Date();

  const order = {
    id: uuid(),
    bookId,
    orderPlacedBy,
    address,
    quantity,
    status: 'Not Delivered',
    totalAmount: +book.amount * +quantity,
    createdAt: now.toISOString(),
  };

  try {
    const stock = book.stock - quantity;
    await dynamodb
      .put({
        TableName: process.env.ORDER_TABLE_NAME,
        Item: order,
      })
      .promise();
    await updateStockById(bookId, stock);
  } catch (error) {
    throw new createHttpError.InternalServerError(error);
  }
  return {
    statusCode: 201,
    body: JSON.stringify(order),
  };
}

export const handler = middleware(placeOrder);
