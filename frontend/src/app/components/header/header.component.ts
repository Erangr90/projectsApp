import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector:'app-header',
  templateUrl:'./header.component.html',
  styleUrls:['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy{

  private authListenerSubs: Subscription = new Subscription;
  userIsAuth:boolean = false

  constructor(private authService:AuthService){}

  ngOnInit(): void {
    this.userIsAuth = this.authService.getIsAuth()
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuth=>{
      this.userIsAuth = isAuth

    })

  }
  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe()

  }

  onLogout(){
    this.authService.logout()
  }



}
