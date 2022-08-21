import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  loader:boolean = false

  constructor(public authService: AuthService) {}

  ngOnInit(): void {

  }
  onSignup(form: NgForm){
    if(form.invalid){
      return
    }
    this.loader = true
    this.authService.createUser(form.value.email,form.value.password)
    form.reset()

  }
}
