var ajax = require('./ajax')
module.exports = {
  quiz: quiz
}
// Initialize GET/POST config
var config = {
  url: '', // Initalized later
  method: 'GET',
  contentType: 'application/json',
  query: ''
}

var time = 20                                               // 1 to 20 seconds per question
var questionContainer = document.getElementById('question') // where to put question
var textinput = document.querySelector('#textanswer')
var radioChoices = document.querySelector('#radiochoices')
var message = document.querySelector('#message')
var check = document.querySelector('#check_btn')
var quizdiv
var globaldata

function quiz (quizDiv, quizConfig) {
  config.url = quizConfig.url
  console.log(config)
  quizdiv = quizDiv
  getQuestion()
}
// PROBLEM WITH EVENT LISTENER
function start (globaldata) {
  console.log(globaldata)
  // WE HAVE TO DO A PROMISE FOR THE ANSWER
  new Promise(function (resolve, reject) {
    // setTimeout(reject, 5000)
    check.addEventListener('click', function (event) {
      console.log('IMPORTANT::!! ' + globaldata) // <<
      var answer = getAnswer(globaldata)
      if (answer.length === 0) {
        console.log('Answer not found. Give an answer')
      } else {
        // check here if answer is correct?
        console.log('>> Checking if answer is correct...')
        var x = {
          answer: answer
        }
        console.log('HYY' + config) // <<
        config.query = JSON.stringify(x)
        config.method = 'POST'
        console.log('HYY' + config) // <<
        ajax.request(config, function (error, data) {
          if (error) {
            reject(error)
          } else {
            console.log('seems like is correct!')
            resolve(data) // returns data!!!
          }
        })
      } // end of else
    })
  })
    .then(data => {
      globaldata = JSON.parse(data)
      console.log('RESPONSE: ' + globaldata.message)
      config.url = globaldata.nextURL
      console.log('NOW?: ' + config.url)
      // READ THE NEXT ONE
      config.method = 'GET'
      ajax.request(config, function (error, data) {
        if (error) {
          throw new Error('Network' + error)
        }
        globaldata = JSON.parse(data)
        // Check if there is a question
        if (globaldata.question !== null || globaldata.question !== 'undefined') {
          displayQuestion(globaldata)
          displayAnswers(globaldata)
        }
      })
    })
    .catch(err => console.log('while POSTING : ' + err))
}
//
//
//
//
//
//
// functions
function getQuestion () {
  config.method = 'GET'
  ajax.request(config, function (error, data) {
    if (error) {
      throw new Error('Network' + error)
    }
    globaldata = JSON.parse(data)
    console.log(globaldata)
    // Check if there is a question
    if (globaldata.question !== null || globaldata.question !== 'undefined') { // this is weird!
      displayQuestion(globaldata)
      displayAnswers(globaldata)
      config.url = data.nextURL
    }
    console.log(globaldata)
    console.log('Globaldata: ' + globaldata)
    console.log('GlobalConfig: ' + config)
    start(globaldata)
  })
}
/* Create HTML and add it on page */
function displayQuestion (data) {
  // Put our question in the string
  let string = data.question
  questionContainer.innerHTML = string
}
//
//
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

function showAlternatives (alternatives) {
  console.log(alternatives)
  for (var x in alternatives) {
    createAlternative(x, alternatives[x])
    console.log('alt: ' + x)
  }
}
function createAlternative (value, text) {
  var x = document.createElement('input')
  x.setAttribute('type', 'radio')
  x.setAttribute('name', 'choices')
  x.setAttribute('value', value)
  x.classList.add('radioButton')
  radioChoices.appendChild(x)
  text = document.createTextNode(text)
  radioChoices.appendChild(text)
}
function displayAnswers (data) {
  console.log('welcome')
  for (var key in data) {
    if (key === 'alternatives') {
      console.log('Alternatives mode!')
      showAlternatives(data.alternatives)
      break
    } else {
      textinput.classList.add('visible')
    }
  }
}
function getAnswer (data) {
  for (var key in data) {
    if (key === 'alternatives') {
      console.log('> Getting answer from Alternatives')
      var choices = document.getElementsByName('choices')
      for (var x in choices) {
        if (x.checked) {
          console.log('> Chosen alternative: ' + x.checked)
          return 'salami'
        }
      }
    } else {
      console.log('> Getting answer from textinput')
      return textinput.value
    }
  }
}
