import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  
  
  constructor(private translate: TranslateService){
    this.translate.setDefaultLang('en');
    const storedLang = localStorage.getItem('selectedLanguage');
    translate.use(storedLang || translate.getDefaultLang());
    
  
  }

  switchLanguage(language: string){
    this.translate.use(language);
    localStorage.setItem('selectedLanguage', language);
  }
}
