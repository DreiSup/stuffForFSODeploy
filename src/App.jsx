import { useState, useEffect } from 'react'
import noteService from './services/notes'
import Note from './components/Note' 
import Notification from './components/Notification'
import Footer from './components/Footer'


const App = () => {

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened')



  useEffect (() => {
    noteService
    .getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
      console.log(initialNotes)
    })
  }, [])

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important === true)

    const toggleImportanceOf = (id) => {
      const note = notes.find(n => n.id === id)
      const changedNote = {...note, important: !note.important}
  
      noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id === id ? returnedNote : note))
      })
      .catch(err => {
        console.log(err)
       setErrorMessage(
        `Note '${note.content}' was already removed from server`
       )
       setTimeout(() => {
        setErrorMessage(null)
       }, 5000)
       setNotes(notes.filter(n => n.id !== id))
      })
    }

  const addNote = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target, newNote)
    
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
      id: String(notes.length + 1)
    }

    noteService 
    .create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
      console.log(returnedNote)
    })
  }

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }



  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}/>
        )}
      </ul>
      <form onSubmit={addNote}>
        <input 
          value={newNote}
          onChange={handleNoteChange}/>
        <button type='submit'>
          save
        </button>
      </form>
      <Footer/>
    </div>
  )
}

export default App