import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private storage:Storage) { }
  setJdata(key:string, value:string) { this.storage.set(key, value); }

  getJdata(key:string) { return this.storage.get(key) }
}
