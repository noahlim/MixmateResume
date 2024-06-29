import { NextRequest, NextResponse } from "next/server";
import { readRequestBody, Result, isSet, isNotSet } from "@/app/_utilities/_server/util";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { userCollection, recipeReviewCollection } from "@/app/_utilities/_server/database/config";
import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";

function isValidAvatarUrl(url) {
    try {
        // Create a URL object to parse the input
        const parsedUrl = new URL(url);

        // Check if the protocol is http or https
        if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
            return false;
        }

        // Check if the hostname matches the required domain
        if (parsedUrl.hostname !== 's.gravatar.com') {
            return false;
        }

        // If all checks pass, return true
        return true;
    } catch (error) {
        // If URL parsing fails, it's not a valid URL
        return false;
    }
}


export const GET = withApiAuthRequired(async function getAllReviews(req: NextRequest) {
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }

    let result = new Result();

    try {
        const userId = req.nextUrl.searchParams.get('userid');

        const { user } = await getSession();
        //get shared recipes only for the authenticated users

        if (!user || user.sub !== userId) {
            return NextResponse.json({ error: "Invalid session." }, { status: 400 });
        }
        let db = await dbRtns.getDBInstance();

        let reviews = await dbRtns.findAll(db, recipeReviewCollection, { sub: user.sub }, {});

        //deleting user Id in the recipes before returning to the server for security reason
        let updatedReviews = [];
        try {
            reviews.forEach((review) => {
                const rating = parseInt(review.rating);
                if (isNaN(rating) || rating < 1 || rating > 5) {
                    throw new Error('Rating must be a number or be value between 1 and 5');
                }
                delete review.sub;
                updatedReviews.push(review);
            });
        } catch (err) {
            return NextResponse.json({ error: err.message }, { status: 404 });
        }
        result.setTrue("Reviews Fetched.");
        result.data = updatedReviews;
        result.message = updatedReviews.length > 0 ? `${updatedReviews.length} reviews found.` : "No reviews found."


        return NextResponse.json(result, { status: 200 });
        //get all shared recipes

    } catch (err) {
        return NextResponse.json({ error: 'Error fetching the recipes from the custom recipes collection.' }, { status: 400 });

    }
});

export const POST = withApiAuthRequired(async function postRecipeReview(req: NextRequest) {
    //rate limiting
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }
    if (req.body) {
        const body = await readRequestBody(req.body);

        if (!body) {
            return NextResponse.json({ error: 'Error : Body is Empty' }, { status: 404 });
        }
        else {
            if (!body.newReview)
                return NextResponse.json({ error: 'No review data passed' }, { status: 404 });
        }
        let result = new Result(true);
        const { user } = await getSession();
        if (!user) {
            return NextResponse.json({ error: "Invalid session." }, { status: 400 });
        }
        try {
            // Validate if user exist
            
            let db = await dbRtns.getDBInstance();

            //user.sub is  unique id of each user
            let userExist = await dbRtns.findOne(db, userCollection, { sub: user.sub });

            if (isNotSet(userExist)) {
                return NextResponse.json({ error: 'User information not found' }, { status: 404 });
            }
            body.newReview.created_at = new Date().toISOString();
            if(!isValidAvatarUrl(user.picture)){
                return NextResponse.json({ error: 'Invalid user picture URL.' }, { status: 404 });
            }
            body.userNickname = user.email_verified ? user.name : user.nickname,
            body.newReview.userPictureUrl = user.picture;

            if (isNaN(body.newReview.rating) || body.newReview.rating < 1 || body.newReview.rating > 5) {
                return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 404 });
            }
            body.newReview.userId = user.sub,
            await dbRtns.addOne(db, recipeReviewCollection, body.newReview);

            result.setTrue(`The review has been added!`);

        } catch (error) {
            console.log(error);
            return NextResponse.json({ error: 'Error saving the review.' }, { status: 400 });
        }
        return NextResponse.json(result, { status: 201 });

    }
}
)


export const PUT = withApiAuthRequired(async function putRecipeOnSocial(req: NextRequest) {
    //rate limiting
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }
    if (req.body) {
        const body = await readRequestBody(req.body);
        if (!body) {
            return NextResponse.json({ error: 'Error : Body is Empty' }, { status: 404 });
        }
        else {
            if (!body.review)
                return NextResponse.json({ error: 'No review data passed' }, { status: 404 });
        }
        let result = new Result(true);
        const { user } = await getSession();
        if (!user) {
            return NextResponse.json({ error: "Invalid session." }, { status: 400 });
        }
        try {
            // Validate if user exist
            let db = await dbRtns.getDBInstance();
            //user.sub is  unique id of each user
            let userExist = await dbRtns.findOne(db, userCollection, { sub: user.sub });

            if (isNotSet(userExist)) {
                return NextResponse.json({ error: 'User information not found' }, { status: 404 });
            }
            body.review.updated_at = new Date().toISOString();
            delete body.review._id;
            if (isNaN(body.review.rating) || body.review.rating < 1 || body.review.rating > 5) {
                return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 404 });
            }

            await dbRtns.updateOne(db, recipeReviewCollection, { _id: new ObjectId(body.recipe._id) }, body.recipe);

            result.setTrue(`The review has updated.`);

        } catch (error) {
            console.log(error);
            return NextResponse.json({ error: 'Error saving the review' }, { status: 400 });
        }
        return NextResponse.json(result, { status: 201 });

    }
}
)

export const DELETE = withApiAuthRequired(async function deleteReview(req: NextRequest) {
    //rate limiting
    if (!rateLimit(req, 100, 15 * 60 * 1000)) { // 100 requests per 15 minutes
        return NextResponse.json({ error: 'You have made too many requests. Please try again later.' }, { status: 429 })
    }

    const reviewId = new ObjectId(req.nextUrl.searchParams.get('_id'));


    if (!reviewId) {
        return NextResponse.json({ error: 'Error : Body is Empty' }, { status: 404 });
    }
    const { user } = await getSession();

    try {
        let db = await dbRtns.getDBInstance();
        let response = await dbRtns.findOne(db, recipeReviewCollection, { _id: new ObjectId(reviewId) });

        if (!response) {
            return NextResponse.json({ error: 'Selected review does not exist.' }, { status: 404 })
        }
        //when the unique id of the user and the id of the user who created
        //the favourite list do not match 
        if (user.sub !== response.userId) {
            return NextResponse.json({ error: "The user is not authorized to delete this review." }, { status: 401 });
        }

        //response is the object deleted
        response = await dbRtns.deleteOne(db, recipeReviewCollection, { _id: reviewId });
        if (response) {
            const result = new Result(true);
            result.message = "Selected review has been deleted successfully";
            return NextResponse.json(result, { status: 200 });
        }
    } catch (err) {
        return NextResponse.json({ error: err }, { status: 400 });

    }
})