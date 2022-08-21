import { Injectable } from "@angular/core";
import {Subject} from 'rxjs'
import { HttpClient } from "@angular/common/http";
import {map} from "rxjs/operators"
import { Project } from "../models/project.model";
import { Comment } from "../models/comment.model";
import { Router } from "@angular/router";

@Injectable({providedIn:'root'})
export class ProjectsService{
  private projects: Project[] = []
  private projectsUpdated = new Subject<{projects:Project[], count:number}>()

  constructor(private http:HttpClient, private router:Router){}

  // Get all Projects
  getProjects(projectsPerPag:number, currentPage:number) {
    const queryParams = `?pageSize=${projectsPerPag}&page=${currentPage}`
    this.http.get<{projects:any[], count:number}>('http://localhost:3000/api/projects' + queryParams)
    .pipe(map((projectsData)=>{
        return {projects: projectsData.projects.map(project=> {
          return {
            id:project._id,
            name:project.name,
            address:project.address,
            status:project.status,
            endDate:project.endDate,
            image:project.image,
            comment:project.comment ? project.comment : undefined,

          }
        }),count:projectsData.count}
    }))
    .subscribe((projects)=>{
      this.projects = projects.projects
      this.projectsUpdated.next({projects: [...this.projects], count: projects.count})

    })
  }
  // Keep project list updated
  getProjectUpdateListener(){
    return this.projectsUpdated.asObservable()
  }
  // Add new Project
  addProject(project:Project, image:File){
    const projectsData = new FormData()
    projectsData.append("name",project.name)
    projectsData.append("address",project.address)
    projectsData.append("status",project.status)
    projectsData.append("endDate",project.endDate)
    projectsData.append("image",image,project.name)
    this.http.post<{msg:string,project:Project}>('http://localhost:3000/api/projects',projectsData).subscribe((res)=>{
      this.router.navigate(["/"])
    })

  }
  // Add comment to project
  addComment(id:string,comment: Comment, image?:File){
    const CommentData = new FormData()
    CommentData.append("description",comment.description)
    if(image){
      CommentData.append("image",image,id)
    }



    this.http.put(`http://localhost:3000/api/projects/${id}`,CommentData).subscribe((res)=>{
      this.router.navigate(["/"])

    })
  }
}
