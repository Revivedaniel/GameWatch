// Varibles
const questionEl = document.getElementById('questions');
const TextA = document.getElementById('textA');
const TextB = document.getElementById('textB');
const TextC = document.getElementById('textC');
const TextD = document.getElementById('textD');
const answerEls = document.querySelectorAll('.chosen');

let currentQuestion = 0;
let score = 0;

// Array of questions
const pokeQuiz = [
    {
        question: "How many evolutions does Eevee have?",
        a: '3',
        b: '5',
        c: '7',
        d: '8',
        correct: '8',
    },
    {
        question: "In Pokemon Saphire/Ruby who are the main villians?",
        a: 'Team Rocket',
        b: 'Team Skull',
        c: 'Team Aqua/Magma',
        d: 'Team Galactic',
        correct: 'c',
    },
    {
        question: "Who is the mascot of Pokemon?",
        a: 'Pikachu',
        b: 'Togepi',
        c: 'Meowth',
        d: 'Slowpoke',
        correct: 'a',
    },
    {
        question: "What do you use to catch Pokemon?",
        a: 'Potion',
        b: 'Cheri Berry',
        c: 'Heal Ball',
        d: 'Blue Flute',
        correct: 'c',
    },
    {
        question: 'What stone do you use to evolve Pikachu?', 
        a: 'Fire stone',
        b: 'Water stone',
        c: 'Leaf stone',
        d: 'Thunder stone',
        correct: 'd',
    },
    {
        question: 'What year was Pokemon the series released?', 
        a: '1997',
        b: '1999',
        c: '2002',
        d: '2006',
        correct: 'a',
    },

];

playGame();

function playGame() {
    
    const currentQuizData = pokeQuiz[currentQuestion];
    unChosen(); 
    

    questionEl.innerText = currentQuizData.question;
    TextA.innerText = currentQuizData.a;
    TextB.innerText = currentQuizData.b;
    TextC.innerText = currentQuizData.c;
    TextD.innerText = currentQuizData.d;
}


function getSelected() {
    let selected = undefined;

    answerEls.forEach((choice) => {
        if(choice.checked) {
            selected = choice.id;
        }
    });

    return selected; 
}

function unChosen() {
    answerEls.forEach((chosen) => {
        chosen.checked = false;
    });
}

// Controls the display
function text() {
    var x = document.querySelector(".styleSquare");
    var xEl = getComputedStyle(x)
    if (xEl.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none"
    }
   document.getElementById("hope").style.display = "none";
}

subBtn.addEventListener('click', () => {
    const answer = getSelected();
    if (answer) {
        currentQuestion++;
        if (answer === pokeQuiz[currentQuestion]) {
            score++;
        }

        if (currentQuestion < pokeQuiz.length) {
            playGame();
        } else {
            alert('Hello');
        }
    }
});  

    

