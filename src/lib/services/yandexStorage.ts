import { S3Client, GetObjectCommand, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: 'ru-central1',
  endpoint: process.env.YANDEX_ENDPOINT,
  credentials: {
    accessKeyId: process.env.YANDEX_ACCESS_KEY_ID!,
    secretAccessKey: process.env.YANDEX_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.YANDEX_BUCKET_NAME!;

export async function getSignedPdfUrl(path: string, expiresIn: number = 60): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
    ResponseContentType: 'application/pdf',
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
  return signedUrl;
}

export async function uploadPdf(path: string, file: Buffer, contentType: string = 'application/pdf'): Promise<void> {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);
}

export async function deletePdf(path: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: path,
  });

  await s3Client.send(command);
}
