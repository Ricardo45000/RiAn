import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppComponent } from 'app/app.component';
import { AuthserviceService } from 'environments/airtable/authservice.service';

declare var $:any;

@Component({
    selector: 'lock-cmp',
    templateUrl: './lock.component.html'
})

export class LockComponent implements OnInit{

    test : Date = new Date();
    private toggleButton;
    private sidebarVisible: boolean;
    username: string = '';
    password: string = '';
    loading: boolean = false;
    selectedLanguage: any;

    

    constructor(
        private element : ElementRef, 
        private authService: AuthserviceService, 
        private router: Router,
        private translate: TranslateService, 
        private root: AppComponent) {
    
        this.sidebarVisible = false;
        this.translate.setDefaultLang("en");
    }
    checkFullPageBackgroundImage(){
        var $page = $('.full-page');
        var image_src = $page.data('image');

        if(image_src !== undefined){
            var image_container = '<div class="full-page-background" style="background-image: url(' + image_src + ') "/>'
            $page.append(image_container);
        }
    };

    ngOnInit(){
        this.authService.disconnect();
        this.checkFullPageBackgroundImage();

        var body = document.getElementsByTagName('body')[0];
        body.classList.add('lock-page');

        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

        setTimeout(function(){
            // after 1000 ms we add the class animated to the login/register card
            $('.card').removeClass('card-hidden');
        }, 700)
    }

    ngOnDestroy(){
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('lock-page');
    }
    sidebarToggle(){
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        var sidebar = document.getElementsByClassName('navbar-collapse')[0];
        if(this.sidebarVisible == false){
            setTimeout(function(){
                toggleButton.classList.add('toggled');
            },500);
            body.classList.add('nav-open');
            this.sidebarVisible = true;
        } else {
            this.toggleButton.classList.remove('toggled');
            this.sidebarVisible = false;
            body.classList.remove('nav-open');
        }
    }

    signIn(){
        this.loading = true;
        this.authService.signIn(this.username, this.password).subscribe((authenticated) => {
            
            if (authenticated) {
              // Successfully authenticated, navigate to the dashboard or perform other actions
              
              this.router.navigate(['/dashboard']);
              this.showNotification("top","center", "success", "Authentification done");
              
            } else {
              // Authentication failed, show an error message or take appropriate action
              this.showNotification("top","center", "warning", "Wrong combinaison. Try Again");
            }
            
            this.loading = false;
            
          });
    }

    showNotification(from: string, align: string, type: string, message: string){

    	$.notify({
        	icon: "ti-gift",
        	message: message
        },{
            type: type,
            timer: 1,
            placement: {
                from: from,
                align: align
            },
            template: '<div data-notify="container" class="col-11 col-md-4 alert alert-{0} alert-with-icon" role="alert"><button type="button" aria-hidden="true" class="close" data-notify="dismiss"><i class="nc-icon nc-simple-remove"></i></button><span data-notify="icon" class="nc-icon nc-bell-55"></span> <span data-notify="title">{1}</span> <span data-notify="message">{2}</span><div class="progress" data-notify="progressbar"><div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div></div><a href="{3}" target="{4}" data-notify="url"></a></div>'
        });
	}

    switchLanguage(language: string){
        this.selectedLanguage = language;
        this.root.switchLanguage(language);
    }
}
