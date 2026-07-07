(function () {
  "use strict";

  var REG = [
    { tag: "wght", name: "Толщина", min: 100, max: 1000, def: 400 },
    { tag: "wdth", name: "Ширина", min: 25, max: 151, def: 100 },
    { tag: "opsz", name: "Оптический кегль", min: 8, max: 144, def: 14 },
    { tag: "slnt", name: "Наклон", min: -10, max: 0, def: 0 }
  ];
  var PAR = [
    { tag: "GRAD", name: "Насыщенность", min: -200, max: 150, def: 0 },
    { tag: "XOPQ", name: "Толстые штрихи", min: 27, max: 175, def: 96 },
    { tag: "XTRA", name: "Ширина просветов", min: 323, max: 603, def: 468 },
    { tag: "YOPQ", name: "Тонкие штрихи", min: 25, max: 135, def: 79 },
    { tag: "YTLC", name: "Высота строчных", min: 416, max: 570, def: 514 },
    { tag: "YTUC", name: "Высота прописных", min: 528, max: 760, def: 712 },
    { tag: "YTAS", name: "Высота выносных вверх", min: 649, max: 854, def: 750 },
    { tag: "YTDE", name: "Глубина выносных вниз", min: -305, max: -98, def: -203 },
    { tag: "YTFI", name: "Высота цифр", min: 560, max: 788, def: 738 }
  ];
  var ALL = REG.concat(PAR);
  var state = {};
  ALL.forEach(function (a) { state[a.tag] = a.def; });

  var specimen = document.getElementById("specimen");
  var cssLine = document.getElementById("css");
  var sizeIn = document.getElementById("size");
  var sizeOut = document.getElementById("size-out");

  function buildAxis(a, parent) {
    var wrap = document.createElement("div");
    wrap.className = "axis";

    var head = document.createElement("div");
    head.className = "axishead";

    var lab = document.createElement("div");
    lab.className = "lab";
    lab.innerHTML =
      '<span class="name">' + a.name + "</span>" +
      '<span class="tag">' + a.tag + "</span>";

    var val = document.createElement("output");
    val.className = "val";
    val.textContent = a.def;

    head.appendChild(lab);
    head.appendChild(val);

    var slider = document.createElement("input");
    slider.type = "range";
    slider.min = a.min;
    slider.max = a.max;
    slider.step = 1;
    slider.value = a.def;
    slider.setAttribute("aria-label", a.name + " (" + a.tag + ")");

    slider.addEventListener("input", function () {
      state[a.tag] = Math.round(+slider.value);
      val.textContent = state[a.tag];
      apply();
    });

    a._slider = slider;
    a._val = val;

    wrap.appendChild(head);
    wrap.appendChild(slider);
    parent.appendChild(wrap);
  }

  var regBox = document.getElementById("axes-reg");
  var parBox = document.getElementById("axes-par");
  REG.forEach(function (a) { buildAxis(a, regBox); });
  PAR.forEach(function (a) { buildAxis(a, parBox); });

  function fvs() {
    return ALL.map(function (a) {
      return '"' + a.tag + '" ' + state[a.tag];
    }).join(", ");
  }

  function apply() {
    var s = fvs();
    specimen.style.fontVariationSettings = s;
    cssLine.innerHTML = "<b>font-variation-settings:</b> " + s + ";";
  }

  sizeIn.addEventListener("input", function () {
    var v = Math.round(+sizeIn.value);
    sizeOut.textContent = v;
    specimen.style.fontSize = v + "px";
  });

  document.getElementById("reset").addEventListener("click", function () {
    ALL.forEach(function (a) {
      state[a.tag] = a.def;
      a._slider.value = a.def;
      a._val.textContent = a.def;
    });
    sizeIn.value = 40;
    sizeOut.textContent = "40";
    specimen.style.fontSize = "40px";
    apply();
  });

  document.getElementById("random").addEventListener("click", function () {
    ALL.forEach(function (a) {
      var v = Math.round(a.min + Math.random() * (a.max - a.min));
      state[a.tag] = v;
      a._slider.value = v;
      a._val.textContent = v;
    });
    apply();
  });

  document.getElementById("copy").addEventListener("click", function () {
    var text = "font-variation-settings: " + fvs() + ";";
    var btn = document.getElementById("copy");
    var done = function () {
      var old = btn.textContent;
      btn.textContent = "Скопировано";
      setTimeout(function () { btn.textContent = old; }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, done);
    } else {
      done();
    }
  });

  var root = document.documentElement;
  var themeBtn = document.getElementById("theme");
  var themeLabel = themeBtn.querySelector("[data-theme-label]");

  function systemDark() {
    return window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  function currentDark() {
    var t = root.getAttribute("data-theme");
    if (t === "dark") return true;
    if (t === "light") return false;
    return systemDark();
  }
  function syncThemeLabel() {
    themeLabel.textContent = currentDark() ? "Светлая" : "Тёмная";
  }
  try {
    var saved = localStorage.getItem("vf-theme");
    if (saved === "dark" || saved === "light") root.setAttribute("data-theme", saved);
  } catch (e) {}
  themeBtn.addEventListener("click", function () {
    var next = currentDark() ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("vf-theme", next); } catch (e) {}
    syncThemeLabel();
  });
  syncThemeLabel();

  specimen.addEventListener("input", function () {
    if (!specimen.textContent.trim()) specimen.innerHTML = "";
  });

  // Квадратная область: мышь X → толщина (wght), Y → ширина (wdth).
  var byTag = {};
  ALL.forEach(function (a) { byTag[a.tag] = a; });

  function setAxis(tag, value) {
    var a = byTag[tag];
    var v = Math.round(Math.min(a.max, Math.max(a.min, value)));
    state[tag] = v;
    a._slider.value = v;
    a._val.textContent = v;
  }

  var stage = document.getElementById("stage");
  function track(e) {
    var r = stage.getBoundingClientRect();
    var x = (e.clientX - r.left) / r.width;   // 0..1 слева направо
    var y = (e.clientY - r.top) / r.height;   // 0..1 сверху вниз
    x = Math.min(1, Math.max(0, x));
    y = Math.min(1, Math.max(0, y));
    var wght = byTag.wght;
    var wdth = byTag.wdth;
    setAxis("wght", wght.min + x * (wght.max - wght.min));
    setAxis("wdth", wdth.min + y * (wdth.max - wdth.min));
    apply();
  }
  stage.addEventListener("mousemove", track);
  stage.addEventListener("mouseenter", function () { stage.classList.add("tracking"); });
  stage.addEventListener("mouseleave", function () { stage.classList.remove("tracking"); });

  specimen.style.fontSize = "40px";
  apply();
})();
