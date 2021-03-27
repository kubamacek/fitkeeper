import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  private notify = new Subject<string>();

  constructor(private snackBar: MatSnackBar) {
    this.notify.subscribe(message => {
      this.snackBar.open(message, null, {
        duration: 5000,
        panelClass: ['snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });
   }

   notify_user(message){
     this.notify.next(message);
   }
}
