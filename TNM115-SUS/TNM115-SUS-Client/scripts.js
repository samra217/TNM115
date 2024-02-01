/*
 *  Filename: scripts.js
 *  Description: Example solution for Lesson 3: JavaScript.
 *  Course Code: TNM115-2024VT
 *  Institution: Linköping University
 *
 *  Author: Nico Reski
 *  Version: 2024-01-22
 */

const serverUrl = "http://127.0.0.1:3000";

// array of JSON objects, representing individual Likert scale options;
// each JSON object has three keys (id, label, value)
const likertScaleJsonArray = [
  { id: "stronglydisagree", label: "Strongly Disagree", value: 1 },
  { id: "disagree", label: "Disagree", value: 2 },
  { id: "neutral", label: "Neutral", value: 3 },
  { id: "agree", label: "Agree", value: 4 },
  { id: "stronglyagree", label: "Strongly Agree", value: 5 },
];

// array of JSON objects, representing individual SUS questionnaire items;
// each JSON object has two keys (id, statement)
const susQuestionnaireJsonArray = [
  {
    id: 1,
    statement: "I think that I would like to use this system frequently.",
  },
  { id: 2, statement: "I found the system unnecessarily complex." },
  { id: 3, statement: "I thought the system was easy to use." },
  {
    id: 4,
    statement:
      "I think that I would need the support of a technical person to be able to use this system.",
  },
  {
    id: 5,
    statement:
      "I found the various functions in this system were well integrated.",
  },
  {
    id: 6,
    statement: "I thought there was too much inconsistency in this system.",
  },
  {
    id: 7,
    statement:
      "I would imagine that most people would learn to use this system very quickly.",
  },
  { id: 8, statement: "I found the system very cumbersome to use." },
  { id: 9, statement: "I felt very confident using the system." },
  {
    id: 10,
    statement:
      "I needed to learn a lot of things before I could get going with this system.",
  },
];

// function to randomize the array containing the SUS questionnaire items as JSON objects
// returns: array of JSON objects
function getRandomizedSusQuestionnaireJsonArray() {
  // implementation of the Fisher Yates method to shuffle an array
  // Source: https://www.w3schools.com/js/js_array_sort.asp

  for (let i = susQuestionnaireJsonArray.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let k = susQuestionnaireJsonArray[i];
    susQuestionnaireJsonArray[i] = susQuestionnaireJsonArray[j];
    susQuestionnaireJsonArray[j] = k;
  }

  return susQuestionnaireJsonArray;
}

// function to calculate the System Usability Scale (SUS) score based on an input array of JSON objects;
// each JSON object has two keys (id, value), representing the answers of the individual SUS items
// returns: either a number value, representing the calculated SUS score,
//          or null if at least one of the answer values is missing (null)

// ===== PROVIDED JS SOURCE CODE    -- ABOVE   =====
// ===== JS LESSON 3 IMPLEMENTATION -- BENEATH =====

// main function triggered for generating a new questionnaire
function generateQuestionnaire() {
  // create URL interface from the web page's URL
  const webpageURL = new URL(document.URL);

  // sus.html?random=true
  const isRandomized = webpageURL.searchParams.get("random") == "true";

  // console.log(webpageURL);
  // console.log(typeof(isRandomized));
  // console.log(isRandomized);

  const susContainerElement = document.getElementById(
    "sus-questionnaire-container"
  );
  if (isRandomized)
    createSusQuestionnaire(
      susContainerElement,
      getRandomizedSusQuestionnaireJsonArray(),
      false
    );
  else
    createSusQuestionnaire(
      susContainerElement,
      susQuestionnaireJsonArray,
      true
    );
}

// function used for creating a HTML DOM element node that represents an individual
// option in the Likert scale
function createLikertOptionDiv(susItemId, likertOptionJson) {
  const divContainer = document.createElement("div");
  divContainer.className = "likert-flex-item";

  const inputElement = document.createElement("input");
  inputElement.type = "radio";
  inputElement.name = susItemId + "-scale";
  inputElement.id = inputElement.name + "-" + likertOptionJson.id;
  inputElement.value = likertOptionJson.value;

  const labelElement = document.createElement("label");
  labelElement.for = inputElement.id;
  const labelText = document.createTextNode(likertOptionJson.label);
  labelElement.appendChild(labelText);

  divContainer.appendChild(inputElement);
  divContainer.appendChild(labelElement);

  return divContainer;
}

