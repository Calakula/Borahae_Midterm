// Квиз: подсчёт очков, прогресс-бар, защита от повторных кликов
(function () {
  'use strict';
  var questions = [
    { q: 'In which year did BTS debut?', options: ['2011', '2013', '2015', '2017'], answer: 1 },
    { q: 'How many members are in BTS?', options: ['5', '6', '7', '9'], answer: 2 },
    { q: 'Who is the leader of the group?', options: ['RM', 'V', 'Jimin', 'SUGA'], answer: 0 },
    { q: 'What is the name of the BTS fandom?', options: ['Carat', 'ARMY', 'Blink', 'Once'], answer: 1 },
    { q: 'Who is the youngest member?', options: ['Jimin', 'j-hope', 'Jung Kook', 'V'], answer: 2 }
  ];
  var $ = function (id) { return document.getElementById(id); };
  var cur = 0, score = 0, selected = null;
  if (!$('quizBar')) return;

  function render() {
    var q = questions[cur];
    $('quizBar').style.width = (cur / questions.length * 100) + '%';
    $('quizCounter').textContent = 'Question ' + (cur + 1) + ' of ' + questions.length;
    $('quizQuestion').textContent = q.q;
    var box = $('quizOptions'); box.innerHTML = '';
    q.options.forEach(function (o, i) {
      var b = document.createElement('button'); b.type = 'button';
      var s = document.createElement('span'); s.textContent = String.fromCharCode(65 + i);
      b.appendChild(s); b.appendChild(document.createTextNode(o));
      b.addEventListener('click', function () { choose(i); });
      box.appendChild(b);
    });
    $('quizStatus').textContent = 'Choose one answer';
    $('quizNext').disabled = true;
    $('quizNextLabel').textContent = cur === questions.length - 1 ? 'See result' : 'Next';
  }
  function choose(i) {
    if (selected !== null) return; // защита от клик-спама
    selected = i; var right = questions[cur].answer;
    if (i === right) score++;
    Array.prototype.forEach.call($('quizOptions').children, function (b, k) {
      b.disabled = true;
      b.className = k === right ? 'correct' : k === i ? 'wrong' : 'muted';
    });
    $('quizStatus').textContent = i === right ? 'Correct!' : 'Not this time.';
    $('quizNext').disabled = false;
  }
  $('quizNext').addEventListener('click', function () {
    if (selected === null) return;
    selected = null;
    if (cur === questions.length - 1) finish(); else { cur++; render(); }
  });
  function finish() {
    $('quizBar').style.width = '100%';
    $('quizPlay').hidden = true; $('quizResult').hidden = false;
    $('quizScore').textContent = score + ' / ' + questions.length;
    $('quizMsg').textContent = score === 5 ? 'Perfect! True ARMY.' : score >= 3 ? 'Great job, almost perfect!' : 'Keep listening — you will get there!';
  }
  $('quizRestart').addEventListener('click', function () {
    cur = 0; score = 0; selected = null; $('quizResult').hidden = true; $('quizPlay').hidden = false; render();
  });
  render();
})();
