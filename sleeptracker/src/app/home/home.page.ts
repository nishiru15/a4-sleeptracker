import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonButton, IonList, IonLabel, IonDatetime, IonDatetimeButton, IonModal, IonRadioGroup, IonRadio, ToastController} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonButton, IonList, IonLabel, IonDatetime, IonDatetimeButton, IonModal ,IonRadioGroup, IonRadio, FormsModule],})
export class HomePage {
	bedtime:string = this.toLoc(this.daysAgo(1,23));
	wakeTime:string = this.toLoc(this.daysAgo(0,7));
	level= StanfordSleepinessData.ScaleValues.map((text, value)=> ({value:value, text: text})).filter(level=>level.value>0);
	selLevel:number | null = null;
  	constructor(public sleepService:SleepService, private toastCtrl:ToastController) {

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

	async tHelper(message:string, undo?: ()=> void){
		const toast =await this.toastCtrl.create({
			message:message, duration:2500, position: 'top', buttons: undo ? [{text:'Undo', handler: undo}]: [],
		});
		await toast.present();
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
			this.tHelper('Fill both times');
			return;
		}		
		if(end <=start){
			this.tHelper('Bedtime should be before wake up time');
			return;
		}
		if(end.getTime()>Date.now()){
			this.tHelper("Times can't be in the future");
			return;
		}
		const s = new OvernightSleepData(new Date(this.bedtime), new Date(this.wakeTime));
		this.sleepService.logOvernightData(s);
		this.tHelper('Logged: ' +s.summaryString(), () => this.sleepService.delData(s));
		this.bedtime = this.toLoc(this.daysAgo(1,23));;
		this.wakeTime = this.toLoc(this.daysAgo(0,7));
	}

	logSleepiness(){
		if(this.selLevel=== null){
			this.tHelper('Pick sleepiness level');
			return;
		}
		const s = new StanfordSleepinessData(this.selLevel);
		this.sleepService.logSleepinessData(s);
		this.tHelper('Logged: '+ s.summaryString(), ()=> this.sleepService.delData(s));
		this.selLevel = null;
	}
}
