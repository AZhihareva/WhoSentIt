let participants = [];

/*
 *This is the initial function called when the screen loads.
 *If there is a participants array stored in the browser,
 *it gets this array and calls update to populate the sceen with the array's contents
*/
const init = function(e) {
  participants = JSON.parse(localStorage.getItem("participants"));
  if (participants) {
    participants.forEach(p => {
      update(p);
    });
  }
  else {
    participants = [];
  }
};

/*
 *When the screen loads, this calls init()
*/
document.addEventListener("DOMContentLoaded", function() {
  init();
});

/*
 *Creates the HTML object for a participant and adds it to the screen
 *Param: p is the participant for which the HTML object is created
*/
function update(p) {
  //create nameAndButton div
  let nameAndButton = document.createElement("div");
  nameAndButton.classList.add("name-and-button");

  //create participant input
  let participant = document.createElement("article");
  participant.classList.add("participant");

  //add participant text
  let participantText = document.createElement("p");
  participantText.innerText = p
  participant.appendChild(participantText);

  //create delete button
  let deleteButton = document.createElement("button");
  deleteButton.classList.add("delete");
  deleteButton.innerHTML = 'X';

  //add participant and button to page
  nameAndButton.appendChild(participant);
  nameAndButton.appendChild(deleteButton);
  document.getElementById("participants-container").appendChild(nameAndButton);

  // add event listener for delete button
  deleteButton.addEventListener("click", deleteParticipant);

  //clear input in form after sumbit
  document.getElementById("participant-input").value = '';

};

/*
 *When the delete button next to a participant is clicked,
 *this is called to delete that participant from the screen and from the array
 *and pushes the new participants array to localStorage
 *Param: event is the click on the delete button
*/
function deleteParticipant(event) {
  event.target.parentNode.remove();
  let nameString = event.target.parentNode.firstChild.firstChild.innerHTML;
  let index = participants.indexOf(nameString);
  participants.splice(index, 1);
  localStorage.setItem("participants", JSON.stringify(participants));
};

/*
 *Runs whenever the "+" button is clicked or whenever user hits enter in the form
 *This adds the participant to the participant array and to the screen
 *and pushes the new participants array to localStorage
*/
function submit() {
  let form = document.getElementById("new-participant-form");
  let p = form.elements[0].value;
  if (p !== "") {
    participants.push(p);
    update(p);
    localStorage.setItem("participants", JSON.stringify(participants));
  }
};

/*
 *This runs whenever someone hits enter in the form
 *Calls sumbit() to add the participant to the participant array and to the screen
 *and pushes the new participants array to localStorage
*/
document.getElementById("new-participant-form").addEventListener("submit", function(event) {
  event.preventDefault();
  submit();
});

/*
 *When play is clicked,
 *The participants list is checked for duplicate names and
 *checked to make sure there are at least 3 participants.
 *If so, the game screen is pushed
*/
function play() {
  if (isDupicateName()) {
    alert("There are duplicate names. Please make all participant's names unique.");
  }
  else if (participants.length > 2) {
    window.location.href = "game.html";
  }
  else {
    alert("Please add more participants. You need at least 3 to play. Right now you have " + participants.length);
  }

};

/*
 *Checks to make sure that there are no duplicate names in the participants list
 *If there are, return true, else return false
*/
function isDupicateName() {
  for (let i = 0; i < participants.length; i++) {
    for (let j = 0; j < participants.length; j++) {
      if (participants[i] == participants[j] && i !== j) {
        return true;
      }
    }
  }
  return false;
};
