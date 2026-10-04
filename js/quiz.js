// Quiz page (Neda): 5 questions, instant feedback, final score
const questions = [
  { q: 'In which year did BTS debut?', options: ['2011', '2013', '2015', '2017'], answer: 1 },
  { q: 'How many members are in BTS?', options: ['5', '6', '7', '9'], answer: 2 },
  { q: 'Who is the leader of the group?', options: ['RM', 'V', 'Jimin', 'SUGA'], answer: 0 },
  { q: 'What is the name of the BTS fandom?', options: ['Carat', 'ARMY', 'Blink', 'Once'], answer: 1 },
  { q: 'Who is the youngest member?', options: ['Jimin', 'j-hope', 'Jung Kook', 'V'], answer: 2 }
];

let current = 0;
let score = 0;
let answered = false;

const questionEl = document.getElementById('question');
const optionsEl = document.getElementById('options');
const counterEl = document.getElementById('counter');
const feedbackEl = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const barEl = document.getElementById('progress-bar');
const wrapEl = document.getElementById('progress-wrap');

function showQuestion() {
  const item = questions[current];
  answered = false;
  nextBtn.disabled = true;
  nextBtn.textContent = current === questions.length - 1 ? 'See result' : 'Next';
  feedbackEl.textContent = '';
  counterEl.textContent = 'Question ' + (current + 1) + ' of ' + questions.length;
  questionEl.textContent = item.q;
  optionsEl.innerHTML = '';

  item.options.forEach(function (text, index) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option-btn';
    btn.textContent = text;
    btn.addEventListener('click', function () { choose(index); });
    optionsEl.appendChild(btn);
  });

  const percent = (current / questions.length) * 100;
  barEl.style.width = percent + '%';
  wrapEl.setAttribute('aria-valuenow', Math.round(percent));
}

function choose(index) {
  if (answered) return;
  answered = true;
  const correct = questions[current].answer;
  const buttons = optionsEl.querySelectorAll('.option-btn');

  buttons.forEach(function (b, i) {
    b.disabled = true;
    if (i === correct) b.classList.add('correct');
    if (i === index && i !== correct) b.classList.add('wrong');
  });

  if (index === correct) {
    score++;
    feedbackEl.textContent = 'Correct!';
  } else {
    feedbackEl.textContent = 'Not this time.';
  }
  nextBtn.disabled = false;
}

function showResult() {
  barEl.style.width = '100%';
  wrapEl.setAttribute('aria-valuenow', 100);
  counterEl.textContent = 'Finished';
  feedbackEl.textContent = '';
  let message = 'Keep listening — you will get there!';
  if (score === questions.length) message = 'Perfect! True ARMY.';
  else if (score >= 3) message = 'Great job, almost a perfect score!';

  questionEl.textContent = 'You scored ' + score + ' / ' + questions.length;
  optionsEl.innerHTML = '<p class="lead gradient-text">' + message + '</p>';
  nextBtn.textContent = 'Play again';
  nextBtn.disabled = false;
  nextBtn.dataset.restart = 'true';
}

nextBtn.addEventListener('click', function () {
  if (nextBtn.dataset.restart === 'true') {
    nextBtn.dataset.restart = '';
    current = 0;
    score = 0;
    showQuestion();
    return;
  }
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
});

showQuestion();
