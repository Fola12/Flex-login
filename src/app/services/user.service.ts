import { Injectable } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { resolve } from '@angular/compiler-cli/src/ngtsc/file_system';

@Injectable({
  providedIn: 'root',
})
export class UserService {
 // userData: any[] = [];
  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth // Inject Firebase auth service
  ) {}

  getUser(currentUser: any) {
    //var docRef = this.afs.collection(`users`);
   // var user = this.afAuth.currentUser;

    return this.afs.collection('users', (ref) => ref.where('uid', '==', currentUser.uid)).snapshotChanges();


  }


}
