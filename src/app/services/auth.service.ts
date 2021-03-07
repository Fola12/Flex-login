import { Injectable, NgZone } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

import { User } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userState: any; // Save logged in user data

  errors: any;
  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth, // Inject Firebase auth service
    private router: Router,
    private ngZone: NgZone
  ) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userState = user;
        localStorage.setItem('user', JSON.stringify(this.userState));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('user', 'null');
        JSON.parse(localStorage.getItem('user')!);
      }
    });
  }

 SignIn(userState: User) {
    return this.afAuth
      .signInWithEmailAndPassword(userState.email, userState.password)
      .then((result) => {
        if (result.user?.emailVerified !== true) {
          this.errors =
            'Please validate your email address. Kindly check your inbox.';
        } else {
          this.ngZone.run(() => {
            this.router.navigate(['dashboard']);
          });
        }
      })
      .catch((error) => {
        this.errors = error.message;
      });
  }

  SignUp(userState: User) {
    return this.afAuth
      .createUserWithEmailAndPassword(userState.email, userState.password)
      .then((result) => {
        this.SendVerificationMail();
        this.SetUserData(userState, result.user);
        this.ngZone.run(() => {
          this.router.navigate(['dashboard']);
        });
      })
      .catch((error) => {
        this.errors = error.message;
      });
  }

  SetUserData(user: any, id: any) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(
      `users/${id.uid}`
    );
    const userState: User = {
      uid: id.uid,
      email: user.email,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
    };
    return userRef.set(userState, {
      merge: true,
    });
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user')!);
    return user !== null && user.emailVerified !== false ? true : false;
  }

  SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u) => u!.sendEmailVerification())
      .then(() => {
        this.router.navigate(['email-verification']);
      });
  }


  SignOut() {
    return this.afAuth.signOut().then(() => {
      localStorage.removeItem('userState');
      this.router.navigate(['flex-home']);
    })
  }
}
