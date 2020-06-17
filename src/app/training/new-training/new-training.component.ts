import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import "rxjs/add/operator/map";

import { TrainingService } from "../training.service";
import { Exercise } from "../exercise.model";
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.css"],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[];
  isLoading = true;
  private exercisesSubsription: Subscription;
  private loadingSubs: Subscription;

  constructor(private trainingService: TrainingService, private uiService: UIService) {}

  ngOnInit() {
    this.loadingSubs = this.uiService.loadingStateChange.subscribe(isLoading => {
      this.isLoading = isLoading;
    })
    this.exercisesSubsription = this.trainingService.exercisesChanged.subscribe(
      (exercises) => {
        this.exercises = exercises;
      }
    );
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy() {
    this.exercisesSubsription.unsubscribe();
    this.loadingSubs.unsubscribe();
  }
}
