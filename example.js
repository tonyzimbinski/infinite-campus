var finite = require('./index.js')
var argv = process.argv.slice(2)

/*
  usage: node.js example.js "username" "password" "district" "state"
*/

finite.fetch(argv[0], argv[1], argv[2], argv[3]).then(grades => {
  // loop over every class we have
  for (var i = 0; i < grades.length; i++) {
    var teacher = grades[i].classDetails.teacher // eg. J Smith
    var className = grades[i].classDetails.name // eg. #1 AP Human Geography

    var totalPoints = grades[i].student.totalPoints // eg. 200
    var points = grades[i].student.points // eg. 198
    var grade = grades[i].student.grade // eg. A

    // if we have a grade in the class
    if (grade) {
      console.log(`you have an ${grade} (${points}/${totalPoints}) in ${className} with ${teacher}`)
    }
  }

  /*
        Output:

        you have an A (198/200) in #1 AP Human Geography with J Smith
        you have an A (50/50) in Mathematics with M Def
        ...
    */
}).catch(err => { // catches errors
  console.log('[ERROR]', err)
})
