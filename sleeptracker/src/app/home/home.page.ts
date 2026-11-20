import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonButton } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonButton, FormsModule],})
export class HomePage {
	bedtime:string = '';
	wakeTime:string = '';
  	constructor(public sleepService:SleepService) {

	}

	ngOnInit() {
		console.log(this.allSleepData);
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}

	logSleep(){
		if(new Date(this.wakeTime)<=new Date(this.bedtime)){
			console.log('Wake-up time should be after bedtime')
		}
		const s = new OvernightSleepData(new Date(this.bedtime), new Date(this.wakeTime));
		this.sleepService.logOvernightData(s);
		console.log('Logged:', s.summaryString());
		this.bedtime = '';
		this.wakeTime = '';
	}
}
