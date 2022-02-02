import { Component, OnInit } from '@angular/core';
import { ContactAcessService } from '../services/contact-acess.service';
import { Compte } from '../models/Compte';
import { ContactAuthService } from '../services/contact-auth.service';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  image: string;
  compte: Compte;
  email: string;
  ngFireUploadTask: AngularFireUploadTask;
  progressSnapshot: Observable<any>;
  fileUploadedPath: Observable<string>;

  constructor(
    private contactservice: ContactAcessService,
    private fireauth: ContactAuthService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private angularFireStorage: AngularFireStorage
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
          const fileStoragePath = `Compte/${this.email}/profileImage`;
          const imageRef = this.angularFireStorage.ref(fileStoragePath);
          this.fileUploadedPath = imageRef.getDownloadURL();
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
  fileUpload(event: FileList) {
    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') {
      console.log('File type is not supported!');
      return;
    }
    const fileStoragePath = `Compte/${this.email}/profileImage`;
    const imageRef = this.angularFireStorage.ref(fileStoragePath);
    this.ngFireUploadTask = this.angularFireStorage.upload(
      fileStoragePath,
      file
    );
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(
      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();
      })
    );
  }
}
