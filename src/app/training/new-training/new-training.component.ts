import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription, Observable } from "rxjs";
import "rxjs/add/operator/map";

import { TrainingService } from "../training.service";
import { Exercise } from "../exercise.model";
import { UIService } from "src/app/shared/ui.service";
import { Store } from "@ngrx/store";
import * as fromRoot from "../../app.reducer";

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.css"],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  // exercises: Exercise[] = [];
  exercises: Exercise[];
  isLoading$: Observable<boolean>;
  private exercisesSubscription: Subscription;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    // this.exercises = this.trainingService.getAvailableExercises();

    // this.loadingSubs = this.uiService.loadingStateChange.subscribe(
    //   (isLoading) => {
    //     this.isLoading = isLoading;
    //   }
    // );

    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    this.exercisesSubscription = this.trainingService.exercisesChanged.subscribe(
      (exercises) => {
        // this.isLoading = false; // It is better to handling all loadings in the UIService
        this.exercises = exercises;
      }
    );
    this.fetchExercises();
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    if (this.exercisesSubscription) {
      this.exercisesSubscription.unsubscribe();
    }

    // if (this.loadingSubs) {
    //   this.loadingSubs.unsubscribe();
    // }
  }
}
