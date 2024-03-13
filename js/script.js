const dropList = document.querySelectorAll(".drop-list select");
fromCurrency = document.querySelector(".from select");
toCurrency = document.querySelector(".to select");
getButton = document.querySelector("form button");

for(let i = 0; i < dropList.length; i++){
    for(currency_code in country_list){
        //Selecting USD by default as FROM currency and NPR as TO currency
        let selected;
        if(i == 0){
            selected = currency_code == "USD" ? "selected" : "";
        }else if(i == 1){
            selected = currency_code == "DOP" ? "selected" : "";
        }
        //Creating option tag with passing currency code as a text and value
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        //Inserting options tag inside select tag
        dropList[i].insertAdjacentHTML("beforeend", optionTag);    
    }
    dropList[i].addEventListener("change", e => {
        loadFlag(e.target); //calling loadFlag with passing target element as an argument
    });
}

function loadFlag(element){
    for(code in country_list){
        if(code == element.value){ //If currency code of country list is equal to option value
            let imgTag = element.parentElement.querySelector("img"); //Selecting img tag of particular drop list
            //Passing country code of a selected currency code in a img url
            imgTag.src = `https://flagsapi.com/${country_list[code]}/flat/64.png`;
        }
    }
}

window.addEventListener("load", () =>{
    getExchangeRate();
});

getButton.addEventListener("click", e =>{
    e.preventDefault(); //Preventing form from submitting
    getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", () =>{
    let tempCode = fromCurrency.value; //Temporary currency code of FROM drop list
    fromCurrency.value = toCurrency.value; //Passing TO currency code to FROM currency code
    toCurrency.value = tempCode; //Passing temporary currency code to TO currency code
    loadFlag(fromCurrency); //Calling loadFlag with passing select element (fromCurrency) of FROM
    loadFlag(toCurrency); //Calling loadFlag with passing select element (toCurrency) of TO
    getExchangeRate();
});

function getExchangeRate(){
    const amount = document.querySelector(".amount input"),
    exchangeRateTxt = document.querySelector(".exchange-rate");
    let amountVal = amount.value;

    //If user don't enter any value or enter 0 then we'll put 1 value by default in the input field
    if (amountVal == "" || amountVal == "0"){
        amount.value = "1";
        amountVal = 1;
    }

    let url = `https://v6.exchangerate-api.com/v6/09e3a8af1d2053780ea20c28/latest/${fromCurrency.value}`;
    //Fetching api response and returning it with parsing into js obj abd in another then method receiving that obj
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value];
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2);
        const exchangeRateTxt = document.querySelector(".exchange-rate");
        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    }).catch(() =>{ //If user is offline or any other error occured while fetching data then catch function will run
        exchangeRateTxt.innerText = "Something went wrong";
    });
}