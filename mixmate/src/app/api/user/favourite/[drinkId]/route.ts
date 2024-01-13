import { rateLimit } from "@/app/_utilities/_server/rateLimiter";
import { NextRequest, NextResponse } from "next/server";
import { userFavouriteCollection } from "@/app/_utilities/_server/database/config";
import * as dbRtns from "@/app/_utilities/_server/database/db_routines"
import { ObjectId } from "mongodb";
import { getSession, withApiAuthRequired } from "@auth0/nextjs-auth0";
import { Result } from "@/app/_utilities/_server/util";
//http://localhost:3000/api/user/favourite/123
