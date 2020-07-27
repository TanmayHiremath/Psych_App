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
  current_message: string=''
  messages = []
  others_messages = []
  constructor(private socket: Socket, private service: DataService) {
    this.username = this.service.getJdata('username')
    let observable = new Observable(observer => {
      this.socket.on('received', (data: object) => {
        console.log('recieved message')
        observer.next(data);
      });
    })
    observable.subscribe(data => {

      this.messages.push(data);
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
      this.messages.push({ username: this.username, message: this.current_message })
      this.socket.emit('chat message', { username: this.username, message: this.current_message })
      this.current_message = ''
    }
  }

  receive_message() {

  }
}
