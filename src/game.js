const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const next = document.getElementById("next");

//CONSTANTS
const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

let currentQuestion = {};
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let questions = [];

scoreText.innerText = 0;
const generateQuestions = async () => {

    let triviaResponse = await fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple");
    let loadedQuestions = await triviaResponse.json();

    questions = await loadedQuestions.results.map((loadedQuestion) => {
        const formattedQuestion = {
            question: loadedQuestion.question,
        };

        const answerChoices = [...loadedQuestion.incorrect_answers];
        formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
        //Insert the correct answer at random index generated
        answerChoices.splice(
            formattedQuestion.answer - 1,
            0,
            loadedQuestion.correct_answer
        );

        answerChoices.forEach((choice, index) => {
            formattedQuestion['choice' + (index + 1)] = choice;
        });
        return formattedQuestion;
    });
    startGame();
}

generateQuestions();

choices.forEach((choice) => {

    choice.addEventListener('click', (e) => {

        if (document.querySelectorAll(".correct").length == 0) {


            const selectedChoice = e.target;
            const selectedAnswer = selectedChoice.dataset['number'];

            var i = currentQuestion.answer;
            var ans = document.querySelector(`[data-number="${i}"]`);


            const classToApply =
                selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

            if (classToApply === 'correct') {
                incrementScore(CORRECT_BONUS);
            }

            selectedChoice.parentElement.classList.add(classToApply);
            ans.parentElement.classList.add("correct");
        }
    });
});

incrementScore = (num) => {
    score += num;
    scoreText.innerText = score;
};
next.addEventListener('click', () => {
    try {
        document.querySelector('.correct').classList.remove("correct");
        document.querySelector('.incorrect').classList.remove("incorrect");

    } catch (error) {

    }

    getNewQuestion();
})


getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', score);
        // go to the end page
        window.location.assign('./end.html');
        return
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;

    // needs to animate after DOM loads...
    if (questionCounter > 1) {
        updateProgressBar()
    }

    const questionIndex = Math.floor(Math.random() * availableQuesions.length);
    currentQuestion = availableQuesions[questionIndex];

    question.innerHTML = currentQuestion.question;

    choices.forEach((choice) => {
        const number = choice.dataset['number'];
        choice.innerHTML = currentQuestion['choice' + number];
    });

    availableQuesions.splice(questionIndex, 1);


};
const startGame = () => {
    questionCounter = 0;
    score = 0;

    availableQuesions = [...questions];
    getNewQuestion();
};


updateProgressBar = () => {
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`
}

