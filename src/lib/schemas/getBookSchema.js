const schema = {
  type: 'object',
  properties: {
    queryStringParameters: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
      },
    },
  },
  required: ['queryStringParameters'],
};
export default schema;
