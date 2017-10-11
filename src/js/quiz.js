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
var questionContainer = document.getElementById('question')
var textinput = document.querySelector('#textanswer')
var radioChoices = document.querySelector('#radiochoices')
var check = document.querySelector('#check_btn')
var infoDiv = document.querySelector('#info')
var quizDiv = document.querySelector('#quiz')
var startDiv = document.querySelector('#start')
var playAgainbtn = document.querySelector('#restartGame')
var statement = document.querySelector('#winOrLose')
var highscores = document.querySelector('#highscores')
var startTime, endTime
var time = 20
var score = 0
var interval
var top5 = []
try {
  let item = window.localStorage.getItem('top5')
  console.log(item)
  if (item !== '' && item !== null) {
    var temp = JSON.parse(item)
    // console.log('>>>>' + temp[0].player + ' LENGth: ' + temp.length)
    for (let i = 0; i < temp.length; i++) {
      console.log(temp[i] + ' is pushed in top5 ')
      top5.push(temp[i])
    }
  }
} catch (err) {

}

function quiz (quizDiv, quizConfig) {
  // console.log(quizConfig.username)
  config.url = quizConfig.url
  config.username = quizConfig.username
  // console.log(config)
  // Print the question
  start()
  startCounting()
  getQuestion(config.url, sendAnswer)
}
// So, after the callback, the data returns as a parameter
// The answer from the user should be send, after the click event
function sendAnswer (data) {
  // We make a promise. It will promise us that the answer, will be given
  // to us as soon as the user gives an answer.
  new Promise(function (resolve, reject) {
    setTimeout(reject, 20000)
    // By clicking the check, it means that the user has made a decision - answer
    check.addEventListener('click', function clickfun (e) {
      // GET DATA FROM USER
      try {
        var answer = getUserAnswer(data)
      } catch (err) {
        console.log('User didnt gave an answer.')
      }
      var x = {
        answer: answer
      }
      console.log('ANSWER CHOSEN: ' + x.answer)
      x = JSON.stringify(x)
      check.removeEventListener('click', clickfun)
      resolve(x)
    }) // Then, we have to send our answer to the server.
  }).then((readyanswer) => {
    console.log('Sending answer... <' + readyanswer + '>')
    var req = new window.XMLHttpRequest()
    req.open('POST', data.nextURL)
    req.setRequestHeader('Content-type', 'application/json')
    req.send(readyanswer)
    req.onload = function () {
      // Check the request status
      if (req.status >= 200 && req.status < 400) {
        time = 20 // Answer is correct, reset time
        var data = JSON.parse(req.responseText)
        // IMPORTANT! If there is not any other nextURL, then
        // the game has finished! We won :)
        var flag = false
        for (var key in data) {
          if (key === 'nextURL') {
            getQuestion(data.nextURL, sendAnswer)
            flag = true
          }
        }
        if (flag === false) {
          gameWin()
        }
      } else {
        console.log('Wrong answer.')
        gameOver()
      }
    }
  })
    .catch(err => {
      console.log(err)
      console.log('Game over')
      gameOver()
    })
}
//
function getQuestion (url, callback) {
  // Make the request to the server
  var req = new window.XMLHttpRequest()
  req.open('GET', url)
  req.setRequestHeader('Content-type', 'application/json')
  req.send()
  req.onload = function () {
    // Check the request status
    if (req.status >= 200 && req.status < 400) {
      var data = JSON.parse(req.responseText)
      // As soon as it loads, it displays:
      displayQuestion(data)
      displayAnswers(data)
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
  // Clean the div first
  cleanAnswerDiv()
  // console.log('welcome')
  for (var key in data) {
    if (key === 'alternatives') {
      // console.log('Alternatives mode!')
      showAlternatives(data.alternatives)
      return
    }
  }
  // Else, is type of textinput
  textinput.classList.add('visible')
}
function showAlternatives (alternatives) {
  for (var x in alternatives) {
    createAlternative(x, alternatives[x])
  }
}
function createAlternative (value, text) {
  var div = document.createElement('div')
  var x = document.createElement('input')
  x.setAttribute('type', 'radio')
  x.setAttribute('name', 'choices')
  x.setAttribute('value', value)
  x.classList.add('radioButton')
  let textdiv = document.createTextNode(text)
  div.appendChild(x)
  div.appendChild(textdiv)
  radioChoices.appendChild(div)
}
function getUserAnswer (data) {
  // console.log(data)
  for (var key in data) {
    // console.log(key)
    if (key === 'alternatives') {
      // console.log('> Getting answer from Alternatives')
      var chosen = document.querySelector('input[name = "choices"]:checked').value
      return chosen
    }
  } // end of for
  // It is from inputtext
  return textinput.value
}
function cleanAnswerDiv () {
  textinput.classList.remove('visible')
  textinput.classList.add('hide-me')
  textinput.value = ''
  while (radioChoices.firstChild) {
    radioChoices.removeChild(radioChoices.firstChild)
  }
}
function startCounting () {
  interval = setInterval(function () {
    timer(time--)
  }, 1000)
}

// Show the seconds on the page
function timer (time) {
  document.getElementById('secondsleft').innerHTML = time
}
//
playAgainbtn.addEventListener('click', function () {
  var parent = infoDiv.parentNode
  parent.removeChild(infoDiv)
  parent.appendChild(startDiv)
})
function gameOver () {
  updateHighScores()
  clearInterval(interval)
  time = 20 // reset time
  var parent = quizDiv.parentNode
  parent.removeChild(quizDiv)
  parent.appendChild(infoDiv)
  statement.innerHTML = 'OOPS... GAME OVER!'
}
function gameWin () {
  clearInterval(interval)
  end()
  time = 20 // reset time
  statement.innerHTML = 'Congratzulations! You completed the quiz.' +
  'Your total time is: ' + score
  toHighScores()
  updateHighScores()
  var parent = quizDiv.parentNode
  parent.removeChild(quizDiv)
  parent.appendChild(infoDiv)
}
function toHighScores () {
  var game = {
    player: config.username,
    score: score
  }
  top5.push(game)

    // Sort Highscores board
  let temp
  console.log('AAAAAAAAAA> ' + top5.length)
  if (top5.length >= 2) {
    for (let i = 1; i < top5.length; i++) {
      for (let j = i; j > 0; j--) {
        console.log('if ' + top5[j] + ' < ' + top5[j - 1])
        if (top5[j].score < top5[j - 1].score) {
          temp = top5[j]
          top5[j] = top5[j - 1]
          top5[j - 1] = temp
        }
      }
    }
  }

  top5 = JSON.stringify(top5)
  window.localStorage.setItem('top5', top5)
  top5 = JSON.parse(top5)
  // console.log(top5)
}
function start () {
  startTime = new Date()
};

function end () {
  endTime = new Date()
  var timeDiff = endTime - startTime
  // strip the ms
  timeDiff /= 1000
  // get seconds
  score = timeDiff
  console.log(score + 'seconds')
}
function updateHighScores () {
  while (highscores.firstChild) {
    highscores.removeChild(highscores.firstChild)
  }
  console.log(top5)
  // console.log(top5.length + '<- length')
  // Remember to translate JSON into object!
  for (let i = 0; i < top5.length; i++) {
    var node = document.createElement('LI')  // Create a <li> node
    var textnode = document.createTextNode(top5[i].player + ' scored: ' + top5[i].score) // Create a text node
    node.appendChild(textnode)
    highscores.appendChild(node)
  }
}
