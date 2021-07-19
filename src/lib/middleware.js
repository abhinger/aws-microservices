import middy from '@middy/core';
import httpJsonBOdyParser from '@middy/http-json-body-parser';
import httpEventNormalizer from '@middy/http-event-normalizer';
import httpErrorHandler from '@middy/http-error-handler';

export default (handler) =>
  middy(handler).use([httpJsonBOdyParser(), httpEventNormalizer(), httpErrorHandler()]);
