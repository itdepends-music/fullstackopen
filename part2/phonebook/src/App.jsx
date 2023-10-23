import { useState, useEffect } from 'react'
import personService from './services/persons'

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

const PersonsDisplay = ({ personsFiltered, deletePerson }) => {
  return (
    <div>
      {personsFiltered.map((person) => (
        <PersonDisplay
          person={person}
          handleDeleteButton={() => deletePerson(person)}
          key={person.id}
        />
      ))}
    </div>
  )
}

const PersonDisplay = ({ person, handleDeleteButton }) => {
  return (
    <div>
      {person.name} {person.number}
      <button onClick={handleDeleteButton}>delete</button>
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return
  }

  const style = {
    color: message.color,
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  return <div style={style}>{message.text}</div>
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterWith, setFilterWith] = useState('')
  const [notifMessage, setNotifMessage] = useState(null)

  useEffect(() => {
    personService.getAll().then((initialPersons) => {
      setPersons(initialPersons)
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
    setNewName('')
    setNewNumber('')

    const foundPerson = persons.find((person) => person.name === newName)

    const personObject = {
      name: newName,
      number: newNumber,
    }

    if (foundPerson === undefined) {
      personService.create(personObject).then((returnedPerson) => {
        setPersons(persons.concat(returnedPerson))
        setNotifMessage({
          text: `Added ${returnedPerson.name}`,
          color: 'green',
        })
        setTimeout(() => setNotifMessage(null), 5000)
      })
    } else if (
      window.confirm(
        `${newName} is already added to phonebook, replace the old number with a new one?`,
      )
    ) {
      personService
        .update(foundPerson.id, personObject)
        .then((returnedPerson) => {
          setPersons(
            persons.map((person) =>
              person.id !== foundPerson.id ? person : returnedPerson,
            ),
          )
          setNotifMessage({text: `Changed number of ${returnedPerson.name}`, color: 'green'})
          setTimeout(() => setNotifMessage(null), 5000)
        })
    }
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService.deletePerson(person.id).then(() => {
        setPersons(persons.filter((p) => p.id !== person.id))
      })
    }
  }

  const personsFiltered = persons.filter((person) =>
    person.name.toLowerCase().includes(filterWith.toLowerCase()),
  )

  return (
    <div>
      <h1>Phonebook</h1>

      <Notification message={notifMessage} />

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
      <PersonsDisplay
        personsFiltered={personsFiltered}
        deletePerson={deletePerson}
      />
    </div>
  )
}

export default App
