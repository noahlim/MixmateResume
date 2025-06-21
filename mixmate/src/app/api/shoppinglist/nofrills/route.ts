import { NextRequest, NextResponse } from "next/server";
import {
  readRequestBody,
  Result,
  isSet,
  isNotSet,
} from "@/app/_utilities/_server/util";
import {
  nofrills_api_host,
  nofrills_api_key,
} from "@/app/_utilities/_server/database/config";

import { rateLimit } from "@/app/_utilities/_server/rateLimiter";

export async function GET(req: NextRequest) {
  //rate limiting
  if (!rateLimit(req, 100, 15 * 60 * 1000)) {
    // 100 requests per 15 minutes
    return NextResponse.json(
      { error: "You have made too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const query = req.nextUrl.searchParams.get("query");

  // Check if API credentials are available and not placeholder values
  if (
    !nofrills_api_key ||
    !nofrills_api_host ||
    nofrills_api_key === "your-nofrills-api-key" ||
    nofrills_api_host === "your-nofrills-api-host"
  ) {
    return NextResponse.json(
      {
        error:
          "No Frills API is not configured. Please contact the administrator to set up No Frills API credentials.",
        details: "API credentials are missing or set to placeholder values.",
      },
      { status: 503 }
    );
  }

  let result = new Result(true);

  // Use No Frills search endpoint
  const searchUrl = `https://www.nofrills.ca/search?search-bar=${encodeURIComponent(
    query
  )}`;
  const apiUrl = `https://walmart-api4.p.rapidapi.com/walmart-serp.php?url=${encodeURIComponent(
    searchUrl
  )}`;

  const options = {
    method: "GET",
    headers: {
      "X-RapidAPI-Key": nofrills_api_key,
      "X-RapidAPI-Host": nofrills_api_host,
    },
  };

  try {
    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `No Frills API error: ${response.status} ${response.statusText}`,
          details:
            "The No Frills API service is currently unavailable or the request was invalid.",
        },
        { status: response.status }
      );
    }

    const fetchResult = await response.text();

    if (!fetchResult) {
      return NextResponse.json(
        {
          error: "Empty response from No Frills API.",
          details: "The No Frills API returned an empty response.",
        },
        { status: 400 }
      );
    }

    const json = JSON.parse(fetchResult);

    // Log the actual response structure for debugging
    console.log(
      "No Frills API response structure:",
      JSON.stringify(json, null, 2)
    );

    // Check if the response has the expected structure
    if (!json || !json.body || !json.body.products) {
      return NextResponse.json(
        {
          error: "Invalid response structure from No Frills API.",
          details: "The No Frills API returned data in an unexpected format.",
        },
        { status: 400 }
      );
    }

    const products = json.body.products;

    if (isSet(products) && products.length > 0) {
      result.setTrue();
      result.data = products;
    } else {
      return NextResponse.json(
        {
          error: "No items found for the given query.",
          details: `No No Frills products found for "${query}".`,
        },
        { status: 400 }
      );
    }
  } catch (err) {
    console.log("No Frills API error:", err);
    return NextResponse.json(
      {
        error: "Failed to connect to No Frills API.",
        details: err.message,
      },
      { status: 400 }
    );
  }
  return NextResponse.json(result, { status: 200 });
}
