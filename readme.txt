--Readme document for *Nishiru Giragama*, *giragamn@uci.edu*, *87027124*--
Group 33
1. How many assignment points do you believe you completed (replace the *'s with your numbers)?

10/10
- 1/1 The ability to log overnight sleep
- 1/1 The ability to log sleepiness during the day
- 1/1 The ability to view these two categories of logged data
- 2/2 Either using a native device resource or backing up logged data
- 2/2 Following good principles of mobile design
- 2/2 Creating a compelling app
- 1/1 A readme and demo video which explains how these features were implemented and their design rationale

2. How long, in hours, did it take you to complete this assignment?
Roughly 12-15 hours


3. What online resources did you consult when completing this assignment? (list specific URLs)
https://ionicframework.com/docs/api/toast
I referenced ionic framework a lot especially for toast, but I also used it for the sliding delete features and some of the syntax for other features. I also referenced Ai for certain syntax as well.
I also referenced this https://capacitorjs.com/docs/apis/preferences for help with storage 
and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function for better understanding on async
I also used Ai to help me debug code when I was stuck and help me understand how to approach certain features I was stuck on, like the notifications.

4. What classmates or other individuals did you consult as part of this assignment? What did you discuss?
I didn't consult any classmates


5. Is there anything special we need to know in order to run your code?
allow notifications in browser


--Aim for no more than two sentences for each of the following questions.--


6. Did you design your app with a particular type of user in mind? If so, whom?
I designed the app for students, because that felt like the most fitting target for me, since I am a student and I struggle a lot with my sleep.


7. Did you design your app specifically for iOS or Android, or both?
I designed the app with iOS in mind since I use iOS but it should work for android as well.


8. How can a person log overnight sleep in your app? Why did you choose to support logging overnight sleep in this way?
The person just selects their bedtime and wake-up time using ionic pickers, which show times auto filled with 11pm to 7am. Then they hit save sleep.


9. How can a person log sleepiness during the day in your app? Why did you choose to support logging sleepiness in this way?
The user clicks out of a menu of buttons labeled with each of the sleepiness levels, and then taps log sleepiness. I chose this, because it gives the user an easy way to see all the buttons at once, and see their descriptions as well.


10. How can a person view the data they logged in your app? Why did you choose to support viewing logged data in this way?
A person can check the list called My logs, which lists their latest logs first along with the time of logging including their sleepiness levels. They also see their most recent nights card at the very top of the app. I chose listing the logs together because it makes it easier for the user to compare sleepiness with their sleep.


11. Which feature choose--using a native device resource, backing up logged data, or both?
both


12. If you used a native device resource, what feature did you add? How does this feature change the app's experience for a user?
I used local notifications to send reminders at 10, 2, and 6 and I allow the user a toggle to switch on and off the notifications, along with a test button to see if it would work. I initially added the test button for myself since I wasn't getting the notifications, but I realized it could help the user too, so they know if their notifications are on or not.


13. If you backed up logged data, where does it back up to?
it backs up to the browsers local storage, and permanent storage for a phone, so every save is still there when the app reopens.

14. How does your app implement or follow principles of good mobile design?
My app makes sure to handle errors, by making sure users can only enter valid sleep times. It also has an undo button along with the completed notification. It is also very user friendly and has a simple but appealing design that is easy to follow.

Demo vid timestamps 133finaldemo.mov
0:00 start screen
0:04 error prevention
0:10 sleep log successful
0:18 sleepiness scale logging
0:28 undo button
0:35 reminder toggle and test reminder
0:57 log remains after reloading
1:05 swiping to delete log and reloading
