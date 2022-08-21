const express = require("express");
const router = express.Router();
const Project = require("../models/project");
const Comment = require("../models/comment");
const { findOne } = require("../models/project");
const multer = require('multer')
const checkAuth = require("../middleware/check-auth")

// Mime types map for
const MIME_TYPE_MAP = {
  'image/png':'png',
  'image/jpeg':'jpg',
  'image/jpg':'jpg'
}

// Upload images
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    const isValid = MIME_TYPE_MAP[file.mimetype]
    let error = new Error("Invalid mime type")
    if(isValid){
      error = null
    }
    cb(error,"backend/images")
  },
  filename:(req,file,cb) => {
    const name = file.originalname.toLocaleLowerCase().split(' ').join('-')
    const ext = MIME_TYPE_MAP[file.mimetype]
    cb(null,`${name}-${Date.now()}.${ext}`)

  }
})

// Create new Project
router.post("/",checkAuth, multer({storage:storage}).single("image"), (req, res) => {
    try {
      const url = req.protocol + '://' + req.get("host")
      const project = new Project({
        name: req.body.name,
        address: req.body.address,
        status: req.body.status,
        endDate: req.body.endDate,
        comment: req.body.comment,
        image:url + "/images/" + req.file.filename
      });
      project.save().then((newProject) => {
        res.status(201).json({
          msg: "Posts added !",
          project: {
            ...newProject,
            id:newProject._id
          }
        });
      });
      console.log(project);
    } catch (error) {
      console.log(error);
      res.json(error.message);
    }
  });
// Get all projects
router.get("/",checkAuth, async (req, res) => {
    try {
      const pageSize = +req.query.pageSize
      const currentPage = +req.query.page
      const projectQuery =  Project.find()
      let projects
      if(pageSize && currentPage){
        projectQuery.skip(pageSize * (currentPage - 1)).limit(pageSize).populate('comments')
      }
      projectQuery.then(found=>{
        projects = found
        return Project.count()
      }).then(count=>{
       res.status(200).json({
        projects,
        count
       });
      })
    } catch (error) { 
      console.log(error);
      res.json(error.message);
    }
  });

  
// Add comment to project
router.put("/:id",checkAuth, multer({storage:storage}).single("image"),async (req, res) => {
    try {
      const url = req.protocol + '://' + req.get("host")
      const comment = new Comment({
        description:req.body.description,
        image: req.file ? url + "/images/" + req.file.filename : null
      })
      comment.save().then( async () => {

        let project = await Project.findOne({_id:req.params.id})
        if(project.comments && project.comments.length > 0){
          project.comments = [...project.comments, comment._id]

        }else{
          project.comments = [comment._id]

        }
        await project.save()
        res.status(200).json({ msg: "ok" });

      });
      
      
    } catch (error) {
      console.log(error);
      res.json(error.message);
    }
  });


module.exports = router;
