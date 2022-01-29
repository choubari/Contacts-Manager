import { Component, OnInit } from '@angular/core';
import { ContactAcessService } from '../services/contact-acess.service';
import { Contact } from '../models/Contact';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ContactAuthService } from '../services/contact-auth.service';
import { Compte } from '../models/Compte';
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

export interface FILE {
  name: string;
  filepath: string;
  size: number;
}

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage implements OnInit {
  ngFireUploadTask: AngularFireUploadTask;
  progressNum: Observable<number>;
  progressSnapshot: Observable<any>;
  fileUploadedPath: Observable<string>;
  files: Observable<FILE[]>;
  fileName: string;
  fileSize: number;
  isImgUploading: boolean;
  isImgUploaded: boolean;

  contacts: Contact[];
  private inscriptionForm: FormGroup;
  private compte: Compte;

  private ngFirestoreCollection: AngularFirestoreCollection<FILE>;
  constructor(
    private angularFirestore: AngularFirestore,
    private angularFireStorage: AngularFireStorage,

    private fireAuth: ContactAuthService,
    private firestore: ContactAcessService,
    private formBuilder: FormBuilder,
    private naveCntrl: NavController
  ) {
    this.isImgUploading = false;
    this.isImgUploaded = false;
    this.ngFirestoreCollection =
      angularFirestore.collection<FILE>('filesCollection');
    this.files = this.ngFirestoreCollection.valueChanges();

    console.log('inscription form init');
    this.inscriptionForm = this.formBuilder.group({
      nom: [''],
      prenom: [''],
      email: [''],
      tel: [''],
      password: [''],
    });
  }
  ngOnInit() {}
  signUp() {
    console.log('signUp');
    this.fireAuth.singUp(this.inscriptionForm.value).then((res) => {
      console.log(res);
      this.firestore.newCompte(this.inscriptionForm.value);
      this.naveCntrl.navigateForward('/authentification');
    });
  }

  fileUpload(event: FileList) {
    const file = event.item(0);
    if (file.type.split('/')[0] !== 'image') {
      console.log('File type is not supported!');
      return;
    }

    this.isImgUploading = true;
    this.isImgUploaded = false;
    this.fileName = file.name;
    const fileStoragePath = `filesStorage/${new Date().getTime()}_${file.name}`;
    const imageRef = this.angularFireStorage.ref(fileStoragePath);
    this.ngFireUploadTask = this.angularFireStorage.upload(
      fileStoragePath,
      file
    );
    this.progressNum = this.ngFireUploadTask.percentageChanges();
    this.progressSnapshot = this.ngFireUploadTask.snapshotChanges().pipe(
      finalize(() => {
        this.fileUploadedPath = imageRef.getDownloadURL();
        this.fileUploadedPath.subscribe(
          (resp) => {
            this.fileStorage({
              name: file.name,
              filepath: resp,
              size: this.fileSize,
            });
            this.isImgUploading = false;
            this.isImgUploaded = true;
          },
          (error) => {
            console.log(error);
          }
        );
      }),
      tap((snap) => {
        this.fileSize = snap.totalBytes;
      })
    );
  }

  fileStorage(image: FILE) {
    const imgId = this.angularFirestore.createId();
    this.ngFirestoreCollection
      .doc(imgId)
      .set(image)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
