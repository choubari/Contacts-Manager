import { Component, OnInit } from '@angular/core';
import { ContactAcessService } from '../services/contact-acess.service';
import { Compte } from '../models/Compte';
import { ContactAuthService } from '../services/contact-auth.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  image: string;
  compte: Compte;
  email: string;

  constructor(
    private contactservice: ContactAcessService,
    private fireauth: ContactAuthService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) {
    //this.route.queryParams.subscribe((params) => {
    //this.email = params.emailSession;
    //});
  }

  ngOnInit() {
    this.fireauth.userDetails().subscribe(
      (res) => {
        console.log('res', res);
        if (res !== null) {
          this.email = res.email;
          console.log('email: ', this.email);
          this.contactservice.getCompte(this.email).subscribe((result) => {
            this.compte = result as Compte;
            console.log('dd', res);
          });
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
