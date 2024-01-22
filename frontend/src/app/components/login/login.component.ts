import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [

  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit(): void {

  }

  login() {
    this.authenticationService.login('admin@gmail.com', '123').subscribe(data => console.log("login success"));
  }
}
