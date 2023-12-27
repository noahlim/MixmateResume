import { END_POINT } from "./constants";
function jsonToQueryString(baseUrl, apiRoute, params) {
  const url = new URL(apiRoute, baseUrl);
  url.search = new URLSearchParams(params).toString();
  return url.href;
}
const doPost = (api, data, funOk, funErr = null) => {
  let query =
    'query {server(api: "' +
    api +
    '", payload: "' +
    window.btoa(JSON.stringify(data)) +
    '")}';
  let requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ query }),
  };
  fetch(END_POINT, requestOptions)
    .then((response) => response.json())
    .then((data) => funOk(JSON.parse(window.atob(data.data.server))))
    .catch((error) => (funErr ? funErr(error) : alert(error.message)));
};

const makeRequest = async (apiRoute, method, data, funOk, funErr = null)=>{
  switch(method){
    case "GET" :{
      const fullUrl = jsonToQueryString(END_POINT, apiRoute, data);
      console.log(fullUrl);
      try {
        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        if (funOk) {
            funOk(responseData);
        }
    } catch (error) {
        if (funErr) {
            funErr(error);
        } else {
            console.error('Fetch error:', error);
        }
    }
      break;
    }
  }
}
const isSet = (value) => {
  if (value === undefined || value === null || value === false) return false;
  else if (typeof value === "string" && value.trim() === "") return false;

  return true;
};

const isNotSet = (value) => {
  return !isSet(value);
};

function capitalizeWords(str) {
  // List of words to exclude from capitalization
  if (str === "Añejo rum" || str === "Aï¿½ejo rum" || str === "Aï¿½ejo Rum") {
    return "Añejo Rum";
  }
  const exclude = [
    "the",
    "is",
    "or",
    "with",
    "and",
    "but",
    "for",
    "nor",
    "so",
    "yet",
    "at",
    "by",
    "in",
    "of",
    "on",
    "to",
    "up",
    "as",
  ];

  // Split the string into words
  const words = str.split(" ");

  // Capitalize words that are not in the exclude list
  // Skip the first word to retain its original form
  for (let i = 1; i < words.length; i++) {
    if (!exclude.includes(words[i].toLowerCase())) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
  }

  // Rejoin the words into a single string
  return words.join(" ");
}
export { doPost, isSet, isNotSet, makeRequest, capitalizeWords };
