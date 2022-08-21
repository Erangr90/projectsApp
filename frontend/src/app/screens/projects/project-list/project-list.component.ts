import { Component, OnDestroy, OnInit } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { ProjectsService } from "src/app/services/projects.service";
import { Project } from "../../../models/project.model";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector:'app-project-list',
  templateUrl:'./project-list.component.html',
  styleUrls:['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy{

projects:Project[] = []
private projectSub: Subscription = new Subscription;
loader:boolean = false
totalProjects:number = 0
projectsPerPage:number = 5
currentPage = 1
pageSizeOptions:number[] = [1,2,5,10]
private authStatusSub: Subscription = new Subscription;
isAuth:boolean = false


 constructor(public projectsService:ProjectsService, public authService:AuthService){


 }
  ngOnDestroy(): void {
    this.projectSub.unsubscribe()
    this.authStatusSub.unsubscribe()
  }
  ngOnInit(): void {
    this.loader = true
    this.projectsService.getProjects(this.projectsPerPage,this.currentPage)
    this.projectSub = this.projectsService.getProjectUpdateListener().subscribe((projectData:{projects:Project[], count:number})=>{
      this.projects = projectData.projects
      this.totalProjects = projectData.count
      this.loader = false

    })
    this.isAuth = this.authService.getIsAuth()
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(isAuth=>{
      this.isAuth = isAuth


    })
  }


  onChangePage(pageData:PageEvent){
    this.loader = true
    this.currentPage = pageData.pageIndex + 1
    this.projectsPerPage = pageData.pageSize
    this.projectsService.getProjects(this.projectsPerPage,this.currentPage)



  }


}
