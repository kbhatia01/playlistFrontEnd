import { Component, OnInit, Inject, Injectable } from '@angular/core';
import { PlaylistService } from '../playlistService/playlist.service';
import { Upload } from 'aws-sdk/clients/devicefarm';
import { UploadService } from '../playlistService/upload.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GlobalVariable } from 'global';
import { Router } from '@angular/router';
import * as uuid from 'uuid';
import { NgxSpinnerService } from 'ngx-spinner';
export interface playlistData {
  animal: string;
  name: string;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  playlistArray: Array<any> = [];
  searchText: string;
  public downloadurl = GlobalVariable.Downloadurl;
  public User_name;
  constructor(private playlistService: PlaylistService, public dialog: MatDialog, private router: Router) {
    if (JSON.parse(localStorage.getItem('user'))) {
      this.User_name = JSON.parse(localStorage.getItem('user')).firstName;
    }

  }

  ngOnInit(): void {
    this.updateData();
  }

  updateData() {
    this.playlistService.getPlaylist().subscribe(result => {
      this.playlistArray = result;
      console.log(this.playlistArray);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PlaylistComponentPopup, {
      width: '500px',
      hasBackdrop: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.ngOnInit();
    });
  }
  playlistSongs(playlist, id) {
    this.router.navigateByUrl('playlist?id=' + id, { state: playlist });
  }
}

@Component({
  selector: 'app-homepopup',
  templateUrl: 'homepopup.html',
})
export class PlaylistComponentPopup extends HomeComponent {
  playlist: FormGroup
  selectedFiles: FileList;
  public fileName;
  public file;

  constructor(

    public dialogRef: MatDialogRef<PlaylistComponentPopup>, private fb: FormBuilder, private uploadService: UploadService,
    public dialog: MatDialog,
    public routers: Router, private spinner: NgxSpinnerService,
    private playlistServices: PlaylistService, private toast: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: playlistData) {
    super(playlistServices, dialog, routers);
    this.playlist = this.fb.group({
      name: new FormControl(null, Validators.required),
      tags: new FormControl()
    });
  }

  onNoClick(): void {
    this.dialogRef.close();

  }
  async onSubmit() {
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 5000);
    if (this.selectedFiles) {

      const myId = uuid.v4();
      this.file = this.selectedFiles.item(0);
      const name = this.file.name.split('.');
      console.log(this.file)
      this.fileName = myId + '.' + name[name.length - 1];
      await this.upload(this.fileName);
    }
    let data = {
      "name": this.playlist.controls.name.value,
      "tags": this.playlist.controls.tags.value ? this.playlist.controls.tags.value.split(',') : [],
      "image": this.fileName,
      "user_name": this.User_name
    }
    this.playlistServices.postPlaylist(data).subscribe(res => {
      console.log(res)
      this.spinner.hide();
      if (res.status != 201) {
        this.toast.error('some Issue occur try after some time');

      }
      else {
        this.toast.success('created!!!');
        this.onNoClick();

      }

    });

  }
  async upload(name) {
    await this.uploadService.uploadFile(this.file, name).then(res => {
      this.file = null;
      return res;
    });
  }

  selectFile(event) {
    this.selectedFiles = event.target.files;
  }
}

