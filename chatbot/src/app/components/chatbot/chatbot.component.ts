import { Component, OnInit } from '@angular/core';
import { DialogFlowService } from 'src/app/services/dialog-flow.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {

  messages = [];
  loading = false;

  // Random ID to maintain session with server
  sessionID = Math.random().toString(36).slice(-5);

  constructor(private dfService: DialogFlowService) { }

  ngOnInit() {
    this.addBotMessage('Human presence detected. How can I help you?');
  }

  handleUserMessage(event) {
    console.log(event);
    const text = event.message;
    this.addUserMessage(text);

    this.loading = true;

    this.dfService.callDialogFlow(this.sessionID, text).then((result) => {
      this.addBotMessage(result.fulfillmentText);
      this.loading = false;
    }).catch((err) => {

    });
  }

  // Helpers

  addUserMessage(text) {
    this.messages.push({
      text,
      sender: 'You',
      reply: true,
      date: new Date()
    });
  }

  addBotMessage(text) {
    this.messages.push({
      text,
      sender: 'Bot',
      date: new Date()
    });
  }



}
