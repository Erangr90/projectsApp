import {Comment} from './comment.model'
export interface Project {
  id:string
  name:string,
  address:string,
  status:string,
  endDate:string,
  comments?:Comment[],
  image:string | File
}
