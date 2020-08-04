import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { SecretManagerServiceClient } from '@google-cloud/secret-manager/build/src';

const secretManagerServiceClient = new SecretManagerServiceClient();

let app: admin.app.App;

@Injectable()
export class FirebaseService {
  db = app.firestore();
}

export async function initFirebase() {
  const [secret] = await secretManagerServiceClient.accessSecretVersion({
    name: 'projects/notionapi-server/secrets/SERVICE_ACCOUNT/versions/5',
  });

  const serviceAccount = JSON.parse(secret.payload.data.toString());

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://notionapi-server.firebaseio.com',
  });
}
