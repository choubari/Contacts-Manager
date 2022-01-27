import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactAuthService } from './services/contact-auth.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  email: string;
  public appPages = [
    { title: 'Mes contacts', url: '/liste-contacts', icon: 'person' },
    {
      title: 'Recommendations',
      url: '/recommended-contacts',
      icon: 'paper-plane',
    },
    { title: 'Profile', url: '/profile', icon: 'heart' },
    { title: 'Deconnexion', url: '/deconnexion', icon: 'archive' },
  ];
  constructor(
    private route: ActivatedRoute,
    private fireauth: ContactAuthService,
    private navCtrl: NavController
  ) {
    /*
    this.test = 'test@gmail.Com';
    this.route.queryParams.subscribe((params) => {
      this.email = params.emailSession;
    });
    */
  }
  ngOnInit() {
    this.fireauth.userDetails().subscribe(
      (res) => {
        console.log('res', res);
        if (res !== null) {
          this.email = res.email;
          console.log('email: ', this.email);
        } else {
          this.navCtrl.navigateForward('/authentification');
        }
      },
      (err) => {
        console.log('err', err);
      }
    );
    //console.log();
  }
}
