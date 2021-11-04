// import modified version of IC with debug output
const InfiniteCampus = require('./index.js')

const DISTRICT = "New York"; 
const STATE = "NY"; 
const USER = "JDoe12"; 
const PASS = "XXXXX"; 

// print anonymized credentials
console.log(DISTRICT.substring(0,3).padEnd(DISTRICT.length-3, '*'), ''.padEnd(2, '*'), ''.padEnd(USER.length, '*'), ''.padEnd(PASS.length, '*'))
const user = new InfiniteCampus(DISTRICT, STATE, USER, PASS)

// wait for log in
user.on('ready', () => {
  // get courses, this will print debug info
  user.getCourses().then((terms) => {
    // print terms
    console.log('[GET COURSES]', JSON.stringify(terms))
  })

})


// listen for any errors thrown while logging in
user.on('error', (err) => {
  console.log('Error while Logging in. Bad credentials.' + err)
})
