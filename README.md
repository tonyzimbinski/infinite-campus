
## Infinite Campus API

Easily get class and grade information from Infinite Campus. 

* simple to use
* compartmentalized for easy addition of new features

### Super easy to use

``` JavaScript
var finite = require('finite-campus')

finite.fetch('myUsername', 'myPassword', 'New York School Districts', 'NY').then(grades => {

    // loop over every class we have
    for (var i = 0; i < grades.length; i++){
        var teacher = grades[i].classDetails.teacher // eg. J Smith
        var className = grades[i].classDetails.name // eg. #1 AP Human Geography
        
        var totalPoints = grades[i].student.totalPoints // eg. 200
        var points = grades[i].student.points // eg. 198
        var grade = grades[i].student.grade // eg. A

        console.log(`you have an ${grade} (${points}/${totalPoints}) in ${className} with ${teacher}`)
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
``` 
---

#### Table of Contents

- [Basic Usage:](#basic-usage)
    + [finite.fetch()](#finitefetchusername-password-district-state)
- [Advanced Usage](#advanced-usage)
    + [finite.cookies()](#finitecookiescookies)
    + [finite.getDistrict()](#finitegetdistrictdistrictname-state)
    + [finite.login()](#finitelogindistrict-username-password)
    + [finite.getUser()](#finitegetuserdistrict)
    + [finite.getClasses()](#finitegetclassesdistrict-user)
    + [finite.getXML()](#finitegetxmldistrict-user-classes)
    + [finite.parseXML()](#finiteparsexmlxml)

---
# Basic Usage:

### finite.fetch(username, password, district, state)

Get your grades and course information.

This method is a combination of the 6 'advanced usage' methods that are detailed in the ['advanced usage'](#advanced-usage) section of this document. **If all you want to do is get grades and class info, this is the method to use**. For the sake of understanding, the 'advanced' methods are briefly explained below. See the ['advanced usage'](#advanced-usage) section for a more in-depth look on how to leverage these individual methods.

1. [`.getDistrict()`](#finitegetdistrictdistrictname-state) - gets the district ID and login URL based on your district name and state
2. [`.login()`](#finitelogindistrict-username-password) - logs in 
3. [`.getUser()`](#finitegetuserdistrict) - gets various user ID's so we can fetch our class list
4. [`.getClasses()`](#finitegetclassesdistrict-user) - uses the above ID's to get a class list
5. [`.getXML()`](#finitegetxmldistrict-user-classes) - takes a class list and returns a messy XML file of class information (and a *TON* of other stuff)
6. [`.parseXML()`](#finiteparsexmlxml) - parses the above XML into a more friendly format

#### Example usage:

This method returns a promise, so `.then` and `.catch` must be used

``` JavaScript
finite.fetch(username, password, district, state).then(grades => {

    console.log('You are enrolled in ' + grades.length + ' classes this year')
    // You are enrolled in 24 classes this year
    
    console.log('You have an ' + grades[0].student.grade + ' in ' + grades[0].classDetails.name)
    // You have an A in AP Human Geography
}).catch(err => { // handle errors
    console.log('[ERROR]', err)
})
```

#### Parameters:

|Parameter Name|Type|Description| 
|--|--|--|
| username | string | your username you use to login |
| password | string | your password you use to login |
| district | string | the name of your school district, you may have to try various configurations and wordings to get it right|
| state | string | your state code, eg: NY, MN, NC |

#### Returns:

``` JSONC
[
     {
         "classDetails": {
         "teacher": "J Smith",
         "name": "1 AP Human Geography"
     },
         "position": {
         "period": "2", // period in chronological order, in this case there is zero hour, so 1st hour is actually the 2nd hour of the day
 "periodName": "1", // the name of the period, this is usually won't include zero hour
 "startTime": "08:05 AM", // 12 hour time HH:MM AM/PM
 "endTime": "09:09 AM",
 "term": "1",
 "termName": "Q1",
 "startDate": "09/04/2018", // MM/DD/YYYY format
 "endDate": "11/08/2018"
 },
 "student": {
 "totalPoints": "200.0",
 "points": "190.0",
 "percentage": "95",
 "grade": "A"
 }
 },
 {...},
 {...},
 ...
]
```

The above JSON defines the following class:

* "1 AP Human Geography" taught by J Smith
* This is a 1st hour class* that starts at 8:05AM and ends at 9:09AM
* This class takes place during the 1st term of the year, this term is labeled "Q1" (quarter 1) and goes from 9/04/18 to 11/08/18
* The student has 190 points out of a possible 200 points** which is 95% or an A (based on the school/classes grading system)


\* this class chronologically takes place during the 2nd hour of the school day because of zero hour. Use the period name for displaying text, use "period" for ordering classes. See comment above for more info.

\** these point values account for weighted assignment sections (ie formative & summative grading sections)


notes: 

* All of these values are completely untouched. This means that all values are strings, just how they appear in the infinite campus internal API. I don't want to blanket typecast some of these values because I don't know if this could cause issues. With only one student account to test on at one district, I have a very limited ability to test changes like this. 
* If a class is ungraded (ie. the class hasn't started yet) `.student.grade` will be `undefined`

#### Rejections/Errors:

Rejections are formatted in the following way:

`{error: <rejection text>, code: <#>}`

 

| Rejection text | Code | Info
|--|--|--|
| Error while logging in: Username is incorrect. | 0 |
| Error while logging in: Password is incorrect. | 1 |
| Error while logging in: District/School name failed. | 2 | Your district name was found during request #1, but for some reason failed while trying to login |
| Login page is asking for captcha. Take a break from making requests for a while | 3 | If you make too many login attempts too fast you will be required to fill out a captcha on the webpage. There is no workaround, if you get this error just wait a few minutes. |
| Unexpected response, dumping response body for debugging. If you keep getting this error please submit an issue on GitHub. | 4 | This error gets thrown when the login handler can't make sense of the servers response. You really shouldn't ever get this error. |
| District not found. | 5 | Make sure that the *"state"* parameter is set to your states 2 letter code (eg: NY, MN, NC). If you are still having issues, try using different variations of your district name. For example, if your district is called *"\<City A> - \<City B> area schools"* try just putting *"\<City A>"* or *"\<City B>*". |

note: to prevent error text from displaying as `[object Object] ` in console the error object is converted to a string. To parse the error use `JSON.parse(err)`.

# Advanced Usage

The following methods are all implemented in [`finite.fetch()`](#finitefetchusername-password-district-state). These methods are left exposed so people looking for more control can use them. If you are looking to implement other infinite campus functions (ie. assignments, notifications etc) you can use the [`finite.login`](#finitelogindistrict-username-password) function to make authenticating easy for your modifications.

### finite.cookies(cookies)

This method lets you get and set cookies. If you pass it a value it will override the current cookies. 

#### Example usage:

```JavaScript
    // example login to set authenticated cookies
    finite.login(.....).then(()=>{
        // get cookies
        console.log(finite.cookies()) // JSSESSIONID=XXX; appName=XXX; XSRF-TOKEN=XXX ... ...

        // set cookies (this overrides everything)
        finite.cookies('myCookie=example;')

        // get new cookies
        console.log(finite.cookies()) // myCookie=example;
    }) 
```
#### Parameters:

|Parameter Name|Type|Description| Example |
|--|--|--|--|
| cookies | string (optional) | list of cookies to replace the current ones |`NAME=VALUE; NAME2=VALUE| cookies | string (optional) | list of cookies to replace the current ones |`NAME=VALUE; NAME2=VALUE; ...` |; ...` |

#### Returns:

This method returns the current cookies. If you just set the cookies it will return the newly set cookies and **not** the old cookies. 

`JSSESSIONID=XXX; appName=XXX; XSRF-TOKEN=XXX; ...`


---

### finite.getDistrict(districtName, state)

This method returns various ID's and access URL's from selected school district. Many other functions (.login, .getUser, .getClasses, .getGrades) rely on the district information returned from this function.


#### Example usage:

This method returns a promise, so `.then` and `.catch` must be used

```Javascript
finite.getDistrict('X - Y area schools', 'NY').then(district => {
    // ...
}).catch(err => { // catch errors
    console.log('[ERROR]', err)
})
```

#### Parameters:

|Parameter Name|Type|Description| Example |
|--|--|--|--|
| districtName| string | the name of your school district. you may have to try various configurations and wordings to get it right | Cityname Area Schools
| state | string | your state code in all caps | NY, MN, NC |


#### Returns: 

``` JSONC
{
 "id": 00000,
 "district_name": "CITY NAME AREA SCHOOLS",
 "district_app_name": "cityname",
 "district_baseurl": "https://city-name.infinitecampus.org/campus/",
 "district_code": "xxxxxx",
 "state_code": "XX",
 "staff_login_url": "https://city-name.infinitecampus.org/campus/cityname.jsp",
 "parent_login_url": "https://city-name.infinitecampus.org/campus/portal/cityname.jsp",
 "student_login_url": "https://city-name.infinitecampus.org/campus/portal/cityname.jsp",
 "earliest": true
}
```

#### Rejections/Errors:

| Rejection text | Code | Info
|--|--|--|
| District not found. | 5 | Make sure that the *"state"* parameter is set to your states 2 letter code (eg: NY, MN, NC). If you are still having issues, try using different variations of your district name. For example, if your district is called *"\<City A> - \<City B> area schools"* try just putting *"\<City A>"* or *"\<City B>*". |

---

### finite.login(district, username, password)

This method logs the user in and sets cookies to authenticate subsequent requests with.


#### Example usage:

This method returns a promise, so `.then` and `.catch` must be used

```Javascript
finite.login(district, 'myUsername', 'myPassword').then(() => {
    //...
}).catch(err => { // catch errors
    console.log('[ERROR]', err)
})
```

#### Parameters:

|Parameter Name|Type|Description| 
|--|--|--|
| district | object | the object that gets returned by [`finite.getDistrict()`](#finitegetdistrictdistrictname-state) |
| username | string | your username you use to login |
| password | string | your password you use to login |

#### Rejections/Errors:

| Rejection text | Code | Info
|--|--|--|
| Error while logging in: Username is incorrect. | 0 |
| Error while logging in: Password is incorrect. | 1 |
| Error while logging in: District/School name failed. | 2 | Your district name was found during request #1, but for some reason failed while trying to login |
| Login page is asking for captcha. Take a break from making requests for a while | 3 | If you make too many login attempts too fast you will be required to fill out a captcha on the webpage. There is no workaround, if you get this error just wait a few minutes. Or, if this is a |
| Unexpected response, dumping response body for debugging. If you keep getting this error please submit an issue on GitHub. | 4 | This error gets thrown when the login handler can't make sense of the servers response. You really shouldn't ever get this error. |

---

### finite.getUser(district)

This method gets various user ID's that are required to fetch grades

#### Example usage:

This method returns a promise, so `.then` and `.catch` must be used

```Javascript
finite.getUser(district).then(user => {
    //...
}).catch(err => { // catch errors
    console.log('[ERROR]', err)
})
```

#### Parameters:

|Parameter Name|Type|Description| 
|--|--|--|
| district | object | the object that gets returned by [`finite.getDistrict()`](#finitegetdistrictdistrictname-state) |

#### Returns: 

```
{ 
 personID: '00000',
 structureID: '000',
 calendarID: '000' 
}
```

---

### finite.getClasses(district, user)

This method gets a list of class ID's that the user is enrolled in

#### Example usage:

This method returns a promise, so `.then` and `.catch` must be used

```Javascript
finite.getClasses(district, user).then(classes => {
    //...
}).catch(err => { // catch errors
    console.log('[ERROR]', err)
})
```

#### Parameters:

|Parameter Name|Type|Description| 
|--|--|--|
| district | object | the object that gets returned by [`finite.getDistrict()`](#finitegetdistrictdistrictname-state) |
| user | object | the object that gets returned by [`finite.getUser()`](#finitegetuserdistrict) |

#### Returns: 

returns an array of class ID's

```
[ '000000',
 '000000',
 '000000',
 '000000',
 '000000',
 ...]
```

---

### finite.getXML(district, user, classes)

This method fetches an XML file containing class information . This XML file isn't layed out very thoughtfully and is pretty hard to understand. This is why [`finite.getXML`](#finitegetxmldistrict-user-classes) exists. 

#### Example usage:

This method returns a promise, so `.then` and `.catch` must be used

```Javascript
finite.getXML(district, user, classes).then(XML => {
    //...
}).catch(err => { // catch errors
    console.log('[ERROR]', err)
})
```

#### Parameters:

|Parameter Name|Type|Description| 
|--|--|--|
| district | object | the object that gets returned by [`finite.getDistrict()`](#finitegetdistrictdistrictname-state) |
| user | object | the object that gets returned by [`finite.getUser()`](#finitegetuserdistrict) |
| classes | object | the object that gets returned by [`finite.getClasses()`](#finitegetclassesdistrict-user) |

#### Returns: 

Returns a super long XML file that is 1.) too big and complicated to show here and 2.) contains too much personal information to properly obscure. I really only understand a very small fraction of this XML file and its layout. I suggest you go out and look through the file if you need to find any specific information


---

### finite.parseXML(XML)

This method takes in the XML file fetched by [`finite.getXML`](#finitegetxmldistrict-user-classes) and parses it into a readable form. 


#### Example usage:

This method returns a promise, so `.then` and `.catch` must be used

```Javascript
finite.getXML(XML).then(grades => {
    //...
}).catch(err => { // catch errors
    console.log('[ERROR]', err)
})
```

#### Parameters:

|Parameter Name|Type|Description| 
|--|--|--|
| XML | string | XML file fetched by [`finite.getXML()`](#finitegetxmldistrict-user-classes) |


#### Returns:

`finite.parseXML()` returns the exact same thing as [`finite.fetch()`](#finitefetchusername-password-district-state).



## Disclaimer

This is an **unofficial** API.
