import axios from 'axios';
import createHttpError from 'http-errors';
import middleware from '../../lib/middleware';
/**
 * currency conversion
 *
 * @param {object} event containg all the information about the event execution ex: body, headers
 * @param {object} context containing some meta data of app
 * @return {object}
 */
async function currencyConversion(event, context) {
  const { to, from, amount } = event.body;
  const currencyConversionAPI = process.env.CURRENCY_CONVERSION_API;
  const currencyConversionAPIKey = process.env.CURRENCY_CONVERSION_API_KEY;

  const request = `${currencyConversionAPI}?access_key=${currencyConversionAPIKey}`;
  const currencyRates = await axios.get(request);

  const ratesData = currencyRates.data.rates;

  // calculation for converted amount eg:
  // amount: 10, base currency rate for from- USD:1.178, to- INR: 87.978
  // formula: (10/1.178) * 87.978
  const calculation = (amount / ratesData[from.toUpperCase()]) * ratesData[to.toUpperCase()];
  if (!calculation) {
    throw new createHttpError.Forbidden('Invalid Currency');
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      ...event.body,
      convertedAmount: calculation.toFixed(3),
    }),
  };
}

export const handler = middleware(currencyConversion);
