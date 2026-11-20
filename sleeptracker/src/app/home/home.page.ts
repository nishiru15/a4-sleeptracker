import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonButton, IonList, IonLabel, IonDatetime, IonDatetimeButton, IonModal} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonButton, IonList, IonLabel, IonDatetime, IonDatetimeButton, IonModal, FormsModule],})
export class HomePage {
	bedtime:string = this.toLoc(this.daysAgo(1,23));
	wakeTime:string = this.toLoc(this.daysAgo(0,7));
  	constructor(public sleepService:SleepService) {

	}

	daysAgo(days:number, hour:number){
		const d =new Date();
		d.setDate(d.getDate() - days);
		d.setHours(hour,0,0,0);
		return d;
	}

	toLoc(d:Date){
		const o = d.getTimezoneOffset()*60000;
		return new Date(d.getTime() -o).toISOString().slice(0,16);
	}

	ngOnInit() {
		console.log(this.allSleepData);
	}

	/* Ionic doesn't allow bindings to static variables, so this getter can be used instead. */
	get allSleepData() {
		return SleepService.AllSleepData;
	}

	logSleep(){
		console.log('bedtime:', this.bedtime, 'wakeTime:', this.wakeTime);
		const start = new Date(this.bedtime);
		const end = new Date(this.wakeTime);
		if ( isNaN(start.getTime())|| isNaN(end.getTime())){
			console.log('fill both times.');
			return;
		}		
		if(end <=start){
			console.log('Bedtime should be before wake up time')
			return;
		}
		if(end.getTime()>Date.now()){
			console.log("Times can't be in the future")
			return;
		}
		const s = new OvernightSleepData(new Date(this.bedtime), new Date(this.wakeTime));
		this.sleepService.logOvernightData(s);
		console.log('Logged:', s.summaryString());
		this.bedtime = this.toLoc(this.daysAgo(1,23));;
		this.wakeTime = this.toLoc(this.daysAgo(0,7));
	}
}
