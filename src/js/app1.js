var quiz = require('./quiz')
var config = {
  // load 1st question
  url: 'http://vhost3.lnu.se:20080/question/1'
}
var quizDiv = document.querySelector('#quiz')
var startbtn = document.getElementById('start_btn')
// Click start button to start the game
startbtn.addEventListener('click', function () {
  quiz.quiz(quizDiv, config)
  // Hide the button
  startbtn.classList.add('hide-me')
})
