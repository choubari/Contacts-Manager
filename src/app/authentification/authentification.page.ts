import { Component, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { MenuController, NavController } from '@ionic/angular';
import { NavigationExtras } from '@angular/router';
import { ContactAuthService } from '../services/contact-auth.service';
import { ContactAcessService } from '../services/contact-acess.service';

@Component({
  selector: 'app-authentification',
  templateUrl: './authentification.page.html',
  styleUrls: ['./authentification.page.scss'],
})
export class AuthentificationPage implements OnInit {
  authForm: any;

  constructor(
    private fireAuth: ContactAuthService,
    private formBuilder: FormBuilder,
    private naveCntrl: NavController,
    private menuCtrl: MenuController
  ) {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.authForm = this.formBuilder.group({
      email: [''],
      password: [''],
    });
  }

  singIn() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        emailSession: this.authForm.email,
        from: 'liste-contacts',
      },
    };
    this.fireAuth.singIn(this.authForm.value).then((res) => {
      console.log('SingIn ' + res);
      this.naveCntrl.navigateForward('/liste-contacts', navigationExtras);
    });
  }

  singUp() {
    this.naveCntrl.navigateForward('/inscription');
  }
}
