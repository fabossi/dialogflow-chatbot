import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DialogFlowService {

  dialogFlowURL = '';


  constructor(private http: HttpClient) { }

  callDialogFlow(sessionId, text) {
    return this.http.post<any>(
      this.dialogFlowURL, {
      sessionId,
      queryInput: {
        text: {
          text,
          languageEncode: 'en-US'
        }
      }
    }).toPromise();
  }
}
