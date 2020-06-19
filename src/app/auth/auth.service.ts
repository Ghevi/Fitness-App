import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { Store } from "@ngrx/store";

import { AuthData } from "./auth-data.model";
import { TrainingService } from "../training/training.service";
import { UIService } from "../shared/ui.service";
import * as fromRoot from "../app.reducer";
import * as UI from "../shared/ui.actions";
import * as Auth from './auth.actions'

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // authChange = new Subject<boolean>();
  // private user: User;
  // private isAuthenticated = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        // this.isAuthenticated = true;
        // this.authChange.next(true);

        this.store.dispatch(new Auth.SetAuthenticated())
        this.router.navigate(["/training"]);
      } else {
        this.trainingService.cancelSubscriptions();
        // this.authChange.next(false);

        this.store.dispatch(new Auth.SetUnauthenticated())
        this.router.navigate(["/login"]);
        // this.isAuthenticated = false;
      }
    });
  }

  registerUser(authData: AuthData) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString()
    // };

    // this.uiService.loadingStateChange.next(true);

    // this.store.dispatch({type: 'START_LOADING'});
    this.store.dispatch(new UI.StartLoading());

    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        // this.uiService.loadingStateChange.next(false);

        // this.store.dispatch({type: 'STOP_LOADING'});
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((error) => {
        // console.log(error);
        // this.snackbar.open(error.message, null, {
        //   duration: 3000
        // });

        // this.uiService.loadingStateChange.next(false);

        // this.store.dispatch({type: 'STOP_LOADING'});
        this.store.dispatch(new UI.StopLoading());

        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    // this.user = {
    //   email: authData.email,
    //   userId: Math.round(Math.random() * 10000).toString(),
    // };

    // this.uiService.loadingStateChange.next(true);

    // this.store.dispatch({type: 'START_LOADING'});
    this.store.dispatch(new UI.StartLoading());

    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then((result) => {
        // console.log(result);
        // this.uiService.loadingStateChange.next(false);

        // this.store.dispatch({type: 'STOP_LOADING'});
        this.store.dispatch(new UI.StopLoading());
      })
      .catch((error) => {
        // console.log(error);
        // this.snackbar.open(error.message, null, {
        //   duration: 3000
        // });

        // this.uiService.loadingStateChange.next(false);

        // this.store.dispatch({type: 'STOP_LOADING'});
        this.store.dispatch(new UI.StopLoading());

        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
    // this.user = null;
  }

  // getUser() {
  //   return { ...this.user };
  // }

  // isAuth() {
  //   // return this.user !== null;
  //   return this.isAuthenticated;
  // }
}