// function used for creating a HTML DOM element node that represents the
// 5-point Likert scale, containing five individual Likert option containers
function createLikertScaleDiv(susItemId) {
  const divContainer = document.createElement("div");
  divContainer.className = "sus-item-scale-flex-item likert-flexbox-container";

  for (let i = 0; i < likertScaleJsonArray.length; i++) {
    const currentLikertOptionDiv = createLikertOptionDiv(
      susItemId,
      likertScaleJsonArray[i]
    );
    divContainer.appendChild(currentLikertOptionDiv);
  }

  return divContainer;
}

// function used for creating a HTML DOM element node that represents an individual
// SUS item in the questionnaire
function createSusItemDiv(susItemJson, isLabelDisplayed) {
  const divContainer = document.createElement("div");
  divContainer.className = "sus-item-flexbox-container";

  const pLabel = document.createElement("p");
  pLabel.className = "sus-item-number-flex-item";
  if (isLabelDisplayed) {
    const pLabelText = document.createTextNode(susItemJson.id);
    pLabel.appendChild(pLabelText);
  }

  const pStatement = document.createElement("p");
  pStatement.className = "sus-item-statement-flex-item";
  const pStatementText = document.createTextNode(susItemJson.statement);
  pStatement.appendChild(pStatementText);

  const divLikertScale = createLikertScaleDiv(susItemJson.id);

  divContainer.appendChild(pLabel);
  divContainer.appendChild(pStatement);
  divContainer.appendChild(divLikertScale);

  return divContainer;
}

// function used for creating and inserting all HTML DOM element nodes
// that represent the entire SUS questionnaire (with all its ten items)
function createSusQuestionnaire(
  parentContainer,
  questionnaireJsonArray,
  isLabelDisplayed
) {
  // remove all children except the first one -> h2 container
  while (
    parentContainer.lastElementChild != parentContainer.firstElementChild
  ) {
    parentContainer.removeChild(parentContainer.lastChild);
  }

  parentContainer.appendChild(document.createElement("hr"));

  for (let i = 0; i < questionnaireJsonArray.length; i++) {
    const susItemDiv = createSusItemDiv(
      questionnaireJsonArray[i],
      isLabelDisplayed
    );
    parentContainer.appendChild(susItemDiv);

    parentContainer.appendChild(document.createElement("hr"));
  }
}

// main function triggered for submitting a filled in questionnaire and determining the SUS scor
// function to extract the value of a selected ("checked") radio button in a
// radio button group for a SUS item with a specific ID
function getSubmittedValueForSusItem(susItemId) {
  const radioButtonGroupName = susItemId + "-scale";
  const radioCollection = document.getElementsByName(radioButtonGroupName);
  let result = null;
  for (let i = 0; i < radioCollection.length; i++) {
    if (radioCollection[i].checked) result = Number(radioCollection[i].value);
  }
  return result;
}

async function submitQuestionnaireToServer() {
  const resultJsonArray = [];
  for (let i = 0; i < susQuestionnaireJsonArray.length; i++) {
    const currentResult = getSubmittedValueForSusItem(
      susQuestionnaireJsonArray[i].id
    );
    resultJsonArray.push({
      id: susQuestionnaireJsonArray[i].id,
      value: currentResult,
    });
  }

  const susJsonDataForServer = {
    //Make all results in to one object instead of ten, makes it easier for the server to handle
    results: resultJsonArray,
    name: "TNM115 - Values of selected SUS questionnaire items.",
  };

  const respone = await fetch(serverUrl + "/score", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(susJsonDataForServer),
  });

  if (respone.ok) {
    respone.json().then((jsonBody) => {
      const pSusResult = document.getElementById("sus-result");
      pSusResult.innerHTML = "SUS Score = " + jsonBody.result;
    });
  } else {
    // console.log("the client request to the server was unsuccesful");
    //console.log(respone.status + " | " + respone.statusText);
    const pSusResult = document.getElementById("sus-result");
    pSusResult.innerHTML = "Invalid: Not all items were answered";
  }
}
