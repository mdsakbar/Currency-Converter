const BASE_URL ="https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const FALLBACK_URL ="https://latest.currency-api.pages.dev/v1/currencies";


const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");

const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");

const msg = document.querySelector(".msg");

for (let select of dropdowns) {

    for (let currCode in countryList) {

        let option = document.createElement("option");

        option.innerText = currCode;
        option.value = currCode;

        if (select.name === "from" && currCode === "USD") {
            option.selected = true;
        }

        if (select.name === "to" && currCode === "INR") {
            option.selected = true;
        }

        select.append(option);
    }

    select.addEventListener("change", (event) => {
        updateFlag(event.target);
    });
}


function updateFlag(element) {

    let currCode = element.value;

    let countryCode = countryList[currCode];

    let img = element.parentElement.querySelector("img");

    if (countryCode && img) {
        img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    }
}


updateFlag(fromCurr);
updateFlag(toCurr);


btn.addEventListener("click", async (event) => {

    event.preventDefault();

    const amountInput = document.querySelector(".amount input");

    let amount = Number(amountInput.value);

    if (!amount || amount <= 0) {
        amount = 1;
        amountInput.value = 1;
    }

    const from = fromCurr.value.toLowerCase();
    const to = toCurr.value.toLowerCase();


    try {

        let url = `${BASE_URL}/${from}.json`;

        let response = await fetch(url);


        if (!response.ok) {

            url = `${FALLBACK_URL}/${from}.json`;

            response = await fetch(url);
        }


        if (!response.ok) {
            throw new Error("API Error");
        }


        const data = await response.json();


        const rate = data[from][to];


        if (!rate) {
            throw new Error("Currency not found");
        }


        const result = amount * rate;


        msg.innerText =
            `${amount} ${fromCurr.value} = ${result.toFixed(2)} ${toCurr.value}`;


    } catch (error) {

        console.log(error);

        msg.innerText =
            "Unable to get exchange rate. Try again.";

    }

});