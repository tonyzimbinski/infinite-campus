## Infinite Campus API 

[![npm version](https://badge.fury.io/js/infinite-campus.svg#)](https://badge.fury.io/js/infinite-campus)
##### install with `npm i infinite-campus`

[(full docs here)](https://qwazwsx.xyz/infinite-campus/User.html)

### Super easy to use!

```JavaScript
const InfiniteCampus = require('infinite-campus')
// log in                          District Name    State  Username  Password
const user = new InfiniteCampus('New York District', 'NY', 'JDoe12', 'XXXXXX')

// wait until we are done logging in
user.on('ready', () => {
  // now that we are logged in...
  
  // get grades from all courses, returns an array of terms containing class information (see docs)
  user.getCourses().then((terms) => {
    console.log(terms)
    // [{name:"Q1", courses: [{name: "1 English", grades:{}, ...}, ...]}, ... ]
  })
  
  // get the last 20 notifications
  user.getNotifications(20).then((notifications) => {
    console.log(notifications)
    // [{id: "1111", test: "BOB recieved a new grade of A", timestamp: 1234, read: false, ... }, ...]
    
	// then mark all notifications as read
	user.markAllNotificationsRead().then(() => {
	    console.log('notifications marked as read...')
    })

  })

	
})


// listen for any errors thrown while logging in
user.on('error', (err) => {
	console.log('Error while Logging in. Bad credentials.' + err)
})

```

## [READ THE FULL DOCUMENTATION HERE](https://qwazwsx.xyz/infinite-campus/User.html)

# LOOKING FOR MAINTAINERS

## Disclaimer

This is an unofficial library and is not endorsed  or officially recognized by Infinite Campus. The Infinite Campus name is owned by Infinite Campus, Inc and again, has nothing to do with this library. This library uses bits and pieces of both the web and mobile API that drives the Infinite Campus Client. If you are from Infinite Campus and have concerns, please submit an [issue](https://github.com/qwazwsx/infinite-campus/issues/new). Please don't sue me.  
