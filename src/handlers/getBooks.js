import AWS from 'aws-sdk';
import createHttpError from 'http-errors';
import middleware from '../lib/middleware';

const dynamodb = new AWS.DynamoDB.DocumentClient();

/**
 * get all books
 *
 * @param {object} event containg all the information about the event execution ex: body, headers
 * @param {object} context containing some meta data of app
 * @return {array} books array in response
 */
async function getBooks(event, context) {
  let books;
  try {
    const result = await dynamodb
      .scan({
        TableName: process.env.BOOK_TABLE_NAME,
      })
      .promise();
    books = result.Items;
  } catch (error) {
    throw new createHttpError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(books),
  };
}

export const handler = middleware(getBooks);
