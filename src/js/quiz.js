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
// Initialize data
// var data = 'Initialized Data xx'
var questionContainer = document.getElementById('question') // where to put question
var textinput = document.querySelector('#textanswer')
var radioChoices = document.querySelector('#radiochoices')
var check = document.querySelector('#check_btn')
var message = document.querySelector('#message')

function quiz (quizDiv, quizConfig) {
  config.url = quizConfig.url
  console.log(config)
  // Print the question
  getQuestion(config.url, sendAnswer)
}
// So, after the callback, the data returns as a parameter
// The answer from the user should be send, after the click event
function sendAnswer (data) {
  console.log(data)
  console.log('WE ARE IN SEND ANSWER')
  var promise = new Promise(function (resolve, reject) {
    setTimeout(reject, 5000)
    check.addEventListener('click', function (e) {
      console.log('CLICK!')
      e.target.removeEventListener(e.type, arguments.callee) // skip for now
      // GET DATA FROM INPUT
      var answer = getUserAnswer(data)
      console.log('>> Checking if answer is correct...')
      var x = {
        answer: answer
      }
      console.log('ANSWER CHOSEN: ' + x.answer)
      x = JSON.stringify(x)
      resolve(x)
    })
  }).then((readyanswer) => {
    console.log(data) // if this prints, then is okay.
    // we will rebuyilt the config
    // howwwwwwww... call back maybe?
    console.log('PREPARING TO SEND <' + readyanswer + '>')
    var req = new XMLHttpRequest()
    req.open('POST', data.nextURL)
    req.setRequestHeader('Content-type', 'application/json')
    req.send(readyanswer)
    req.onload = function () {
      // Check the request status
      if (req.status >= 200 && req.status < 400) {
        var data = JSON.parse(req.responseText)
        message.innerHTML = data.message
        console.log(data)
        getQuestion(data.nextURL, sendAnswer)
      } else { console.log('Error with GET') }
    }
  })
    .catch(err => {
      console.log(err)
      console.log('TIME IS UP! GO HOME')
    })
}
//
// hm.... can I make a new object, for every question, passing the data?
// promise can return u the next url
//
function getQuestion (url, callback) {
  // Make the request to the server
  var req = new XMLHttpRequest()
  req.open('GET', url)
  req.setRequestHeader('Content-type', 'application/json')
  req.send()
  req.onload = function () {
    // Check the request status
    if (req.status >= 200 && req.status < 400) {
      var data = JSON.parse(req.responseText)
      displayQuestion(data)
      displayAnswers(data)
      console.log(data)
      callback(data)
    } else { console.log('Error with GET') }
  }
}

function displayQuestion (data) {
  // Put our question in the string
  let string = data.question
  questionContainer.innerHTML = string
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
function getUserAnswer (data) {
  console.log(data)
  for (var key in data) {
    console.log(key)
    if (key === 'alternatives') {
      console.log('> Getting answer from Alternatives')
      var chosen = document.querySelector('input[name = "choices"]:checked').value
      return chosen
    }
  } // end of for
  // It is from inputtext
  console.log('> Getting answer from textinput')
  return textinput.value
}
