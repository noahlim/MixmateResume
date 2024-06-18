import { NextRequest, NextResponse } from "next/server";
import { Result, isSet} from "@/app/_utilities/_server/util";
import { rateLimit } from "@/app/_utilities/_server/rateLimiter";


export async function GET(req: NextRequest) {
  //rate limiting
  if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
    return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
  }

  const query = req.nextUrl.searchParams.get('query');

  let result = new Result(true);
  console.log(query);
  try {

    let response = await fetch(
      `https://lcbostats.com/api/alcohol?search=${query}`
    );
    let data = await response.json();

    //fs.writeFileSync('D:\\Mixmate\\mixmate\\src\\app\\api\\shoppinglist\\lcbo\\lcbo.json', JSON.stringify(data));

    let alcohols = data.data;
    if (isSet(alcohols)) {
      result.data = alcohols;
      console.log(alcohols);
    }
    else
      return NextResponse.json({ error: "Unable to connect to LCBO API." }, { status: 400 });


  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });

  }
  return NextResponse.json(result, { status: 200 })

}