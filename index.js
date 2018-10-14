// ////
//
// ////Infinite Campus API////
// for the most up to date documentation, please see README.md
// this file conforms to standard.js (https://standardjs.com)
// licensed under GPL-3.0
//
// ////

'use strict'
var request = require('request') // makes HTTP requests
var convert = require('xml-js') // converts XML to JSON
var exports = module.exports = {}
exports.repo = 'https://github.com/qwazwsx/infinite-campus-API'
var cookies = '' // cookies from our session

/*
  get and set the cookies
  if you pass it a value, it will set the cookies to that value
  if you dont pass any values it will return the current cookies
  Parameters:
    (str) set = string containing the cookies in standard format ie. NAME=VALUE; NAME=VALUE; ...
  Returns:
    (str) cookies in the standard format **only returns if you dont set any parameters

*/
exports.cookies = function (set) {
  if (set !== undefined) {
    cookies = set
  }
  return cookies
}

/*
  gets the district URL and ID
  Parameters:
    (str) districtName = your district name
    (str) state = all caps state code
   Returns:
    district info (see full example output in ./doc/getDistrict)
*/
exports.getDistrict = function (districtName, state) {
  return new Promise(function (resolve, reject) {
    request('https://mobile.infinitecampus.com/mobile/searchDistrict?query=' + districtName + '&state=' + state, function (error, response, body) {
      if (response.statusCode !== 200 || error) { reject(new Error(JSON.stringify({error: error, body: body}))) }

      if (JSON.parse(body).error !== undefined || response.statusCode !== 200) {
        reject(new Error(JSON.stringify({error: 'District not found.', code: 5})))
      } else {
        resolve(JSON.parse(body).data[0])
      }
    })
  })
}

/*
  logs a user in
  Parameters:
    (obj) district = district info from getDistrict
    (str) username = your account username
    (str) password = your account password
  Rejections:
    bad username = {error: 'Username is incorrect', code: 0}
    bad password = {error: 'Password is incorrect', code: 1}
    bad district = {error: 'District is incorrect', code: 2}
*/
exports.login = function (district, username, password) {
  return new Promise(function (resolve, reject) {
    request(district.district_baseurl + 'verify.jsp?nonBrowser=true&username=' + username + '&password=' + password + '&appName=' + district.district_app_name + '&x=' + random() + '&y=' + random, function (error, response, body) {
      if (response.statusCode !== 200 || error) { reject(new Error(JSON.stringify({error: error, body: body}))) }

      // over-engineered error handler
      var errors = [
        {text: 'password-error', rejectComment: 'Username is incorrect.'},
        {text: 'Incorrect Username and/or Password', rejectComment: 'Password is incorrect.'},
        {text: 'No Campus Application selected', rejectComment: 'District/School name failed.'}
      ]
      for (var i = 0; i < errors.length; i++) {
        if (body.indexOf(errors[i].text) > -1) {
          reject(new Error(JSON.stringify({error: 'Error while logging in: ' + errors[i].rejectComment, code: i})))
        }
      }

      // if we successfully log in
      if (body.indexOf('success') > -1) {
        // set cookies to save session
        /* cookie dough */
        var cookieRAW = response.headers['set-cookie']
        // strip out unneeded details (expire & path parameters)
        for (var ii = 0; ii < cookieRAW.length; ii++) {
          cookies += cookieRAW[ii].split(';')[0] + ';'
        }

        resolve()
      } else if (body.indexOf('captcha') > -1) {
        reject(new Error(JSON.stringify({error: 'Login page is asking for captcha. Take a break from making requests for a while', code: 3})))
      } else {
        console.log('\n\n\n\n', body)
        reject(new Error(JSON.stringify({error: 'Unexpected response, dumping response body for debugging. If you keep getting this error please submit an issue on GitHub.', code: 4})))
      }
    })
  })
}

/*
  gets user and calendar ID's needed to fetch grades
  Parameters:
    (obj) district = district info returned by getDistrict
  Returns: (obj)
    various ID's required for fetching classes and grades (see full example output in ./doc/getUser)
*/
exports.getUser = function (district) {
  return new Promise(function (resolve, reject) {
    request({headers: getHeader(), url: district.district_baseurl + 'prism?x=portal.PortalOutline&appName=' + district.district_app_name}, function (error, response, body) {
      if (response.statusCode !== 200 || error) { reject(new Error(JSON.stringify({error: error, body: body}))) }

      var xml = convert.xml2js(body, {compact: true})
      var base = xml.campusRoot.PortalOutline.Family.Student
      var calBase = base.Calendar.ScheduleStructure._attributes

      resolve({
        personID: base._attributes.personID,
        structureID: calBase.structureID,
        calendarID: calBase.calendarID
      })
    })
  })
}

