import { Component, OnInit } from '@angular/core';
import { Contact } from '../models/Contact';
import { MenuController, NavController } from '@ionic/angular';
import { ContactAcessService } from '../services/contact-acess.service';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-recommended-contacts',
  templateUrl: './recommended-contacts.page.html',
  styleUrls: ['./recommended-contacts.page.scss'],
})
export class RecommendedContactsPage implements OnInit {
  contacts: Contact[];
  email: string;

  constructor(
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private firestore: ContactAcessService
  ) {}

  ngOnInit() {
    this.loadContact();
  }
  loadContact() {
    this.firestore.getAllContact().subscribe((data) => {
      this.contacts = data.map((e) => ({
        // eslint-disable-next-line @typescript-eslint/dot-notation
        nom: e.payload.doc.data()['nom'],
        // eslint-disable-next-line @typescript-eslint/dot-notation
        prenom: e.payload.doc.data()['prenom'],
        // eslint-disable-next-line @typescript-eslint/dot-notation
        email: e.payload.doc.data()['email'],
        // eslint-disable-next-line @typescript-eslint/dot-notation
        tel: e.payload.doc.data()['tel'],
        // eslint-disable-next-line @typescript-eslint/dot-notation
        ville: e.payload.doc.data()['ville'],
        // eslint-disable-next-line @typescript-eslint/dot-notation
        adresse: e.payload.doc.data()['adresse'],
        // eslint-disable-next-line @typescript-eslint/dot-notation
        service: e.payload.doc.data()['service'],
        src: 'https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png',
      }));
      console.log(this.contacts);
    });
  }
  detailsContact(email: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        emailContact: email,
        from: 'liste-contacts-rec',
      },
    };
    this.navCtrl.navigateForward('/detail-contact', navigationExtras);
  }
}
