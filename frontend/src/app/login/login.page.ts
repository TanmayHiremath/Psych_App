import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service'
import { Socket } from 'ngx-socket-io';
import { Router } from '@angular/router'
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string
  roomName: string
  newRoom: boolean
  constructor(private service: DataService, private socket: Socket, private router: Router, private storage: Storage) {
    this.newRoom = false;
    this.username = '';
    console.log(this.username)
    this.roomName = '';
  }

  ngOnInit() {

  }
  join_room() {
    this.newRoom = false;
    this.socket.emit('join room', { username: this.username, roomName: this.roomName })
    this.socket.on('no room exists', (data) => {
      alert(data['roomName'] + ' does not exist')
    });
    this.storage.set('username', this.username)
    this.storage.set('roomName', this.roomName).then(() => { this.router.navigate(['../chat']) })
  }

  new_room() {
    this.roomName='Loading....'
    this.newRoom = true;
    this.socket.emit('new room', { username: this.username })
    this.storage.set('username', this.username)

    this.socket.on('room created', (data: object) => {
      this.roomName = data['roomName']
      this.storage.set('roomName', this.roomName).then(() => { this.router.navigate(['../chat']) })
    });

  }
}
