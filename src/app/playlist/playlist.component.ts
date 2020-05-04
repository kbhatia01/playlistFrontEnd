import { Component, OnInit, Inject } from '@angular/core';
import { GlobalVariable } from '../../../global';
import { ActivatedRoute, Router } from '@angular/router';
import { PlaylistService } from '../playlistService/playlist.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';


@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss']
})


export class PlaylistComponent implements OnInit {
  public downloadurl = GlobalVariable.Downloadurl;
  public url = GlobalVariable.url;
  searchText: string;
  public playlist;
  public playInt = -1;
  public User;
  public tags: string;
  public editFeild = false;
  public interval;
  public shuffle = false;
  constructor(public activatedRoute: ActivatedRoute, private playlistService: PlaylistService, public dialog: MatDialog,
    private toasts: ToastrService, public router: Router) {
    this.User = JSON.parse(localStorage.getItem('user'));
  }


  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(async (res: any) => {
      console.log(!res.state);
      if (!res.state) {
        let id = null;
        this.activatedRoute.queryParams.subscribe(parms => {
          id = parms['id'];
          this.playlistService.getPlaylistByID(id).subscribe(resp => {
            this.playlist = resp;
            if (this.playlist) {
              this.playlist.songs = this.getRendom(this.playlist.songs);
              this.tags = this.playlist.tags.join();
            }
            console.log('playlist', this.playlist);
          });
        });

      }

    });
  }

  value(id) {

    return this.url + '/playlist?id=' + id + '&utm_source=share';
  }
  copied() {
    this.toasts.success('link copied!!!');
  }
  getRendom(songs) {
    return _.shuffle(songs);
  }
  DeletePlaylist(id) {

    this.playlistService.updatePlaylist({ id, state: 'DEACTIVATED' }).subscribe(res => {
      if (res.status != 200) {
        alert('Internal server error');
      }
      else {
        this.router.navigateByUrl('/');

      }
    });
  }
  edit() {
    const data = {
      name: this.playlist.name,
      tags: this.tags.split(','),
      id: this.playlist._id
    };
    this.playlistService.updatePlaylist(data).subscribe(res => {
      console.log(res);
      this.ngOnInit();
    });
    this.editFeild = false;

  }
  openDialog(): void {
    const dialogRef = this.dialog.open(SongPopUpComponent, {
      width: '500px',
      hasBackdrop: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.ngOnInit();
    });
  }
  play(index) {
    this.playInt = index;
    this.playSong(this.playInt);
  }
  deleteSong(row) {
    let data = { id: this.playlist._id, songId: row };
    this.playlistService.deleteSong(data).subscribe(res => {
      console.log(res)
      if (res.status != 200) {
        console.log('Internal server error');
      }
      else {
        this.ngOnInit();
      }
    });
    this.playInt = -1;
  }
  playSong(val) {
    clearInterval(this.interval);

    this.playInt = val;
    this.interval = setInterval(() => {
      console.log(this.playInt);
      if (this.playlist.songs.length > this.playInt && !this.shuffle) {
        this.playInt++;
      }
      else if (this.shuffle) {
        this.playInt = Math.floor((Math.random())) % (this.playlist.songs.length - 1);

      }
      else {
        this.playInt = -1;
        clearInterval(this.interval);
      }
    }, 2000);

  }
  stopSong() {
    clearInterval(this.interval);
    this.playInt = -1;
  }

}



@Component({
  selector: 'app-playlistPopup',
  templateUrl: 'playlistPopup.html',
})
export class SongPopUpComponent extends PlaylistComponent {
  song: FormGroup;
  selectedFiles: FileList;

  constructor(

    public dialogRef: MatDialogRef<SongPopUpComponent>, private fb: FormBuilder,
    public dialog: MatDialog, public routers: ActivatedRoute, public router: Router,
    private playlistServices: PlaylistService, private toast: ToastrService) {
    super(routers, playlistServices, dialog, toast, router);
    this.song = this.fb.group({
      name: new FormControl(null, Validators.required),
      url: new FormControl()
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
  onSubmit() {

    let data = {
      "name": this.song.controls.name.value,
      "url": this.song.controls.url.value,
    };
    if (this.playlist.songs) {
      this.playlist.songs.push(data);
      this.playlist.id = this.playlist._id;
      this.playlistServices.updatePlaylist(this.playlist).subscribe(res => {
        console.log(res);
        if (res.status != 200) {
          this.toast.error('some Issue occur try after some time');

        }
        else {
          this.toast.success('created!!!');
          this.onNoClick();

        }
      });
    }
    console.log(data);
  }

}

