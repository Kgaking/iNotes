const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Note = require("../models/Note");
const { body, validationResult } = require("express-validator");

//ROUTE 1: Get All the Notes using Get "api/notes/fetchallnotes". login required
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

//ROUTE 2: Add new Notes using POST "api/notes/addnote". login required
router.post('/addnote',fetchUser,[
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be atleast 5 characters').isLength({ min: 5 }),], async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title, description, tag, user: req.user.id
      });
      const savednote = await note.save();
      res.json(savednote);

    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  });

//ROUTE 3: Update an existing Note using PUT "api/notes/updatenote". login required
router.put('/updatenote/:id',fetchUser,async (req, res) => {
    const {title,description,tag}=req.body;
    try{
    //Create new note
    const newNote={};
    if(title){newNote.title=title};
    if(description){newNote.description=description};
    if(tag){newNote.tag=tag};

    //find the note to be updated
    let note= await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")};
    if(note.user.toString()!==req.user.id){
        return res.status(401).send("Not Allowed")};
    
    note=await Note.findByIdAndUpdate(req.params.id,{$set:newNote},{new:true})
    res.json({note});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
    });
    
//ROUTE 4: Delete an existing Note using DELETE "api/notes/deletenote". login required
router.delete('/deletenote/:id',fetchUser,async (req, res) => {
    try{
    //find the note to be deleted
    let note= await Note.findById(req.params.id);
    if(!note){return res.status(404).send("Not Found")};

    if(note.user.toString()!==req.user.id){
        return res.status(401).send("Not Allowed")};
    
    note=await Note.findByIdAndDelete(req.params.id)
    res.json({"Success":"Note has been Deleted",note: note});

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

    });

module.exports = router;
