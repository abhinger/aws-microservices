import AWS from 'aws-sdk';
import middleware from '../lib/middleware';
import createHttpError from 'http-errors';
import { getBookByID } from './getBook';

const dynamodb = new AWS.DynamoDB.DocumentClient();

/**
 * update stock of a book by id
 *
 * @param {object} event containg all the information about the event execution ex: body, headers
 * @param {object} context containing some meta data of app
 * @return {object} updated data in response
 */
async function updateStock(event, context) {
  const { id } = event.pathParameters;
  const { stock } = event.body;
  const book = await getBookByID(id);

  if (!book) {
    throw new createHttpError.NotFound('Not Found');
  }
  const params = {
    TableName: process.env.BOOK_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set stock = :stock',
    ExpressionAttributeValues: {
      ':stock': stock,
    },
    ReturnValues: 'ALL_NEW',
  };

  let updatedStock;
  try {
    const result = await dynamodb.update(params).promise();
    updatedStock = result.Attributes;
  } catch (error) {
    throw new createHttpError.InternalServerError(error);
  }
  if (!updatedStock) {
    throw new createHttpError.NotFound('Not Found');
  }
  return {
    statusCode: 200,
    body: JSON.stringify(updatedStock),
  };
}

export const handler = middleware(updateStock);
