const errorMessage = {
  invalidUser: "Invalid username or password",
  userRegistered: "A user with the given username is already registered",
  missingProperty: (property) => `Property "${property}" is required`,
  invalidNoteType: 'Note\'s type must be one of: "twitters", "articles", "notes"',
  noteDoesntExist: 'Note with given id doesn\'t exist',
}

module.exports = errorMessage;