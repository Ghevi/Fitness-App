import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { AngularFirestore } from "angularfire2/firestore";
import { Store } from "@ngrx/store";

import { Exercise } from "./exercise.model";
import { UIService } from "../shared/ui.service";
import * as UI from "../shared/ui.actions";
import * as fromRoot from "../app.reducer";

@Injectable({
  providedIn: "root",
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();

  // private availableExercises: Exercise[] = [
  //   { id: "crunches", name: "Crunches", duration: 100, calories: 20 },
  //   { id: "cardio", name: "Cardio", duration: 30, calories: 500 },
  //   { id: "side-lunges", name: "Side Lunges", duration: 10, calories: 30 },
  //   { id: "jumping-jacks", name: "Jumping Jacks", duration: 5, calories: 40 },
  // ];

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(
    private db: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  startExercise(selectedId: string) {
    // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date(),
      state: "completed",
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: "cancelled",
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  fetchAvailableExercises() {
    // return this.availableExercises.slice();

    // this.uiService.loadingStateChange.next(true);
    this.store.dispatch(new UI.StartLoading());

    this.fbSubs.push(
      this.db
        .collection("availableExercises")
        //.valueChanges(); // strips out the metadata from the db like the id
        .snapshotChanges()
        .map((docArray) => {
          // throw(new Error());
          return docArray.map((doc) => {
            return {
              id: doc.payload.doc.id,
              ...(doc.payload.doc.data() as Exercise),
            };
          });
        })
        .subscribe(
          (exercises: Exercise[]) => {
            // this.uiService.loadingStateChange.next(false);
            this.store.dispatch(new UI.StopLoading());

            this.availableExercises = exercises;
            this.exercisesChanged.next([...this.availableExercises]);
          },
          (error) => {
            // this.uiService.loadingStateChange.next(false);
            this.store.dispatch(new UI.StopLoading());
            
            this.uiService.showSnackbar(
              "Fetching Exercises failed, please try again later",
              null,
              3000
            );
            this.exercisesChanged.next(null);
          }
        )
    );
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  fetchCompletedOrCancelledExercises() {
    // return this.exercises.slice();
    this.fbSubs.push(
      this.db
        .collection("finishedExercises")
        .valueChanges()
        .subscribe(
          (exercises: Exercise[]) => {
            this.finishedExercisesChanged.next(exercises);
          }
          // This hides the error of the subscription on the logout
          // (error) => {
          //   console.log(error);
          // }
        )
    );
  }

  cancelSubscriptions() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection("finishedExercises").add(exercise);
  }
}
