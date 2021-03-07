import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth,
    public authService: AuthService,
    private router: Router,
  ) {}
  userData: any[] = [];

  ngOnInit(): void {
    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userService.getUser(user).subscribe((data) => {
          this.userData = data.map((e) => e.payload.doc.data());
        });
      } else {
        this.router.navigate(['login'])
      }
    });
  }


}
