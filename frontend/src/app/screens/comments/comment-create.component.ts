import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators} from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProjectsService } from 'src/app/services/projects.service';
import { Comment } from 'src/app/models/comment.model';
import {mimeType} from "./mime-type.validator"

@Component({
  selector: 'app-comment-create',
  templateUrl: './comment-create.component.html',
  styleUrls: ['./comment-create.component.scss'],
})
export class CommentCreateComponent implements OnInit {
  enteredDescription: string = '';
  comment: Comment = {
    id:"",
    description:"",
  };
  loader:boolean = false
  form: FormGroup =  new FormGroup({
    'description': new FormControl(null,{ validators:[Validators.required, Validators.minLength(3)]}),
    'image': new FormControl(null,{ validators:[Validators.required], asyncValidators:[mimeType]}),
  })
  imagePreview:string = ""
  projectId:string = ""

  constructor(public projectsService: ProjectsService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('projectId')) {
        this.projectId = paramMap.get('projectId') || '';
      }
    });

  }
  // Add new comment to project
  onSaveComment() {
    // if (!this.form.value.name) {
    //   return;
    // }
    const comment: Comment = {
      id: '',
      description: this.form.value.name,
      image:this.form.value.image
    };
    this.loader = true
    this.projectsService.addComment(this.projectId,comment,this.form.value.image || null);
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
