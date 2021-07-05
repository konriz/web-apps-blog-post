const express = require('express');
const cors = require('cors');
const app = express();

const corsOptions = {
  origin: "*"
}

const port = 3000;

app.options('/api/convert', cors(corsOptions));

app.post('/api/convert', cors(corsOptions), express.json(), (req, res) => {
  log('POST convert');

  const requestData = req.body;

  if (!requestValid(requestData)) {
    return res.status(400).send({error: "Validation error"});
  }

  res.send(convert(requestData));
});

app.get('/api/currencies', cors(corsOptions), (req, res) => {
  log('GET currencies list');
  res.send(availableCurrencies);
});

app.listen(port, () => {
  log(`Converter API listening at http://localhost:${port}`)
})

function requestValid(requestData) {
  if (!requestData.inputCurrency || !requestData.outputCurrency) {
    return false
  }
  if (!availableCurrencies.includes(requestData.inputCurrency) || !availableCurrencies.includes(requestData.outputCurrency)) {
    return false
  }
  if (requestData.inputAmount < 0) {
    return false;
  }
  return true;
}

function convert(requestData) {
  const unitRatio = findRatio(requestData.inputCurrency, requestData.outputCurrency);
  return {unitRatio, amount: requestData.inputAmount * unitRatio};
}

function findRatio(inputCurrency, outputCurrency) {
  const inputValue = currencyTable[inputCurrency];
  const outputValue = currencyTable[outputCurrency];
  return inputValue / outputValue;
}

const currencyTable =
  {"PLN": 1, "USD": 3.82, "EUR": 4.55};

const availableCurrencies = Object.keys(currencyTable)

function log(message) {
  console.log(`${timestamp()} : ${message}`);
}

function timestamp() {
  const date = new Date();
  return date.toLocaleTimeString();
}
