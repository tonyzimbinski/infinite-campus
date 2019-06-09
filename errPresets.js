'use strict'

let ErrorHandler = require('reqjs-err-handler')
let presets = {}

presets.district = new ErrorHandler({
  prefix: 'GET_DISTRICT',
  fail: {
    body: [
      { text: 'No results found', rejectComment: 'District not found.' }
    ],
    status: [{ status: 404, rejectComment: 'District not found.' }]
  },
  success: {
    status: [200],
    rejectComment: 'Unknown error while searching for district (got HTTP %status%, expected HTTP 200)'
  }
})

presets.login = new ErrorHandler({
  prefix: 'LOGIN',
  fail: {
    body: [
      { text: 'password-error', rejectComment: 'Username/Password is incorrect.' },
      { text: 'Incorrect Username and/or Password', rejectComment: 'Username/Password is incorrect.' },
      { text: 'No Campus Application selected', rejectComment: 'District/School name failed.' }
    ],
    status: [{ status: 400, rejectComment: 'bad request' }]
  },
  success: {
    body: ['success'],
    status: [200],
    rejectComment: 'Unknown error while logging in'
  }
})

presets.notificationToggle = new ErrorHandler({
  prefix: 'TOGGLE_NOTIFICATION',
  fail: {
    body: [
      { text: 'Cannot mark other user\'s notification as read or unread', rejectComment: 'Notification ID not found during read toggle.' },
      { text: 'invalid input', rejectComment: 'Invalid input.' },
      { text: 'No Campus Application selected', rejectComment: 'District/School name failed.' }
    ]
  },
  success: {
    status: [200],
    rejectComment: 'Unknown error (got HTTP %status%, expected HTTP 200).'
  }
})

presets.generic200 = new ErrorHandler({
  prefix: 'GEN_200',
  success: {
    status: [200],
    rejectComment: 'Unknown error (got HTTP %status%, expected HTTP 200).'
  }
})

module.exports = presets
