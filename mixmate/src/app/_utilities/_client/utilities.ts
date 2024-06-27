import { pageStateActions } from "lib/redux/pageStateSlice";
import { END_POINT, SEVERITY } from "./constants";
import { Dispatch } from "redux";

type FetchOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: FormData | string;
};

const displayErrorSnackMessage = (error: any, dispatch: Dispatch) => {
  dispatch(pageStateActions.setToastMessage({
    title: "Error",
    message: error.message,
    severity: SEVERITY.Error,
    open: true,
  }));
}

function jsonToQueryString(baseUrl: string, apiRoute: string, params: Record<string, string> | null = null): string {
  const url = new URL("api" + apiRoute, baseUrl);
  url.search = new URLSearchParams(params).toString();
  return url.href;
}

async function executeFetch(url: string, options: RequestInit, funOk?: (data: any) => void, funErr?: (error: Error) => void): Promise<void> {
  try {
    const response = await fetch(url, options);
    const responseData = await response.json();
    if (!response.ok) {
      throw new Error(responseData.message || responseData.error || 'Network response was not ok');
    }
    funOk?.(responseData);
  } catch (error) {
    throw error;
  }
}
const makeRequest = async (
  apiRoute: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  data: any,
  funOk?: (data: any) => void,
  funErr?: (error: Error) => void
): Promise<void> => {
  let fullUrl: string;
  let fetchOptions: FetchOptions = { method };

  if (data instanceof FormData) {
    // For FormData, let the browser set the Content-Type
    fullUrl = `${END_POINT}/${apiRoute}`;
    fetchOptions.body = data;
  } else {
    switch (method) {
      case "POST":
      case "PUT":
        fullUrl = `${END_POINT}/${apiRoute}`;
        fetchOptions.headers = { "Content-Type": "application/json" };
        fetchOptions.body = JSON.stringify(data);
        break;
      case "DELETE":
      case "GET":
        fullUrl = jsonToQueryString(END_POINT, apiRoute, data);
        break;
      default:
        throw new Error('Unsupported HTTP method');
    }
  }

  try {
    await executeFetch(fullUrl, fetchOptions, funOk, funErr);
  } catch (error) {
    throw error;
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

// function getCallerLine() {
//   const err = new Error();
//   const stack = err.stack.split("\n");
//   // Depending on the environment, you may need to adjust the line index
//   const callerLine = stack[3]; // This might be the line where the function was called
//   return callerLine.match(/:(\d+):\d+\)?$/)?.[1]; // Extracts line number
// }// a function used to determine where is the function be called from
// // const filterSetter = (data) => {
// //   const callerLine = getCallerLine();
// //   console.log(`filterSetter was called from line: ${callerLine}`);
// //   console.log(data[0]);
// //   setRecipesFiltered(data);
// // };
// // Loading recipe options

function formatDateTime(dateTimeString: string): string {
  try {
    const date = new Date(dateTimeString);
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    };
    const newDate = new Intl.DateTimeFormat('en-EN', options).format(date);
    return newDate;
  }catch (error) {
    return 'N/A';
  }
}


export { displayErrorSnackMessage, isSet, isNotSet, makeRequest, capitalizeWords, formatDateTime };
