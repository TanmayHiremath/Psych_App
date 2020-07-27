import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { DataService } from '../data.service'
@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  username: string
  roomName: string
  current_message: string = ''
  messages = []
  others_messages = []
  constructor(private socket: Socket, private service: DataService) {
    this.username = this.service.getJdata('username')
    this.roomName = this.service.getJdata('roomName')
    let recieved = new Observable(observer => {
      this.socket.on('received', (data: object) => {
        console.log('recieved message')
        observer.next(data);
      });
    })
    recieved.subscribe((data: object) => {
      data['type'] = 'message'
      this.messages.push(data);
    });

    this.socket.on('joined room', (data: object) => {
      this.messages.push({ username: data['username'], roomName: data['roomName'], type: 'join' })
    });
  }

  ngOnInit() {
  }

  key_press(event) {
    if (event.keyCode == 13) {
      this.send_message()
    }
  }

  send_message() {
    if (this.current_message != '') {
      console.log(this.current_message)
      this.messages.push({ username: this.username, message: this.current_message, type: 'message' })
      this.socket.emit('chat message', { username: this.username, message: this.current_message, roomName: this.roomName })
      this.current_message = ''
    }
  }

  receive_message() {

  }
}
