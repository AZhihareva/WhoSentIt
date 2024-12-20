let participants = [];
let recipient = "Recipient";
let sender = "Sender";

let senderToRecipient = new Map();
let recipientToSender = new Map();

let back = "#5ac99d";
let red = "#E34424";
let green = "#1fc62a";

let isSearchingBySender = true;
let isSearchingByRecipient = false;


/*
 *This funciton inititalizes the dropdown feature (HTML select element)
 *with all the names in the participants list
*/
const init = function(e) {
  participants = JSON.parse(localStorage.getItem("participants"));
  let menu = document.getElementById("menu");
  if (participants) {
    participants.forEach(sender => {
        let item = document.createElement("option");
        item.innerHTML = sender;
        item.value = sender;
        menu.appendChild(item);
    });
  }
  else {
    participants = [];
  }
};

/*
 *When the screen loads,
    *init() is called to set up the drop down (HTML Select element)
    *generate new solution is called to generate the Sender Solution
    *And the correct name is set under hover
*/
document.addEventListener("DOMContentLoaded", function() {
  init();
  generateNewSolution();
  document.getElementById("reveal-content").innerHTML = senderToRecipient.get(participants[0]);
});

/*
 * Randomly generate a sender-recipient pairs for the participants given.
 * Save the pairs to the senderToRecipient map and recipientToSender map.
 *
 * Note: My solution allows for solutions such as
 * Participants = [a, b, c, d]
 * senderToRecipient = {a=b, b=a, c=d, d=c}
 * This solution is comprised of two subgroups where the first person is the Sender of the second and the second is the Sender first.
 * I allow this to happen because it closer to a truly random solution.
 * However, it can cause a problem because the last person cannot have themselves.
     * I solve for this with the shuffledParticipants list:
     *     If there are two remaining humans and one of the remaining is the last Sender, that Sender cannot have themselves,
     *     so the second-to-last Sender must have the last Sender as their recipient
*/

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateSolution() {
    let shuffledParticipants = shuffleArray([...participants]);
    for (let i = 0; i < shuffledParticipants.length; i++){
      const recipient = shuffledParticipants[(i + 1) % shuffledParticipants.length];
      const sender = shuffledParticipants[i];
      senderToRecipient.set(sender, recipient);
      recipientToSender.set(recipient, sender);
    }
};

/*
 * Erase the existing solution by clearing the senderToRecipient and recipientToSender maps.
 * Then, generate a new sender solution by calling generateSolution().
*/
function generateNewSolution() {
  senderToRecipient.clear();
  recipientToSender.clear();
  generateSolution();
  fill();
};

/*
 *For whatever name is selected by the dropdown,
 *puts the corresponding name beneath the hover panel
*/
function fill() {
  if (isSearchingBySender) {
    recipient = senderToRecipient.get(document.getElementById("menu").value);
    document.getElementById("reveal-content").innerHTML = recipient;
  }
  if (isSearchingByRecipient) {
    sender = recipientToSender.get(document.getElementById("menu").value);
    document.getElementById("reveal-content").innerHTML = sender;
  }
};

/*
 *When searchBySender is selected, this does all of the html and css changes on the screen
 additionally, it calls fill()
*/
function searchBySender() {
  isSearchingBySender = true;
  isSearchingByRecipient = false;
  console.log("searchBySender");
  let btn = document.getElementById("search-by-sender");
  btn.style.backgroundColor = red;
  let otherBtn = document.getElementById("search-by-recipient");
  otherBtn.style.transition = "0.3s";
  otherBtn.style.backgroundColor = "transparent";
  let chosenOne = document.getElementById("reveal-content");
  chosenOne.style.backgroundColor = green;
  document.getElementById("caption").innerHTML = "Hover to Reveal Recipient";
  document.getElementById("caption").style.color = back;
  document.getElementById("for").innerHTML = "Recipient for ";
  fill();
};

/*
 *When searchByRecipient is selected, this does all of the html and css changes on the screen
 additionally, it calls fill()
*/
function searchByRecipient() {
  isSearchingByRecipient = true;
  isSearchingBySender = false;
  console.log("searchByRecipient");
  let btn = document.getElementById("search-by-recipient");
  btn.style.backgroundColor = green;
  let otherBtn = document.getElementById("search-by-sender");
  otherBtn.style.transition = "0.3s";
  otherBtn.style.backgroundColor = "transparent";
  let chosenOne = document.getElementById("reveal-content");
  chosenOne.style.backgroundColor = red;
  document.getElementById("caption").innerHTML = "Hover to Reveal Sender";
  document.getElementById("for").innerHTML = "Sender for ";
  document.getElementById("caption").style.color = back;
  fill();
 };

/*
 *backgroundColor when hovering got messed up after I overrode the main backgroundColor,
 *solution was to do it all in javascript instead of css
*/
function hoverSender() {
  let otherBtn = document.getElementById("search-by-sender");
  otherBtn.style.transition = "0.3s";
  otherBtn.style.backgroundColor = red;
};
function unhoverSender() {
  if (!isSearchingBySender) {
    let otherBtn = document.getElementById("search-by-sender");
    otherBtn.style.transition = "0.3s";
    otherBtn.style.backgroundColor = "transparent";
  }
};
function hoverRecipient() {
  let otherBtn = document.getElementById("search-by-recipient");
  otherBtn.style.transition = "0.3s";
  otherBtn.style.backgroundColor = green;
};
function unhoverRecipient() {
  if( !isSearchingByRecipient) {
    let otherBtn = document.getElementById("search-by-recipient");
    otherBtn.style.transition = "0.3s";
    otherBtn.style.backgroundColor = "transparent";
  }
};

/*
If user clicks Edit Participants List, this is called, and the user is taken back to the home page
*/
function edit() {
  localStorage.setItem("participants", JSON.stringify(participants));
  window.location.href = "index.html";
};

function home() {
  if (confirm('All data will be deleted. Continue?')) {
    localStorage.removeItem("participants");
    window.location.href = "index.html";
  }
}
