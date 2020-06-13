import { Exercise } from "./exercise.model";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();

  private availableExercises: Exercise[] = [
    { id: "crunches", name: "Crunches", duration: 100, calories: 20 },
    { id: "cardio", name: "Cardio", duration: 30, calories: 500 },
    { id: "side-lunges", name: "Side Lunges", duration: 10, calories: 30 },
    { id: "jumping-jacks", name: "Jumping Jacks", duration: 5, calories: 40 },
  ];

  private runningExercise: Exercise;
  private exercises: Exercise[] = [];

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: "completed",
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.exercises.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: "cancelled",
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getAvailableExercises() {
    return this.availableExercises.slice();
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  getCompletedOrCancelledExercises() {
    return this.exercises.slice();
  }
}
