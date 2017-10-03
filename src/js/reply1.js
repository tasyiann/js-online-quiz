module.exports = {
  getReply: reply
}

function reply (checkButton, answersDiv) {
  return new Promise(function (resolve, reject) {
    setTimeout(reject, 5000)
    checkButton.addEventListener('click', function (event) {
      var answer = getInputText(answersDiv) // OR GET FROM ALTs
      if (answer.length === 0) {
        console.log('Answer not found. Give an answer')
      } else {
        // check here if answer is correct?
        resolve(answer)
      }
    })
  })
}

// Get text from input
function getInputText (textinput) {
  console.log('Answer from text input: ' + textinput.value)
  textinput.classList.add('hide-me')
  return textinput.value
}
