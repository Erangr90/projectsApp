import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loader:boolean = false

  constructor(public authService: AuthService) {}

  ngOnInit(): void {

  }
  onLogin(form: NgForm){
    if(form.invalid){
      return
    }
    this.loader = true
    this.authService.login(form.value.email,form.value.password)
    form.reset()
  }
}
