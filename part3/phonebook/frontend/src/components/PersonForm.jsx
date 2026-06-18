const PersonForm = ({
  onSubmit,
  onNameChange,
  newName,
  onPhoneNumberChange,
  newPhoneNumber
}) => {
  return (
    <form onSubmit={onSubmit}>
      <div>
        name: <input onChange={onNameChange} value={newName} />
      </div>
      <div>
        number: <input onChange={onPhoneNumberChange} value={newPhoneNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

export default PersonForm