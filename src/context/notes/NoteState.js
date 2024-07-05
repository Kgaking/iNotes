import React, { useState } from 'react';
import NoteContext from './NoteContext';

const NoteState=(props)=>{
    const host="http://localhost:5000"
    const notesInitial=[]
    const [notes,setNotes]=useState(notesInitial);


      //Get all Notes
      const getNotes=async()=>{
        //API Call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: 'GET', 
            headers: {
              "Content-Type": "application/json",
              "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY1OWM0MWZlZGY2MGVkNzBiNWQyOWVmIn0sImlhdCI6MTcxNzE2MDE0Mn0.Vi7L5BKq3w3k4SR4TzB6ARfgfZVThHZLjG2PxzN_Dgg"
            }
          });
          const json=await response.json()
          console.log(json);
          setNotes(json)
      }

      //ADD Note
      const addNote=async(title,description,tag)=>{
        //API Call
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: 'POST', 
            headers: {
              "Content-Type": "application/json",
              "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY1OWM0MWZlZGY2MGVkNzBiNWQyOWVmIn0sImlhdCI6MTcxNzE2MDE0Mn0.Vi7L5BKq3w3k4SR4TzB6ARfgfZVThHZLjG2PxzN_Dgg"
            },
            body: JSON.stringify({title,description,tag}), 
          });
          const note=await response.json();
        setNotes(notes.concat(note))
      }
      //Delete Note
      const deleteNote=async(id)=>{
        //API Call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: 'DELETE', 
            headers: {
              "Content-Type": "application/json",
              "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY1OWM0MWZlZGY2MGVkNzBiNWQyOWVmIn0sImlhdCI6MTcxNzE2MDE0Mn0.Vi7L5BKq3w3k4SR4TzB6ARfgfZVThHZLjG2PxzN_Dgg"
            },
          });
          const json= response.json();
          console.log(json);

        console.log("Deleting the note with id" + id)
        const newNotes=notes.filter((note)=>{return note._id!==id})
        setNotes(newNotes)
      }
      //Edit Note
      const editNote=async(id,title,description,tag)=>{
        //API Calls
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: 'PUT', 
            headers: {
              "Content-Type": "application/json",
              "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjY1OWM0MWZlZGY2MGVkNzBiNWQyOWVmIn0sImlhdCI6MTcxNzE2MDE0Mn0.Vi7L5BKq3w3k4SR4TzB6ARfgfZVThHZLjG2PxzN_Dgg"
            },
            body: JSON.stringify({title,description,tag}), 
          });
          const json=await response.json();
          console.log(json);
      
        //Edit in Client
        let NewNotes=JSON.parse(JSON.stringify(notes));

        for(let index=0; index<NewNotes.length;index++){
            const element=NewNotes[index];
            if(element._id===id){
                NewNotes[index].title=title;
                NewNotes[index].description=description;
                NewNotes[index].tag=tag;
                break;
        }
      }
      setNotes(NewNotes)
    }
    return(
        <NoteContext.Provider value={{notes,addNote,deleteNote,editNote,getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}
export default NoteState;