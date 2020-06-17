import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs/Subject";
import { AngularFireAuth } from "angularfire2/auth";

import { AuthData } from "./auth-data.model";
import { TrainingService } from "../training/training.service";
import { UIService } from '../shared/ui.service';

@Injectable({
  providedIn: "root",
})
export class AuthService {
  authChange = new Subject<boolean>();
  // private user: User;
  private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(["/training"]);
      } else {
        this.trainingService.cancelSubscriptions();
        this.authChange.next(false);
        this.router.navigate(["/login"]);
        this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString()
    // };
    this.uiService.loadingStateChange.next(true);
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        this.uiService.loadingStateChange.next(false);
      })
      .catch((error) => {
        // console.log(error);
        this.uiService.loadingStateChange.next(false);
        // this.snackbar.open(error.message, null, {
        //   duration: 3000
        // });
        this.uiService.showSnackbar(error.message, null, 3000)
      });
  }

  login(authData: AuthData) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString(),
    // };
    this.uiService.loadingStateChange.next(true);
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        // console.log(result);
        this.uiService.loadingStateChange.next(false);
      })
      .catch((error) => {
        // console.log(error);
        this.uiService.loadingStateChange.next(false);
        // this.snackbar.open(error.message, null, {
        //   duration: 3000
        // });
        this.uiService.showSnackbar(error.message, null, 3000)
      });
  }

  logout() {
    this.afAuth.auth.signOut();
    // this.user = null;
  }

  // getUser() {
  //   return { ...this.user };
  // }

  isAuth() {
    // return this.user !== null;
    return this.isAuthenticated;
  }
}
