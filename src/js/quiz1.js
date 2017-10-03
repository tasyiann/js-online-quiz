var ajax = require('./ajax')
var userReply = require('./reply')
module.exports = {
  quiz: quiz
}

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
var questionContainer = document.getElementById('question') // where to put question
var textinput = document.querySelector('#textanswer')
var message = document.querySelector('#message')
var check = document.querySelector('#check_btn')

function quiz (quizDiv, quizConfig) {
  // Initialize GET/POST config
  var config = {
    url: quizConfig.url,
    method: 'GET',
    contentType: 'application/json',
    query: ''
  }
  nextQuestion(config)
}
//
//
//
//
//
// checkButton.addEventListener('click', function (event) {
// })
//
//
//
//
//
function nextQuestion (config) {
  // ME TO CLICK EVENT!!! <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< KATHE FORA P PATIETAI TO BUTTON, NA EKSETAZEI TIN APANTISI,
  // KAI NA PROXORA STIN EPOMENI ERWTISI, I NA VGENNEI!
  var promiseQuestion = ajax.get(config)
    .then((responseText) => {
      var data = JSON.parse(responseText)
      console.log(data)
      displayQuestion(data)
      startCounting()
      userReply.getReply(check, textinput)
      return data
    })
    .catch(err => {
      console.log(err)
    })
  //
  var promiseAnswer = userReply.getReply(check, textinput)
    .then((answer) => {
      return answer
    })
    .catch(err => {
      message.innerHTML = 'TOO LATE! (5sec)'
      console.log(err)
    })
  // PROMISE ALL
  Promise.all([promiseQuestion, promiseAnswer])
    .then(([data, answer]) => {
      var x = {
        answer: answer
      }
      config.query = JSON.stringify(x)
      config.url = data.nextURL
      console.log('query: ' + config.query)
      console.log('next url: ' + config.url)
      return ajax.post(config)
      // if (config.url !== 'undefined') {
      //  nextQuestion(config)
      // }
    })
    .then(responseText => {
      var data = JSON.parse(responseText)
      console.log('Server respond: ' + data)
      message.innerHTML = data.message
      nextQuestion(config)
      if (config.nextURL !== 'undefined' || config.nextURL !== '') {
        return nextQuestion
      }
    })
    .catch((err) => {
      console.log(err)
    })
}
//
//
/* Create HTML and add it on page */
function displayQuestion (data) {
  // Put our question in the string
  let string = data.question
  questionContainer.insertAdjacentHTML('beforeend', string)
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

/*
function reply(checkButton) {
  return new Promise(function (resolve, reject) {
    checkButton.addEventListener('click', function (event) {
      var answer = getInputText()
      console.log('THIS HERE: ' + responseText)
      var data = JSON.parse(responseText)
      console.log(data)
      // message.innerHTML = data.message
      console.log('AAAANSWER IS: ' + answer)
      config.query = answer
      config.url = data.nextURL
      console.log('NEXT URL IS: ' + data.nextURL)
      ajax.post(config)
        .then(r => {
          var data1 = JSON.parse(r)
          message.innerHTML = data1.message
        })
        .catch(err => {
          console.log(err)
        })
    })
  }
}
*/
