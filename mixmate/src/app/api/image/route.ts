import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Result, generateRandomKey } from '@/app/_utilities/_server/util';

import { aws_access_key, aws_secret_key, bucket_name, bucket_region } from '@/app/_utilities/_server/database/config';

const s3 = new S3Client({
    credentials: {
        accessKeyId: aws_access_key,
        secretAccessKey: aws_secret_key
    },
    region: bucket_region
});

async function uploadFileToS3(file, fileName) {

    const fileBuffer = file;

    const params = {
        Bucket: bucket_name,
        Key: `${fileName}`,
        Body: fileBuffer,
        ContentType: "image/*"
    }

    const command = new PutObjectCommand(params);
    const result = await s3.send(command);
    return result;
}

export const POST = (async function postImageOnDatabase(request) {
    try {

        const formData = await request.formData();
        const file = formData.get("file");

        if (!file) {
            return NextResponse.json({ error: "File is required." }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = generateRandomKey(12) + file.name;
        const response = await uploadFileToS3(buffer, fileName);
        if (response.$metadata.httpStatusCode === 200) {
            const result = new Result(true);

            result.data = `https://${bucket_name}.s3.${bucket_region}.amazonaws.com/${fileName}`
            result.message = "File has been added to the storage.";
            return NextResponse.json(result, { status: 201 });
        } else {
            return NextResponse.json({ error: "Failed to add an image." }, { status: 400 });

        }
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error });
    }
})

export async function GET(req: NextRequest) {
    try {
        const fileName = req.nextUrl.searchParams.get('filename');
        if (!fileName) {
            return NextResponse.json({ error: "File name is required." }, { status: 400 });
        }

        const command = new GetObjectCommand({
            Bucket: bucket_name,
            Key: fileName
        });

        const response = await s3.send(command);
        const data = await response.Body.transformToString();
        if (response) {
            const result = new Result(true);
            result.message = "Image fetched!";
            result.data = URL.createObjectURL(new Blob([data], { type: "image/*" }));
            return NextResponse.json(result, { status: 200 });
        } else {
            return NextResponse.json({ error: "Failed to fetch the image" }, { status: 400 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to retrieve file.' }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest) {
    try {
        const fileName = req.nextUrl.searchParams.get('filename');
        if (!fileName) {
            return NextResponse.json({ error: "File name is required." }, { status: 400 });
        }

        const command = new DeleteObjectCommand({
            Bucket: bucket_name,
            Key: fileName
        });

        const response = await s3.send(command);

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete file.' }, { status: 500 });
    }
}