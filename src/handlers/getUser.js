import middleware from '../lib/middleware';

/**
 * get user by auth token
 *
 * @param {object} event containg all the information about the event execution ex: body, headers
 * @param {object} context containing some meta data of app
 * @return {object} user data in response
 */
async function getUser(event, context) {
  const user = event.requestContext.authorizer;
  return {
    statusCode: 200,
    body: JSON.stringify(user),
  };
}
export const handler = middleware(getUser);
