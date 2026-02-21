(function () {
  const letterSelect = document.getElementById("letterSelect");
  const levelSelect = document.getElementById("levelSelect");
  const renderBtn = document.getElementById("renderBtn");
  const randomBtn = document.getElementById("randomBtn");

  const resultTitle = document.getElementById("resultTitle");
  const resultMeta = document.getElementById("resultMeta");
  const questionsWrap = document.getElementById("questionsWrap");

  const levelName = {
    easy: "🟢 سهل",
    medium: "🟡 متوسط",
    hard: "🔴 صعب",
  };

  // Fill letters
  (window.AR_LETTERS || Object.keys(window.QBANK)).forEach((l) => {
    const opt = document.createElement("option");
    opt.value = l;
    opt.textContent = l;
    letterSelect.appendChild(opt);
  });

  function createQCard(item, idx) {
    const card = document.createElement("div");
    card.className = "q";

    const top = document.createElement("div");
    top.className = "q-top";

    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = item.type;

    const btn = document.createElement("button");
    btn.className = "btn";
    btn.type = "button";
    btn.textContent = "إظهار الإجابة";

    const qText = document.createElement("p");
    qText.className = "q-text";
    qText.textContent = `${idx + 1}. ${item.q}`;

    const ans = document.createElement("div");
    ans.className = "answer";
    ans.innerHTML = `<strong>الإجابة:</strong> ${item.a}`;

    btn.addEventListener("click", () => {
      const isOpen = ans.style.display === "block";
      ans.style.display = isOpen ? "none" : "block";
      btn.textContent = isOpen ? "إظهار الإجابة" : "إخفاء الإجابة";
    });

    top.appendChild(tag);
    top.appendChild(btn);

    card.appendChild(top);
    card.appendChild(qText);
    card.appendChild(ans);

    return card;
  }

  function render(letter, level) {
    const data = window.QBANK?.[letter]?.[level] || [];

    resultTitle.textContent = `حرف ${letter}`;
    resultMeta.textContent = `${levelName[level]} • عدد الأسئلة: ${data.length || 0}`;

    questionsWrap.innerHTML = "";

    if (!data.length) {
      const empty = document.createElement("div");
      empty.className = "q";
      empty.innerHTML =
        `<p class="q-text">ما فيه أسئلة لهذا الحرف/المستوى حالياً. كمّل البيانات في <code>questions.js</code>.</p>`;
      questionsWrap.appendChild(empty);
      return;
    }

    data.slice(0, 3).forEach((item, idx) => {
      questionsWrap.appendChild(createQCard(item, idx));
    });
  }

  function pickRandom() {
    const letters = window.AR_LETTERS || Object.keys(window.QBANK);
    const availableLetters = letters.filter((l) => window.QBANK?.[l]);
    const letter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
    const levels = ["easy","medium","hard"];
    const level = levels[Math.floor(Math.random() * levels.length)];

    const arr = window.QBANK?.[letter]?.[level] || [];
    if (!arr.length) return render(letter, level);

    const item = arr[Math.floor(Math.random() * arr.length)];

    resultTitle.textContent = `🎲 سؤال عشوائي — حرف ${letter}`;
    resultMeta.textContent = `${levelName[level]}`;

    questionsWrap.innerHTML = "";
    questionsWrap.appendChild(createQCard(item, 0));
  }

  renderBtn.addEventListener("click", () => {
    render(letterSelect.value, levelSelect.value);
  });

  randomBtn.addEventListener("click", pickRandom);

  // default view
  letterSelect.value = "ا";
  levelSelect.value = "easy";
  render("ا", "easy");
})();
