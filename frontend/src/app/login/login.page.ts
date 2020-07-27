import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service'
import { Socket } from 'ngx-socket-io';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string
  roomName: string
  constructor(private service: DataService, private socket: Socket) { }

  ngOnInit() {
    this.username = '';
    this.roomName = '';
  }
  join_room() {
    this.socket.emit('join room', { username: this.username, roomName: this.roomName })
    this.service.setJdata('username', this.username)
    this.service.setJdata('roomName', this.roomName)
    this.socket.on('no room exists',(data)=>{
      alert(data['roomName']+' does not exist')
    });

  }

  new_room() {
    this.socket.emit('new room', { username: this.username, roomName: this.roomName })
    this.service.setJdata('username', this.username)
    this.service.setJdata('roomName', this.roomName)
    this.socket.on('room exists',(data)=>{
      alert(data['roomName']+'  already exists')
    });
  }
}
