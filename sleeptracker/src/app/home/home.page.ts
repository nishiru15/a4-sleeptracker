import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonButton, IonList, IonLabel, IonDatetime, IonDatetimeButton, IonModal, IonRadioGroup, IonRadio, IonItemSliding, IonItemOptions, IonItemOption, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonToggle, ToastController} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { SleepService } from '../services/sleep.service';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { LocalNotifications } from '@capacitor/local-notifications';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonButton, IonList, IonLabel, IonDatetime, IonDatetimeButton, IonModal ,IonRadioGroup, IonRadio, IonItemSliding, IonItemOptions, IonItemOption, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonToggle, FormsModule],})
export class HomePage {
	bedtime:string = this.toLoc(this.daysAgo(1,23));
	wakeTime:string = this.toLoc(this.daysAgo(0,7));
	level= StanfordSleepinessData.ScaleValues.map((text, value)=> ({value:value, text: text})).filter(level=>level.value>0);
	selLevel:number | null = null;
	notifs:boolean= false;
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

	get sortedLogs(){
		return [...this.allSleepData].sort((a,b)=> b.sortDate().getTime()-a.sortDate().getTime());
	}

	get lastNight(){
		const nights = [...SleepService.AllOvernightData].sort((a,b)=>b.sortDate().getTime()-a.sortDate().getTime());
		return nights.length>0?nights[0]: null;
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

	async deleteLog(log:SleepData, item:IonItemSliding){
		await item.close();
		this.sleepService.delData(log);
		this.tHelper('Log deleted', ()=>this.sleepService.restData(log));
	}

	async allowNotifs(){
		let allow = await LocalNotifications.checkPermissions();
		if(allow.display!=='granted'){
			allow= await LocalNotifications.requestPermissions();
		}
		if(allow.display!== 'granted'){
			this.tHelper('Notifications are blocked, you can allow them in settings');
			return false;
		}
		return true;
	}

	async testNotif(){
		if(!(await this.allowNotifs())){
			return;
		}
		await LocalNotifications.schedule({notifications:[{
			id:999, title: 'How sleepy are you?', body: 'Log your sleepiness', schedule: {at: new Date(Date.now() + 5000)},
		}]});
		this.tHelper('A notification will show in 5 seconds');
	}

	async toggleNotics(event:any){
		const on = event.detail.checked;
		if(on){
			if(!(await this.allowNotifs())){
				this.notifs= false;
				return;
			}
			const notifications:any[] = [];
			let id = 1;
			for (let day= 0; day <7; day++){
				for (const hour of [10,14,18]){
					const at = new Date();
					at.setDate(at.getDate()+ day);
					at.setHours(hour,0,0,0);
					if(at.getTime()> Date.now()){
						notifications.push({id:id++, title:'How sleepy are you?',body: 'Log your sleepiness', schedule: {at: at}});
					}
				}
			}
			await LocalNotifications.schedule({notifications:notifications});
				this.tHelper('Reminder on 10am, 2pm, and 6pm');
		}
		else{
			const waiting = await LocalNotifications.getPending();
			if(waiting.notifications.length>0){
				await LocalNotifications.cancel({notifications: waiting.notifications});

			}
			this.tHelper('Reminders off');
		}
		this.notifs= on;
	}
}
