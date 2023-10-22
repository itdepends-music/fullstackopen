import { useState, useEffect } from 'react'
import axios from 'axios'

const SearchFilterInput = ({ filterWith, handleFilterWithChange }) => {
  return (
    <div>
      filter shown with{' '}
      <input value={filterWith} onChange={handleFilterWithChange} />
    </div>
  )
}

const AddNewPersonForm = ({
  addPerson,
  newName,
  handleNameChange,
  newNumber,
  handleNumberChange,
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const PersonsDisplay = ({ personsFiltered }) => {
  return (
    <div>
      {personsFiltered.map((person) => (
        <PersonDisplay person={person} key={person.id} />
      ))}
    </div>
  )
}

const PersonDisplay = ({ person }) => {
  return (
    <div>
      {person.name} {person.number}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterWith, setFilterWith] = useState('')
  const [nextId, setNextId] = useState(persons.length + 1)

  useEffect(() => {
    axios.get('http://localhost:3001/persons').then(response => {
      setPersons(response.data)
    })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterWithChange = (event) => {
    setFilterWith(event.target.value)
  }

  const addPerson = (event) => {
    event.preventDefault()

    if (persons.some((person) => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }

    setPersons(persons.concat({ name: newName, number: newNumber, id: nextId }))
    setNextId(nextId + 1)
    setNewName('')
    setNewNumber('')
  }

  const personsFiltered = persons.filter((person) =>
    person.name.toLowerCase().includes(filterWith.toLowerCase()),
  )

  return (
    <div>
      <h1>Phonebook</h1>
      <SearchFilterInput
        filterWith={filterWith}
        handleFilterWithChange={handleFilterWithChange}
      />

      <h2>add a new</h2>
      <AddNewPersonForm
        addPerson={addPerson}
        newName={newName}
        handleNameChange={handleNameChange}
        newNumber={newNumber}
        handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <PersonsDisplay personsFiltered={personsFiltered} />
    </div>
  )
}

export default App
