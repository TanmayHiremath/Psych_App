import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor() { }
  setJdata(key:string, value:string) { localStorage.setItem(key, value); }

  getJdata(key:string) { return localStorage.getItem(key) }
}
