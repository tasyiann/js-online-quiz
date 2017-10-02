/*
Note that:
The server will put out two different types of questions.
Simple text questions and questions with alternatives
where the user should answer with the right key "alt1", "alt2" etc.
You can watch the server responses and decide what is what.

The last question answered will not return any new link to
a new question and that means that the quiz is over.
*/

var time = 20                                               // 1 to 20 seconds per question
var url = 'http://vhost3.lnu.se:20080/question/1'           // start with 1st question
var questionContainer = document.getElementById('question') // where to put question
var startbtn = document.getElementById('start_btn')         // button to start
var textinput = document.querySelector('#textanswer')
var message = document.querySelector('#message')

// Click start button to start the game
startbtn.addEventListener('click', function () {
  // Hide the button
  startbtn.classList.add('hide-me')
  // Request access
  var request = new XMLHttpRequest()
  // >GET is to get Data<
  // >POST is to send Data<
  request.open('GET', url)
  // What should happen once the data is loaded:
  request.onload = function () {
    // Check the request status
    if (request.status >= 200 && request.status < 400) {
      // Our browser, when loading the data, doesn't know how to
      // interpearete the JSON code. Doesn't even know that this is JSON
      let data = JSON.parse(request.responseText)
      console.log(data)
      displayQuestion(data)
      startCounting()
      // Get the text from input
      textinput.addEventListener('keypress', function (event) {
        if (event.KeyCode === 13 || event.which === 13) {
          console.log('answer from text input: ' + textinput.value)
          if (textinput.value.length === 0) {
            console.log('Answer not found. Give an answer')
          } else {
            sendAnswer(textinput.value, data)
          }
        }
      })
    } else {
      console.log('Returns error')
    }
  }// end of onLoad
  // If error occurs, let me know
  request.onerror = function () {
    console.log('Connection Error')
  }
  //
  //
  //
  //
  request.send()
})// end of EventListener

/* Create HTML and add it on page */
function displayQuestion (data) {
  // Put our question in the string
  let string = data.question
  questionContainer.insertAdjacentHTML('beforeend', string)
}
/* Send the answer */
function sendAnswer (x, data) {
  var request = new XMLHttpRequest()
  request.addEventListener('load', function () {
    var response = JSON.parse(request.response)
    console.log(response.message)
    message.innerHTML = response.message
    if (request.status >= 400) {
      throw new Error('Network error: ' + request.status)
    }
  })

  request.open('POST', data.nextURL)
  console.log('hi! next url is:' + data.nextURL)
  var answer = {
    answer: x
  }
  request.setRequestHeader('Content-type', 'application/json')
  request.send(JSON.stringify(answer))
}
// Counting the seconds
var startCounting = function () {
  setInterval(function () {
    timer()
    if (time === 0) {
      time = 20
    }
  }, 1000)
}

// Show the seconds on the page
function timer () {
  document.getElementById('secondsleft').innerHTML = time--
}
