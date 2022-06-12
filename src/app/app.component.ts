import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { catchError, delay, map, of, timer } from 'rxjs';
import { data } from './data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'game';
  loading = false;
  isReady = false;
  listOfQuestionsOrigin: any[] = [];
  listOfQuestions: any[] = [];
  questionSelectedIndex = 0;
  isCompleteAnswer = false;
  score = 0;
  choiceSelected: any;
  voice: HTMLAudioElement | any;
  thinkingSound: HTMLAudioElement | any;
  isCorrectAnswer: 0 | 1 | 2 = 0;
  constructor(private http: HttpClient) {
    
  }
  
  ngOnInit() {
    
  }

  replay() {
    this.thinkingSound.pause();
    this.thinkingSound.currentTime = 0;
    this.voice.currentTime = 0;
    this.voice.play();
  }

  answer(choice: any, question: any) {
    this.choiceSelected = choice;
    this.voice?.pause();
    this.voice.currentTime = 0;
    if (this.thinkingSound) {
      this.thinkingSound?.pause();
      this.thinkingSound.currentTime = 0;
    }
    const nextQuestions = this.listOfQuestionsOrigin.filter((i, index) => index === this.questionSelectedIndex + 1);
    if (choice?.id === question.correct.idChoice) {
      this.isCorrectAnswer = 1;
      this.score += 20;
      const correctAudio = new Audio('../assets/audio/correct-answer-audio.mp3');
      correctAudio.play();
    } else {
      this.isCorrectAnswer = 2;
      const correctAudio = new Audio('../assets/audio/wrong-answer-audio.mp3');
      correctAudio.play();
    }
    if (nextQuestions.length) {
      timer(3000).subscribe(() => {
        this.isCorrectAnswer = 0;
        this.choiceSelected = null;
        this.questionSelectedIndex = this.questionSelectedIndex + 1;
         this.listOfQuestions = nextQuestions;
         const textToSpeech = this.convertTextToSpeech();
         this.getAudio(textToSpeech);
      })
    } else {
      timer(3000).subscribe(() => {
        this.isCorrectAnswer = 0;
        this.isCompleteAnswer = true;
        const completeSound = new Audio('../assets/audio/audio-finish.mp3');
        completeSound.play();
      })
    }
  }

  getQuestions() {
    this.loading = true;
    of(data).pipe(
      delay(0)
    ).subscribe(res => {
      this.loading = false;
      console.log('res: ', res);
      this.listOfQuestionsOrigin = res.map((item, index) => {
        return item
      })
      this.listOfQuestions = [this.listOfQuestionsOrigin[0]];
      const textToSpeech = this.convertTextToSpeech();
      this.getAudio(textToSpeech);
    })
  }

  start() {
    this.isReady = true;
    const startAudio = new Audio('../assets/audio/start.mp3');
    startAudio.play();
    this.getQuestions();
  }

  getAudio(text: string) {
    this.http.post(`https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=AIzaSyDCP5_20c8li-BvfBSxOBpl6Q97ik8bzls`, {
      "audioConfig": {
        "audioEncoding": "LINEAR16",
        "pitch": 0,
        "speakingRate": 1
      },
      "input": {
        "text": text
      },
      "voice": {
        "languageCode": "vi-VN",
        "name": "vi-VN-Standard-A"
      }
    }, {
      headers: {
        // 'Authorization': 'Bearer AIzaSyDCP5_20c8li-BvfBSxOBpl6Q97ik8bzls'
      }
    }).pipe(
      catchError(err => {
        return of(err);
      })
    ).subscribe(res => {
      console.log('res: ', res);
      this.voice = new Audio("data:audio/wav;base64," + res.audioContent);
      this.voice.play().then((r: any) => {
        console.log('result: ', r);
        
      });
      this.voice.addEventListener("ended", () => {
        this.thinkingSound = new Audio('../assets/audio/audiothinking.mp3');
        this.thinkingSound.play();
      });
    })
  }

  private convertTextToSpeech() {
    const textToSpeech = this.listOfQuestions.map((item, index) => {
      const choiceToText = item.choices.map((c: any, i: number) => {
        return `Đáp án ${this.mapIndexToAlphabet(i)}, ${c.name}`
      }).join('. ')
      return `${item.name}. ${choiceToText}`
    }).join('')
    console.log('texttospeech: ', textToSpeech);
    return textToSpeech;
  }

  private mapIndexToAlphabet(index: number) {
    if (index === 0) {
      return 'A';
    } else if (index === 1) {
      return 'B';
    } else if (index === 2) {
      return 'C';
    } else if (index === 3) {
      return 'D';
    }
    return '';
  }
}