/*
  get a users classes
  Parameters:
    (obj) district = district info returned by getDistrict
    (obj) user = user ID's returned from getUser()
  Returns: (array)
    list of class ID's
*/
exports.getClasses = function (district, user) {
  return new Promise(function (resolve, reject) {
    request({headers: getHeader(), url: district.district_baseurl + 'prism?x=portal.PortalSchedule&mode=schedule&personID=' + user.personID + '&structureID=' + user.structureID + '&calendarID=' + user.calendarID}, function (error, response, body) {
      if (response.statusCode !== 200 || error) { reject(new Error(JSON.stringify({error: error, body: body}))) }

      var xml = convert.xml2js(body, {compact: true})

      var classes = []

      var periods = xml.campusRoot.StudentSchedule.StudentList.Student.Period

      // loop over periods
      for (var i = 0; i < periods.length; i++) {
        var terms = periods[i].Term
        // loop over each term for that period
        for (var ii = 0; ii < terms.length; ii++) {
          // make sure that the period has a class
          if (terms[ii].Section !== undefined) {
            classes.push(terms[ii].Section._attributes.sectionID)
          }
        }
      }

      resolve(classes)
    })
  })
}

/*
  gets grade and class data
  Parameters:
    (obj) district = district info returned by getDistrict
    (obj) user = user ID's returned from getUser()
    (array) classes = array of class ID's returned from getClasses()
  Returns: (string)
    XML containing a TON of stuff
*/
exports.getXML = function (district, user, classes) {
  return new Promise(function (resolve, reject) {
    var url = district.district_baseurl + 'prism?&'

    // add classes to url
    for (var i = 0; i < classes.length; i++) {
      url += 'sectionID=' + classes[i] + '&'
    }

    url += 'trialID=570&x=portal.PortalClassbook-getClassbookForSections&mode=classbook&personID=' + user.personID + '&structureID=' + user.structureID + '&calendarID=' + user.calendarID

    request({headers: getHeader(), url: url}, function (error, response, body) {
      if (response.statusCode !== 200 || error) { reject(new Error(JSON.stringify({error: error, body: body}))) }

      resolve(body)
    })
  })
}

/*
  parse's XML from getXML() into a readable form
  Parameters:
    (str) source = XML from getXML()
  Returns: (obj)
    grade and period/term data
    view examples in ./docs/parseXML
*/
exports.parseXML = function (source) {
  var reconstructed = []

  var xml = convert.xml2js(source, {compact: true})

  var classes = xml.campusRoot.SectionClassbooks.PortalClassbook

  // loop through each class
  for (var i = 0; i < classes.length; i++) {
    // some helper vars so things look clean(er)
    var classbook = classes[i].ClassbookDetail.StudentList.Student.Classbook
    var student = classbook.tasks.ClassbookTask._attributes
    var classDetails = classbook._attributes
    var period = classes[i].Section.sectionPlacements.SectionPlacement.Period._attributes
    var term = classes[i].Section.sectionPlacements.SectionPlacement.Term._attributes

    reconstructed.push({
      // class name and teacher
      classDetails: {
        teacher: classDetails.teacherDisplay,
        name: classDetails.courseName
      },
      // when the class is scheduled
      position: {
        period: period.seq, // period in chronological order, this means that 1st hour is "2" because of zero hour
        periodName: period.name, // actual name of the period
        startTime: period.startTime,
        endTime: period.endTime,

        term: term.seq,
        termName: term.name,
        startDate: term.startDate,
        endDate: term.endDate

      },
      // grades
      student: {
        totalPoints: student.totalPointsPossible,
        points: student.pointsEarned,
        percentage: student.percentage,
        grade: student.letterGrade
      }})
  }

  return reconstructed
}

/*
  main function that logs in and returns grades
  Parameters:
    (str) username = your account username
    (str) password = your account password
    (str) school = the name of your school
    (str) state = the 2 letter code for your state, all caps (eg: NY, MN, NC)
*/

exports.fetch = function (username, password, district, state) {
  return new Promise(function (resolve, reject) {
    /*
      1. get district info
      2. login
      3. get user ID
      4. get class list
      5. grab grades
    */

    exports.getDistrict(district, state).then(d => {
      return exports.login(d, username, password).then(() => {
        return exports.getUser(d).then(u => {
          var user = u
          return exports.getClasses(d, user).then(classes => {
            return exports.getXML(d, user, classes).then(XML => {
              resolve(exports.parseXML(XML))
            })
          })
        })
      })
    }).catch(err => {
      reject(err)
    })
  })
}

//
// helper functions

// keep our session together
function getHeader () {
  return {
    'Cookie': cookies,
    'User-Agent': 'AndroidCampusPortal 2.6.0 / Android OS 9 : P : sdk=28'
  }
}

// generates a random number to put into login requests
function random () {
  return Math.floor(Math.random() * 10) + 1
}
