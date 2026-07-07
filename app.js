(function () {
  "use strict";

  // Набор вариативных шрифтов (Google Fonts). У каждого — свои оси.
  // sel — две оси по умолчанию под управлением мыши: [ось X, ось Y].
  var FONTS = [
    {
      id: "roboto-flex",
      name: "Roboto Flex",
      family: '"Roboto Flex"',
      href: "https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,slnt,wght,wdth,GRAD,XOPQ,XTRA,YOPQ,YTAS,YTDE,YTFI,YTLC,YTUC@8..144,-10..0,100..1000,25..151,-200..150,27..175,323..603,25..135,649..854,-305..-98,560..788,416..570,528..760&display=swap",
      sel: ["wght", "wdth"],
      axes: [
        { tag: "wght", name: "Толщина", min: 100, max: 1000, def: 400 },
        { tag: "wdth", name: "Ширина", min: 25, max: 151, def: 100 },
        { tag: "opsz", name: "Оптический кегль", min: 8, max: 144, def: 14 },
        { tag: "slnt", name: "Наклон", min: -10, max: 0, def: 0 },
        { tag: "GRAD", name: "Насыщенность", min: -200, max: 150, def: 0 },
        { tag: "XOPQ", name: "Толстые штрихи", min: 27, max: 175, def: 96 },
        { tag: "XTRA", name: "Ширина просветов", min: 323, max: 603, def: 468 },
        { tag: "YOPQ", name: "Тонкие штрихи", min: 25, max: 135, def: 79 },
        { tag: "YTLC", name: "Высота строчных", min: 416, max: 570, def: 514 },
        { tag: "YTUC", name: "Высота прописных", min: 528, max: 760, def: 712 },
        { tag: "YTAS", name: "Высота выносных вверх", min: 649, max: 854, def: 750 },
        { tag: "YTDE", name: "Глубина выносных вниз", min: -305, max: -98, def: -203 },
        { tag: "YTFI", name: "Высота цифр", min: 560, max: 788, def: 738 }
      ]
    },
    {
      id: "recursive",
      name: "Recursive",
      family: '"Recursive"',
      href: "https://fonts.googleapis.com/css2?family=Recursive:slnt,wght,CASL,CRSV,MONO@-15..0,300..1000,0..1,0..1,0..1&display=swap",
      sel: ["wght", "CASL"],
      axes: [
        { tag: "wght", name: "Толщина", min: 300, max: 1000, def: 400 },
        { tag: "CASL", name: "Рукописность", min: 0, max: 1, def: 0 },
        { tag: "slnt", name: "Наклон", min: -15, max: 0, def: 0 },
        { tag: "CRSV", name: "Курсивность", min: 0, max: 1, def: 0.5 },
        { tag: "MONO", name: "Моноширинность", min: 0, max: 1, def: 0 }
      ]
    },
    {
      id: "fraunces",
      name: "Fraunces",
      family: '"Fraunces"',
      href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,100..900,0..100,0..1&display=swap",
      sel: ["wght", "opsz"],
      axes: [
        { tag: "wght", name: "Толщина", min: 100, max: 900, def: 400 },
        { tag: "opsz", name: "Оптический кегль", min: 9, max: 144, def: 14 },
        { tag: "SOFT", name: "Мягкость", min: 0, max: 100, def: 0 },
        { tag: "WONK", name: "Причудливость", min: 0, max: 1, def: 0 }
      ]
    },
    {
      id: "bricolage",
      name: "Bricolage Grotesque",
      family: '"Bricolage Grotesque"',
      href: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght,wdth@12..96,200..800,75..100&display=swap",
      sel: ["wght", "wdth"],
      axes: [
        { tag: "wght", name: "Толщина", min: 200, max: 800, def: 400 },
        { tag: "wdth", name: "Ширина", min: 75, max: 100, def: 100 },
        { tag: "opsz", name: "Оптический кегль", min: 12, max: 96, def: 14 }
      ]
    },
    {
      id: "inter",
      name: "Inter",
      family: '"Inter"',
      href: "https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&display=swap",
      sel: ["wght", "opsz"],
      axes: [
        { tag: "wght", name: "Толщина", min: 100, max: 900, def: 400 },
        { tag: "opsz", name: "Оптический кегль", min: 14, max: 32, def: 14 }
      ]
    }
  ];

  var REGISTERED = { wght: 1, wdth: 1, opsz: 1, slnt: 1, ital: 1 };

  // Понятные названия для известных осей (иначе показываем тег).
  var AXIS_NAMES = {
    wght: "Толщина", wdth: "Ширина", opsz: "Оптический кегль",
    slnt: "Наклон", ital: "Курсив", GRAD: "Насыщенность",
    XOPQ: "Толстые штрихи", XTRA: "Ширина просветов", YOPQ: "Тонкие штрихи",
    YTLC: "Высота строчных", YTUC: "Высота прописных", YTAS: "Выносные вверх",
    YTDE: "Выносные вниз", YTFI: "Высота цифр", CASL: "Рукописность",
    CRSV: "Курсивность", MONO: "Моноширинность", SOFT: "Мягкость",
    WONK: "Причудливость"
  };

  // Читает оси вариативного шрифта из таблицы fvar (несжатый sfnt: ttf/otf).
  function readAxesFromFont(buffer) {
    var dv = new DataView(buffer);
    var sfnt = dv.getUint32(0);
    // 0x00010000 TrueType, 'OTTO', 'true'. woff/woff2/ttcf не поддерживаем.
    if (sfnt !== 0x00010000 && sfnt !== 0x4F54544F && sfnt !== 0x74727565) {
      if (sfnt === 0x774F4632 || sfnt === 0x774F4646) {
        throw new Error("woff");
      }
      throw new Error("format");
    }
    var numTables = dv.getUint16(4);
    var fvarOff = 0;
    for (var i = 0; i < numTables; i++) {
      var rec = 12 + i * 16;
      var tag = String.fromCharCode(
        dv.getUint8(rec), dv.getUint8(rec + 1),
        dv.getUint8(rec + 2), dv.getUint8(rec + 3)
      );
      if (tag === "fvar") { fvarOff = dv.getUint32(rec + 8); break; }
    }
    if (!fvarOff) throw new Error("static");

    var axesArrayOffset = fvarOff + dv.getUint16(fvarOff + 4);
    var axisCount = dv.getUint16(fvarOff + 8);
    var axisSize = dv.getUint16(fvarOff + 10);
    var axes = [];
    for (var j = 0; j < axisCount; j++) {
      var o = axesArrayOffset + j * axisSize;
      var atag = String.fromCharCode(
        dv.getUint8(o), dv.getUint8(o + 1),
        dv.getUint8(o + 2), dv.getUint8(o + 3)
      );
      var min = dv.getInt32(o + 4) / 65536;
      var def = dv.getInt32(o + 8) / 65536;
      var max = dv.getInt32(o + 12) / 65536;
      axes.push({
        tag: atag,
        name: AXIS_NAMES[atag] || atag,
        min: Math.round(min * 100) / 100,
        max: Math.round(max * 100) / 100,
        def: Math.round(def * 100) / 100
      });
    }
    if (!axes.length) throw new Error("static");
    return axes;
  }

  var customSeq = 0;

  var specimen = document.getElementById("specimen");
  var cssLine = document.getElementById("css");
  var sizeIn = document.getElementById("size");
  var sizeOut = document.getElementById("size-out");
  var fontSel = document.getElementById("font");
  var regBox = document.getElementById("axes-reg");
  var parBox = document.getElementById("axes-par");
  var stage = document.getElementById("stage");
  var xLabel = document.querySelector(".axislabel--x");
  var yLabel = document.querySelector(".axislabel--y");
  var fontTitle = document.getElementById("fonttitle");

  var current = FONTS[0]; // текущий шрифт
  var map = {};           // tag -> ось текущего шрифта
  var state = {};         // tag -> значение
  var selected = [];      // ровно две активные оси: [X, Y]

  function defaultSize() {
    return window.matchMedia && window.matchMedia("(max-width:520px)").matches ? 26 : 40;
  }

  function axisStep(a) {
    if (a.step != null) return a.step;
    return (a.max - a.min) <= 3 ? 0.01 : 1;
  }
  function fmt(a, v) {
    return a._step < 1 ? String(Math.round(v * 100) / 100) : String(Math.round(v));
  }
  function clampSnap(a, v) {
    v = Math.min(a.max, Math.max(a.min, v));
    v = Math.round(v / a._step) * a._step;
    return Math.round(v * 1000) / 1000;
  }

  function buildAxis(a, parent) {
    a._step = axisStep(a);

    var wrap = document.createElement("div");
    wrap.className = "axis";

    var head = document.createElement("div");
    head.className = "axishead";

    var check = document.createElement("input");
    check.type = "checkbox";
    check.className = "axischeck";
    check.setAttribute("aria-label", "Управлять осью «" + a.name + "» мышью");
    check.addEventListener("change", function () {
      onCheck(a.tag, check.checked);
    });
    a._check = check;

    var lab = document.createElement("div");
    lab.className = "lab";
    lab.innerHTML =
      '<span class="name">' + a.name + "</span>" +
      '<span class="tag">' + a.tag + "</span>";

    var val = document.createElement("output");
    val.className = "val";
    val.textContent = fmt(a, a.def);

    head.appendChild(check);
    head.appendChild(lab);
    head.appendChild(val);

    var slider = document.createElement("input");
    slider.type = "range";
    slider.min = a.min;
    slider.max = a.max;
    slider.step = a._step;
    slider.value = a.def;
    slider.setAttribute("aria-label", a.name + " (" + a.tag + ")");

    slider.addEventListener("input", function () {
      var v = clampSnap(a, +slider.value);
      state[a.tag] = v;
      val.textContent = fmt(a, v);
      apply();
    });

    a._slider = slider;
    a._val = val;

    wrap.appendChild(head);
    wrap.appendChild(slider);
    parent.appendChild(wrap);
  }

  function renderAxes() {
    regBox.innerHTML = "";
    parBox.innerHTML = "";
    map = {};
    current.axes.forEach(function (a) {
      map[a.tag] = a;
      buildAxis(a, REGISTERED[a.tag] ? regBox : parBox);
    });
  }

  function fvs() {
    return current.axes.map(function (a) {
      return '"' + a.tag + '" ' + state[a.tag];
    }).join(", ");
  }

  function apply() {
    var s = fvs();
    specimen.style.fontVariationSettings = s;
    cssLine.innerHTML = "<b>font-variation-settings:</b> " + s + ";";
  }

  function setAxis(tag, value) {
    var a = map[tag];
    var v = clampSnap(a, value);
    state[tag] = v;
    a._slider.value = v;
    a._val.textContent = fmt(a, v);
  }

  function updateSelection() {
    current.axes.forEach(function (a) {
      a._check.checked = selected.indexOf(a.tag) !== -1;
    });
    xLabel.textContent = map[selected[0]].name + " →";
    yLabel.textContent = map[selected[1]].name + " ↓";
  }

  // Ровно две активные галочки: при выборе новой снимается самая старая;
  // снять галочку вручную нельзя (иначе осталась бы одна ось).
  function onCheck(tag, checked) {
    if (checked && selected.indexOf(tag) === -1) {
      selected.push(tag);
      if (selected.length > 2) selected.shift();
    }
    updateSelection();
  }

  function loadFontCss(font) {
    if (font._linked) return;
    var l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = font.href;
    document.head.appendChild(l);
    font._linked = true;
  }

  function selectFont(font, resetSize) {
    current = font;
    loadFontCss(font);
    fontTitle.textContent = font.name;
    specimen.style.fontFamily = font.family + ',"IBM Plex Mono",sans-serif';
    font.axes.forEach(function (a) { state[a.tag] = a.def; });
    selected = font.sel.slice();
    renderAxes();
    updateSelection();
    if (resetSize) {
      var ds = defaultSize();
      sizeIn.value = ds;
      sizeOut.textContent = String(ds);
      specimen.style.fontSize = ds + "px";
    }
    apply();
  }

  // Заполняем селектор шрифтов
  FONTS.forEach(function (f) {
    var opt = document.createElement("option");
    opt.value = f.id;
    opt.textContent = f.name;
    fontSel.appendChild(opt);
  });
  fontSel.addEventListener("change", function () {
    var f = FONTS.filter(function (x) { return x.id === fontSel.value; })[0];
    if (f) selectFont(f, false);
  });

  // Загрузка своего вариативного шрифта (.ttf/.otf)
  var addBtn = document.getElementById("addfont");
  var fileIn = document.getElementById("fontfile");

  function flashBtn(msg) {
    var old = addBtn.textContent;
    addBtn.textContent = msg;
    setTimeout(function () { addBtn.textContent = old; }, 2200);
  }

  addBtn.addEventListener("click", function () { fileIn.click(); });

  fileIn.addEventListener("change", function () {
    var file = fileIn.files && fileIn.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function () {
      var buf = reader.result;
      var axes;
      try {
        axes = readAxesFromFont(buf);
      } catch (err) {
        var m = err && err.message;
        if (m === "woff") flashBtn("Нужен .ttf или .otf");
        else if (m === "static") flashBtn("Шрифт без осей");
        else flashBtn("Не удалось прочитать");
        fileIn.value = "";
        return;
      }
      customSeq++;
      var family = "CustomVF" + customSeq;
      var display = file.name.replace(/\.(ttf|otf)$/i, "");
      var ff = new FontFace(family, buf);
      ff.load().then(function (loaded) {
        document.fonts.add(loaded);
        var sel = axes.length >= 2
          ? [axes[0].tag, axes[1].tag]
          : [axes[0].tag, axes[0].tag];
        var font = {
          id: "custom-" + customSeq,
          name: display + " (свой)",
          family: '"' + family + '"',
          href: null,
          _linked: true,
          sel: sel,
          axes: axes
        };
        FONTS.push(font);
        var opt = document.createElement("option");
        opt.value = font.id;
        opt.textContent = font.name;
        fontSel.appendChild(opt);
        fontSel.value = font.id;
        selectFont(font, false);
      }, function () {
        flashBtn("Не удалось загрузить");
      });
      fileIn.value = "";
    };
    reader.readAsArrayBuffer(file);
  });

  // Кегль
  sizeIn.addEventListener("input", function () {
    var v = Math.round(+sizeIn.value);
    sizeOut.textContent = v;
    specimen.style.fontSize = v + "px";
  });

  // Сброс: дефолты текущего шрифта + кегль
  document.getElementById("reset").addEventListener("click", function () {
    current.axes.forEach(function (a) {
      state[a.tag] = a.def;
      a._slider.value = a.def;
      a._val.textContent = fmt(a, a.def);
    });
    selected = current.sel.slice();
    updateSelection();
    var ds = defaultSize();
    sizeIn.value = ds;
    sizeOut.textContent = String(ds);
    specimen.style.fontSize = ds + "px";
    apply();
  });

  // Случайные значения осей текущего шрифта
  document.getElementById("random").addEventListener("click", function () {
    current.axes.forEach(function (a) {
      var v = clampSnap(a, a.min + Math.random() * (a.max - a.min));
      state[a.tag] = v;
      a._slider.value = v;
      a._val.textContent = fmt(a, v);
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

  // Тема
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

  // Квадрат: выбранные две оси управляются мышью.
  // selected[0] → ось X (горизонталь), selected[1] → ось Y (вертикаль).
  stage.addEventListener("mousemove", function (e) {
    var r = stage.getBoundingClientRect();
    var x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    var y = Math.min(1, Math.max(0, (e.clientY - r.top) / r.height));
    var xa = map[selected[0]];
    var ya = map[selected[1]];
    setAxis(selected[0], xa.min + x * (xa.max - xa.min));
    setAxis(selected[1], ya.min + y * (ya.max - ya.min));
    apply();
  });

  // Старт
  fontSel.value = current.id;
  selectFont(current, true);
})();
