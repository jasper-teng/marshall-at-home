var json = require('sampleQns.json');
var qnType = "";
var selectedAns = ""; //catch all variable for the answer picked/typed/whatever.
var correctAns = "";

function stuff() {
    $.getJSON("sampleQns.json"), function (data) {
        console.log(data);
    }
}

function getData() {
    fetch('sampleQns.json'
        , {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            loadQuestion(myJson["Questions"][1])
        });
}
useEffect(() => {
    getData()
}, [])


function loadQuestion(data) {
    //TODO: add support for question types
    //TODO: spawn buttons based on how many answeres there are.
    switch (data.QnsType) { //TODO: add the other question types here
        case "1":
            loadQnType1(data);
            break;

        case "2":
            loadQnType2(data);
            break;

        default:
            break;

    }
}

function loadQnType1(data) {

    correctAns = data.Correct; //store the correct answer

    qnType = "1";

    var qnType1 = `<h3 id="qnText">${data.Question}</h3>
    <div>`
    for (i = 0; i < data.Answers.length; i++) {
        qnType1 += `<button onclick="select('${i + 1}')" class="answer">${data.Answers[i]}</button>`
    }
    qnType1 += `</div> <h2 id="selectedAns">bruh</h2>`;

    document.getElementById("qnBody").innerHTML += qnType1;
    console.log("appending type 1 qn");
}

function loadQnType2(data) {

    qnType = "2";

    correctAns = data.AcceptedAns; //store the correct answer

    console.log(correctAns);

    console.log("loading qn type 2")
    var qnType2 = `<h3 id="qnText">${data.Question}</h3>
    <div>
    <input type="text" id="selectedAns" name="answerField"><br>

  </form></div>`


    document.getElementById("qnBody").innerHTML += qnType2;

}


function select(number) {
    console.log(number + " selected")
    selectedAns = number;
    document.getElementById("selectedAns").innerHTML = number;
}


function lockQuestion() {
    console.log(selectedAns + correctAns);

    //read the current question type, then pass judgement.

    switch (qnType) {
        case "1":
            verifyQnType1();
            break;
        case "2":
            selectedAns = document.getElementById("selectedAns").value;
            console.log(selectedAns);
            verifyQnType2();
            break;
    }
}

function verifyQnType1() {
    if (selectedAns == correctAns) {

        alert("right");

    } else {
        alert("wrong");
    }
}

function verifyQnType2() {
    var isCorrect = false;

    for (i = 0; i < correctAns.length; i++) {
        if (correctAns[i] == selectedAns) {
            isCorrect = true;
        }
    }

    isCorrect ? alert("right") : alert("wrong")
}