import React, { useContext } from 'react';
import NoteContext from '../context/notes/NoteContext';


const NoteItem = (props) => {
    const context=useContext(NoteContext);
    const {deleteNote}=context
    const {note,updateNote}=props;
  return (
    <div className='col-md-3'>
      <div className="card my-3">
        <div className="card-body">
            <div className="container d-flex align-items-center" style={{height:"60px"}}>
            <h5 className="card-title">{note.title}</h5>
            <i className="fa-solid fa-trash mx-2" onClick={()=>{deleteNote(note._id);
              props.showalert("Deleted Successfully","success");}}></i>
            <i className="fa-regular fa-pen-to-square mx-2" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>{updateNote(note)}}></i>
            </div>
            <p className="card-text">{note.description}</p>
        </div>
        </div>
    </div>
  )
}

export default NoteItem
