import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service'
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string
  constructor(private service: DataService) { }

  ngOnInit() {
    this.username = ''
  }
  set_username() {
    this.service.setJdata('username', this.username)
    
  }
}
