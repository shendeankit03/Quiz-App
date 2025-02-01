let currentQuestion = 0;
let score = 0;
let correctAnswers = 0;
let questions = [];
let selectedAnswer = false;

async function fetchQuestions() {
    try {
        const response = await fetch('https://opentdb.com/api.php?amount=5&type=multiple');
        const data = await response.json();
        if (data.response_code !== 0) throw new Error('Failed to fetch questions');
        return data.results;
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load questions. Please try again later.');
        return [];
    }
}

function decodeHTMLEntities(text) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = text;
    return textArea.value;
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function displayQuestion() {
    selectedAnswer = false;
    const question = questions[currentQuestion];
    document.getElementById('question').textContent = decodeHTMLEntities(question.question);
    document.getElementById('score').textContent = score;
    document.getElementById('current-question').textContent = currentQuestion + 1;
    document.getElementById('total-questions').textContent = questions.length;
    document.getElementById('question-number').textContent = currentQuestion + 1;

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    const allAnswers = [...question.incorrect_answers, question.correct_answer];
    allAnswers.sort(() => Math.random() - 0.5);

    allAnswers.forEach(answer => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.innerHTML = decodeHTMLEntities(answer);
        button.onclick = () => handleAnswer(button, answer === question.correct_answer);
        optionsContainer.appendChild(button);
    });

    // Update progress bar
    const progress = (currentQuestion / questions.length) * 100;
    document.getElementById('progress').style.width = `${progress}%`;
    document.getElementById('next-btn').style.display = 'none';
}

function handleAnswer(button, isCorrect) {
    if (selectedAnswer) return;
    selectedAnswer = true;

    if (isCorrect) {
        score += 100;
        correctAnswers++;
        button.classList.add('correct');
    } else {
        button.classList.add('wrong');
        // Show correct answer
        document.querySelectorAll('.option-btn').forEach(btn => {
            if (btn.innerHTML === decodeHTMLEntities(questions[currentQuestion].correct_answer)) {
                btn.classList.add('correct');
            }
        });
    }

    document.getElementById('score').textContent = score;
    document.getElementById('next-btn').style.display = 'block';
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < questions.length) {
        displayQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    showScreen('results-screen');
    document.getElementById('final-score').textContent = score;
    document.getElementById('correct-answers').textContent = correctAnswers;
    document.getElementById('total-questions-final').textContent = questions.length;
}

async function startQuiz() {
    questions = await fetchQuestions();
    if (questions.length === 0) return;

    showScreen('quiz-screen');
    displayQuestion();
}