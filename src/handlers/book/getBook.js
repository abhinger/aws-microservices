import validator from '@middy/validator';
import AWS from 'aws-sdk';
import createHttpError from 'http-errors';
import middleware from '../../lib/middleware';
import getBookSchema from '../../lib/schemas/getBookSchema';

const dynamodb = new AWS.DynamoDB.DocumentClient();

/**
 *
 *
 * @export
 * @param {string} id
 * @return {object} book data in response
 */
export async function getBookByID(id) {
  let book;

  try {
    const result = await dynamodb
      .get({
        TableName: process.env.BOOK_TABLE_NAME,
        Key: { id },
      })
      .promise();
    book = result.Item;
  } catch (error) {
    throw new createHttpError.InternalServerError(error);
  }

  if (!book) {
    throw new createHttpError.NotFound('Not Found');
  }

  return book;
}

/**
 * get a book by id
 *
 * @param {object} event containg all the information about the event execution ex: body, headers
 * @param {object} context containing some meta data of app
 * @return {object} book data in response
 */
async function getBook(event, context) {
  const { id } = event.pathParameters;
  const book = await getBookByID(id);

  return {
    statusCode: 200,
    body: JSON.stringify(book),
  };
}
export const handler = middleware(getBook).use(
  validator({
    inputSchema: getBookSchema,
    ajvOptions: {
      strict: false,
    },
  })
);
