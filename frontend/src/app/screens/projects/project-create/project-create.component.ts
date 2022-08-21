import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProjectsService } from 'src/app/services/projects.service';
import { Project } from '../../../models/project.model';
import {mimeType} from "./mime-type.validator"

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
})
export class ProjectCreateComponent implements OnInit {
  enteredName: string = '';
  enteredAddress: string = '';
  enteredStatus: string = '';
  enteredEndDate: string = '';
  private mode = 'create';
  private projectId: string = "";
  project: Project = {
    id:"",
    name:"",
    address: "",
    status:"",
    endDate:"",
    image:"",
    comments:undefined,
  };
  loader:boolean = false
  form: FormGroup =  new FormGroup({
    'name': new FormControl(null,{ validators:[Validators.required, Validators.minLength(3)]}),
    'address': new FormControl(null,{ validators:[Validators.required, Validators.minLength(3)]}),
    'status': new FormControl(null,{ validators:[Validators.required, Validators.minLength(3)]}),
    'endDate': new FormControl(null,{ validators:[Validators.required, Validators.minLength(3)]}),
    'image': new FormControl(null,{ validators:[Validators.required], asyncValidators:[mimeType]}),
  })
  imagePreview:string = ""

  constructor(public projectsService: ProjectsService, public route: ActivatedRoute) {}

  ngOnInit(): void {

  }
  // Save new Project
  onSaveProject() {
    if (this.form.invalid) {
      return;
    }
    const project: Project = {
      id: '',
      name: this.form.value.name,
      address: this.form.value.address,
      status: this.form.value.status,
      endDate: this.form.value.endDate,
      image:this.form.value.image
    };
    this.loader = true
    this.projectsService.addProject(project,this.form.value.image);
    this.loader = false
   this.form.reset();
  }

  onImageUpload(event:Event){
    const files = (event.target as HTMLInputElement).files
    if(files && files.length > 0){
      const file = files[0]
      this.form.patchValue({image:file})
      this.form.get('image')?.updateValueAndValidity()
      const reader = new FileReader()
      reader.onload = ()=>{
        this.imagePreview = reader.result as string
      }
      reader.readAsDataURL(file)
    }

  }
}
