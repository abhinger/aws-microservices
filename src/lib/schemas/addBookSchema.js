const schema = {
  type: 'object',
  properties: {
    body: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
        },
        author: {
          type: 'string',
        },
        rating: {
          type: 'string',
        },
        amount: {
          type: 'number',
        },
        stock: {
          type: 'number',
        },
        description: {
          type: 'string',
        },
      },
      required: ['title', 'author', 'stock'],
    },
  },
  required: ['body'],
};
export default schema;
