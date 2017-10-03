
var ajax = require('./ajax')
module.exports = {
  quiz: quiz
}
// Initialize GET/POST config
var xconfig = {
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
var xdata

function quiz (quizDiv, quizConfig) {
  xconfig.url = quizConfig.url
  console.log(xconfig)
  quizdiv = quizDiv
  xconfig.method = 'GET'
  get(xconfig)
  console.log(xdata)
  if (xdata.question !== null || xdata.question !== 'undefined') { // this is weird!
    displayQuestion(xdata)
    displayAnswers(xdata)
    xconfig.url = xdata.nextURL
  }
  console.log(xdata)
  start(xdata)
}

// Passing data from first question
function start (data) {
  console.log(xdata)
  // Event listener
  check.addEventListener('click', function () {
    party()
  })
}
//
//
function post (config) {
  config.method = 'POST'
  ajax.request(config, function (error, data) {
    if (error) {
      throw new Error('Network' + error)
    }
    data = JSON.parse(data)
    console.log('hey from here ' + data)
    updateData(data)
  })
}
//
function get (config) {
  config.method = 'GET'
  ajax.request(config, function (error, data) {
    if (error) {
      throw new Error('Network' + error)
    }
    data = JSON.parse(data)
    console.log('hey from here ' + data.message)
    updateData(data)
  })
}
//
//
//
// functions
function party(event) {
  console.log('IMPORTANT::!! ' + getdata()) // <<
  var answer = getAnswer(xdata)
  if (answer.length === 0) {
    console.log('Answer not found. Give an answer')
  } else {
    // check here if answer is correct?
    console.log('>> Checking if answer is correct...')
    var x = {
      answer: answer
    }
    console.log('HYY' + xconfig) // <<
    xconfig.query = JSON.stringify(x)
    xconfig.method = 'POST'
    console.log('HYY' + xconfig) // <<
    ajax.request(xconfig, function (error, data) {
      if (error) {
        console.log('ERROR')
      } else {
        console.log('seems like is correct!')
        updateData(data) // returns data!!!
      }
    })
    xdata = JSON.parse(xdata)
    console.log('RESPONSE: ' + xdata.message)
    xconfig.url = xdata.nextURL
    console.log('NOW?: ' + xconfig.url)
    // READ THE NEXT ONE
    xconfig.method = 'GET'
    ajax.request(xconfig, function (error, data) {
      if (error) {
        throw new Error('Network' + error)
      }
      data = JSON.parse(data)
      // Check if there is a question
      if (data.question !== null || data.question !== 'undefined') {
        displayQuestion(data)
        displayAnswers(data)
      }
    })
  } // end of else
}
/* Create HTML and add it on page */
function displayQuestion(data) {
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
function timer() {
  document.getElementById('secondsleft').innerHTML = time--
}

function showAlternatives(alternatives) {
  console.log(alternatives)
  for (var x in alternatives) {
    createAlternative(x, alternatives[x])
    console.log('alt: ' + x)
  }
}
function createAlternative(value, text) {
  var x = document.createElement('input')
  x.setAttribute('type', 'radio')
  x.setAttribute('name', 'choices')
  x.setAttribute('value', value)
  x.classList.add('radioButton')
  radioChoices.appendChild(x)
  text = document.createTextNode(text)
  radioChoices.appendChild(text)
}
function displayAnswers(data) {
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
function getAnswer(data) {
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
function updateConfig (config) {
  xconfig = config
}
function updateData (data) {
  xdata = data
}
function getdata() {
  return xdata
}
