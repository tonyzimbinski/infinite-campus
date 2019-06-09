## Infinite Campus API
[![npm version](https://badge.fury.io/js/infinite-campus.svg)](https://badge.fury.io/js/infinite-campus)
##### install with `npm i infinite-campus`

### Super easy to use!

```JavaScript
const InfiniteCampus = require('infinite-campus')
// log in                          District Name    State  Username  Password
const user = new InfiniteCampus('New York District', 'NY', 'JDoe12', 'XXXXXX')

// wait until we are done logging in
user.on('ready', () => {
  // now that we are logged in...
  
  // get grades from all courses
  user.getCourses().then((courses) => {
    console.log(courses)
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
```


## [READ THE FULL DOCUMENTATION HERE]()
