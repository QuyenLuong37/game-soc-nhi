import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'game';
  constructor(private http: HttpClient) {
    
  }
  
  ngOnInit() {
    this.http.post(`https://api.fpt.ai/hmi/tts/v5`, 'Đây là nơi trưng bày các bảo bối thần kì từ đời đầu đến đời mới nhất của thế kỉ 22, Sóc Út đố bạn biết?', {
      headers: new HttpHeaders({
        'api-key': 'FcgCeDqR6Xd5xJB0Ok7cKiV7fpP6YRxK',
        // 'callback_url': 'https://jsonplaceholder.typicode.com/posts'
        'format': 'mp3'
      })
    }).subscribe(res => {
      console.log('res: ', res);
      
    })
  }
}
