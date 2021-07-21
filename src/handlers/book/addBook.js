import AWS from 'aws-sdk';
import createHttpError from 'http-errors';
import { v4 as uuid } from 'uuid';
import middleware from '../../lib/middleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

/**
 * creating a book
 *
 * @param {object} event containg all the information about the event execution ex: body, headers
 * @param {object} context containing some meta data of app
 * @return {object} inserted data in response
 */
async function addBook(event, context) {
  const { title, author, description, amount, rating, stock } = event.body;
  const now = new Date();
  const book = {
    id: uuid(),
    title,
    author,
    amount,
    description,
    rating,
    stock,
    createdAt: now.toISOString(),
  };

  try {
    await dynamodb
      .put({
        TableName: process.env.BOOK_TABLE_NAME,
        Item: book,
      })
      .promise();
  } catch (error) {
    throw new createHttpError.InternalServerError(error);
  }

  return {
    statusCode: 201,
    body: JSON.stringify(book),
  };
}

export const handler = middleware(addBook);
