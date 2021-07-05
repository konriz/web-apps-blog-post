window.addEventListener("load", function () {
  downloadCurrencies();
  const form = document.getElementById("convert-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    convertMoney(form);
  });
});

async function downloadCurrencies() {
  const response = fetch('http://localhost:3000/api/currencies', {
    method: 'GET'
  });
  response.then(async res =>
    populateSelect(await res.json())
  ).catch((error) =>
    showError(error)
  );
}

function populateSelect(currenciesList) {
  const inputCurrencySelect = document.getElementById("input-currency");
  const outputCurrencySelect = document.getElementById("output-currency");

  for (const currency of currenciesList) {
    inputCurrencySelect.appendChild(createOption(currency));
    outputCurrencySelect.appendChild(createOption(currency));
  }
}

function createOption(currency) {
  const option = document.createElement("option");
  option.value = currency;
  option.innerText = currency;
  return option;
}

async function convertMoney(form) {
  if (!document.getElementById("input-amount").checkValidity()) {
    return;
  }

  const formData = new FormData(form);
  const requestData = {
    inputCurrency: formData.get("inputCurrency"),
    outputCurrency: formData.get("outputCurrency"),
    inputAmount: formData.get("inputAmount")
  }
  const response = fetch('http://localhost:3000/api/convert', {
    method: 'POST',
    body: JSON.stringify(requestData),
    headers: {"Content-Type": "application/json"}
  });
  await response.then(async res =>
    showResult(requestData, await res.json())).catch((error) =>
    showError(error)
  );
}

function showResult(requestData, result) {
  setRequestData(requestData);
  setResult(result.unitRatio, result.amount);
}

function setRequestData(requestData) {
  document.getElementById("input-amount-slot").innerText = parseFloat(requestData.inputAmount).toFixed(2);
  for (const element of document.getElementsByClassName("input-currency-slot")) {
    element.innerText = requestData.inputCurrency;
  }
  for (const element of document.getElementsByClassName("output-currency-slot")) {
    element.innerText = requestData.outputCurrency;
  }
}

function setResult(ratio, amount) {
  document.getElementById("conversion-ratio").innerText = ratio.toFixed(2);
  document.getElementById("output-amount-slot").innerText = amount.toFixed(2);
}

const connectionErrorLabel = document.getElementById("connection-error");
const validationErrorLabel = document.getElementById("validation-error");

const validationError = {error: "Validation error"};

function showError(error) {
  if (error.error === validationError.error) {
    validationErrorLabel.hidden = false;
  } else {
    connectionErrorLabel.hidden = false;
  }
  setResult(0, 0);
}

