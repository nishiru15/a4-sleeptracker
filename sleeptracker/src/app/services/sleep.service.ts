import { Injectable } from '@angular/core';
import { SleepData } from '../data/sleep-data';
import { OvernightSleepData } from '../data/overnight-sleep-data';
import { StanfordSleepinessData } from '../data/stanford-sleepiness-data';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class SleepService {
	private static LoadDefaultData:boolean = true;
	public static AllSleepData:SleepData[] = [];
	public static AllOvernightData:OvernightSleepData[] = [];
	public static AllSleepinessData:StanfordSleepinessData[] = [];

	constructor() {
		if(SleepService.LoadDefaultData) {
			SleepService.LoadDefaultData = false;
			this.loadData();
	}
	}

	private addDefaultData() {
		var goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(1, 3, 0); //1:03am
		var wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 8 * 60 * 60 * 1000); //Sleep for exactly eight hours, waking up at 9:03am
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp)); // add that person was asleep 1am-9am yesterday
		var sleepinessDate = new Date();
		sleepinessDate.setDate(sleepinessDate.getDate() - 1); //set to yesterday
		sleepinessDate.setHours(14, 38, 0); //2:38pm
		this.logSleepinessData(new StanfordSleepinessData(4, sleepinessDate)); // add sleepiness at 2pm
		goToBed = new Date();
		goToBed.setDate(goToBed.getDate() - 1); //set to yesterday
		goToBed.setHours(23, 11, 0); //11:11pm
		wakeUp = new Date();
		wakeUp.setTime(goToBed.getTime() + 9 * 60 * 60 * 1000); //Sleep for exactly nine hours
		this.logOvernightData(new OvernightSleepData(goToBed, wakeUp));
	}

	public logOvernightData(sleepData:OvernightSleepData) {
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllOvernightData.push(sleepData);
		this.saveData();
	}

	public logSleepinessData(sleepData:StanfordSleepinessData) {
		SleepService.AllSleepData.push(sleepData);
		SleepService.AllSleepinessData.push(sleepData);
		this.saveData();
	}

	delData(log:SleepData){
		SleepService.AllSleepData= SleepService.AllSleepData.filter(d=>d.id!==log.id);
		SleepService.AllOvernightData= SleepService.AllOvernightData.filter(d=>d.id!== log.id);
		SleepService.AllSleepinessData = SleepService.AllSleepinessData.filter(d=> d.id!== log.id);
		this.saveData();
	}

	restData(log:SleepData){
		SleepService.AllSleepData.push(log);
		if(log instanceof OvernightSleepData){
			SleepService.AllOvernightData.push(log);
		}
		else{
			SleepService.AllSleepinessData.push(log as StanfordSleepinessData);
		}
		this.saveData();
	}

	async saveData(){
		await Preferences.set({key: 'sleepData', value: JSON.stringify(SleepService.AllSleepData)});
	}

	async loadData(){
		const{value} = await Preferences.get({key: 'sleepData'});
		if(value== null){
			this.addDefaultData();
			return;
		}
		for (const item of JSON.parse(value)){
			let log;
			if('sleepStart' in item){
				log = new OvernightSleepData(new Date(item.sleepStart), new Date(item.sleepEnd));
				SleepService.AllOvernightData.push(log);
			}
			else{
				log = new StanfordSleepinessData(item.loggedValue, new Date(item.loggdAt));
				SleepService.AllSleepinessData.push(log);
			}
			log.id = item.id;
			log.loggedAt= new Date(item.loggedAt);
			SleepService.AllSleepData.push(log);
		}
	}
}
