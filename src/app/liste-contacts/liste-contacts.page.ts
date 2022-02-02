import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Contact } from '../models/Contact';
import { NavigationExtras } from '@angular/router';
import { ContactAcessService } from '../services/contact-acess.service';
import { ContactAuthService } from '../services/contact-auth.service';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';

@Component({
  selector: 'app-liste-contacts',
  templateUrl: './liste-contacts.page.html',
  styleUrls: ['./liste-contacts.page.scss'],
})
export class ListeContactsPage implements OnInit {
  contacts: Contact[];
  email: string;

  constructor(
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private firestore: ContactAcessService,
    private fireAuth: ContactAuthService,
    private angularFireStorage: AngularFireStorage
  ) {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {
    this.fireAuth.userDetails().subscribe((res) => {
      console.log('res', res);
      if (res !== null) {
        this.email = res.email;
        this.loadContact();
      } else {
        this.navCtrl.navigateForward('/authentification');
      }
    });
    console.log(this.contacts);
  }
  loadContact() {
    this.firestore.getAllPersonalContact(this?.email).subscribe((data) => {
      this.contacts = data.map((e) => ({
        nom: e.payload.doc.data().nom,
        prenom: e.payload.doc.data().prenom,
        email: e.payload.doc.data().email,
        tel: e.payload.doc.data().tel,
        ville: e.payload.doc.data().ville,
        adresse: e.payload.doc.data().adresse,
        service: e.payload.doc.data().service,
        //src: this.getImageByMail(e.payload.doc.data().email),
        src: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
      }));
    });
  }
  getImageByMail(email) {
    const fileStoragePath = `Contact/${email}/profileImage`;
    const imageRef = this.angularFireStorage.ref(fileStoragePath);
    console.log('img ', imageRef.getDownloadURL());
    return imageRef.getDownloadURL();
    //return 'https://firebasestorage.googleapis.com/v0/b/contactsmanager-17e96.appspot.com/o/Compte%2Fchoubari%40gmail.com%2FprofileImage';
  }
  detailsContact(email) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        emailContact: email,
        from: 'liste-contacts',
      },
    };
    this.navCtrl.navigateForward('/detail-contact', navigationExtras);
  }

  ajouterContact() {
    this.navCtrl.navigateRoot('/ajouter-contact');
  }
}
