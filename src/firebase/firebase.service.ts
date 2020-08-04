import { Injectable } from '@nestjs/common';
import Firestore from '@google-cloud/firestore/build/src';

@Injectable()
export class FirebaseService {
  db = new Firestore({
    projectId: 'notionapi-service',
  });
}
