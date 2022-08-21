import { Injectable } from "@angular/core";
import {Subject} from 'rxjs'
import { HttpClient } from "@angular/common/http";
import {map} from "rxjs/operators"
import { AuthData } from "../models/authData.model";
import { Router } from "@angular/router";



@Injectable({providedIn:'root'})
export class AuthService{

  private token:string = ""
  private authStatusListener = new Subject<boolean>()
  private isAuth:boolean = false
  private tokenTimer!: NodeJS.Timer;


  constructor(private http:HttpClient, private router:Router){}

  getToken(){
    return this.token
  }

  getIsAuth(){
    return this.isAuth
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }


  login(email: string, password:string){
    const authData: AuthData = {email:email, password:password}
    this.http.post<{token:string, expiresIn:number}>("http://localhost:3000/api/users/login",authData).subscribe(res=>{
      this.token = res.token
      if(res.token){
        const expiresInDuration = res.expiresIn
        this.setAuthTimer(expiresInDuration)
        this.isAuth = true
        this.authStatusListener.next(true)
        const now = new Date()
        const expirationDate = new Date(now.getTime() + expiresInDuration * 1000)
        this.saveAuthData(res.token,expirationDate)
        this.router.navigate(['/'])
      }
    })

  }

  logout(){
    this.token = ""
    this.isAuth = false
    this.authStatusListener.next(false)
    clearTimeout(this.tokenTimer)
    this.clearAuthData()
    this.router.navigate(['/login'])

  }

  private setAuthTimer(duration:number){
    this.tokenTimer = setTimeout(()=>{
      this.logout();
    },duration * 1000)
  }

  autoAuthUser(){
    const authInfo = this.getAuthData()
    if(!authInfo){
      return
    }
    const now = new Date()
    if(authInfo && authInfo?.expirationDate){
      const expTime = authInfo.expirationDate.getTime() - now.getTime()
      if(expTime > 0){
        this.token = authInfo.token
        this.isAuth = true
        this.setAuthTimer(expTime/1000)
        this.authStatusListener.next(true)

      }
    }

  }

  private saveAuthData(token:string, expirationDate: Date){
    localStorage.setItem('token', token)
    localStorage.setItem('expiration', expirationDate.toISOString())

  }

  private clearAuthData(){
    localStorage.removeItem("token")
    localStorage.removeItem("expiration")
  }

  private getAuthData(){
    const token = localStorage.getItem('token')
    const expirationDate = localStorage.getItem('expiration')
    if(!token || !expirationDate){
      return
    }
    return {
      token:token,
      expirationDate:new Date(expirationDate)
    }
  }

}
