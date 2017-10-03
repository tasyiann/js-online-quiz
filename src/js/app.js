var quiz = require('./quiz')
var config = {
  // load 1st question
  url: 'http://vhost3.lnu.se:20080/question/1',
  username: ''
}
var startDiv = document.querySelector('#start')
var quizDiv = document.querySelector('#quiz')
var infoDiv = document.querySelector('#info')
var startbtn = document.getElementById('start_btn')
var usernamebox = document.getElementById('username')

quizDiv.parentNode.removeChild(quizDiv)
infoDiv.parentNode.removeChild(infoDiv)

// Click start button to start the game
startbtn.addEventListener('click', function () {
  var parent = startDiv.parentNode
  console.log(parent)
  parent.removeChild(startDiv)
  parent.appendChild(quizDiv)
  config.username = usernamebox.value
  console.log(config.username)
  quiz.quiz(quizDiv, config)
})
