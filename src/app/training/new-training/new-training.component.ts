import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AngularFirestore } from "angularfire2/firestore";

import { TrainingService } from "../training.service";
import { Observable } from 'rxjs';

@Component({
  selector: "app-new-training",
  templateUrl: "./new-training.component.html",
  styleUrls: ["./new-training.component.css"],
})
export class NewTrainingComponent implements OnInit {
  // exercises: Exercise[] = [];
  exercises: Observable<any>;

  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore
  ) {}

  ngOnInit() {
    // this.exercises = this.trainingService.getAvailableExercises();
    
    this.exercises = this.db
      .collection("availableExercises")
      .valueChanges(); // strips out the metadata from the db like the id
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
