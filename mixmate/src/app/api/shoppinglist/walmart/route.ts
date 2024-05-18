import { NextRequest, NextResponse } from "next/server";
import { readRequestBody, Result, isSet, isNotSet } from "@/app/_utilities/_server/util";
import { walmart_api_host, walmart_api_key } from "@/app/_utilities/_server/database/config";

import { rateLimit } from "@/app/_utilities/_server/rateLimiter";

export async function GET(req: NextRequest) {
    //rate limiting
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }

    const query = req.nextUrl.searchParams.get('query');

    let result = new Result(true);
    const url = `https://axesso-walmart-data-service.p.rapidapi.com/wlm/walmart-search-by-keyword?keyword=${encodeURIComponent(
        query
    )}&page=1&sortBy=best_match`;
    const options = {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": walmart_api_key,
            "X-RapidAPI-Host": walmart_api_host,
        },
    };

    try {
        const response = await fetch(url, options);
        const fetchResult = await response.text();

        const json = JSON.parse(fetchResult);

        const items =
            json.item.props.pageProps.initialData.searchResult.itemStacks[0].items.map(
                (item) => {
                    if (item && item.__typename === "Product") {
                        return item;
                    }
                }
            );

        if (isSet(items)) {
            result.setTrue();
            result.data = items;
        } else {
            return NextResponse.json({ error: "Unable to connect to Walmart API." }, { status: 400 });
        }
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: err.message }, { status: 400 });

    }
    return NextResponse.json(result, { status: 200 })

}