import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js';
import { getDatabase, ref, onValue, get, set } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js';
import { firebaseConfig, SCHEDULE_PATH } from './firebase-config.js';

(function () {
  'use strict';
  // build check: af152d1 follow-up

  // Seed data written to the database ONCE, and only if an explicit get()
  // check proves the node is genuinely empty AND has no /schedule/_seeded
  // flag (see seedIfEmpty). It is never used as live state and never written
  // on a normal load. Schema: { categories, events, nameColors }.
  var DEFAULT_STATE = {
    "categories": [
      { "id": "cat-class", "name": "Занятие", "color": "#4f6bff", "isClass": true },
      { "id": "cat-other", "name": "Дело", "color": "#ffab40", "isClass": false }
    ],
    "events": [
      { "id": "e8f19d7a-388a-4051-83b4-ab7061e81ee9", "title": "Артём", "day": 0, "start": 480, "end": 540, "categoryId": "cat-class", "notes": "" },
      { "id": "a2acbd14-695b-437e-929d-62b1516751eb", "title": "Спортзал", "day": 0, "start": 600, "end": 645, "categoryId": "cat-other", "notes": "" },
      { "id": "ef6ad89a-34fd-4179-ae44-9d5e4fea150a", "title": "Кирилл", "day": 0, "start": 690, "end": 735, "categoryId": "cat-class", "notes": "" },
      { "id": "c901682b-d8e5-4137-9466-fecd80a16b72", "title": "Марк ВК", "day": 0, "start": 795, "end": 855, "categoryId": "cat-class", "notes": "" },
      { "id": "1f8cb488-83d0-400d-b90e-d5e036f40335", "title": "Данил 1500", "day": 0, "start": 855, "end": 915, "categoryId": "cat-class", "notes": "" },
      { "id": "df607dc0-b699-4142-956c-a8f9083d79c2", "title": "Данил 1500", "day": 1, "start": 480, "end": 540, "categoryId": "cat-class", "notes": "" },
      { "id": "3bddb8e3-b658-4952-84ff-99918cfd4ecf", "title": "Кирилл", "day": 1, "start": 555, "end": 615, "categoryId": "cat-class", "notes": "" },
      { "id": "0c8e7198-f3bb-4558-9805-f5784c70be29", "title": "Кирилл", "day": 1, "start": 645, "end": 735, "categoryId": "cat-class", "notes": "" },
      { "id": "22551fcb-bcdf-4415-af96-851c40a668ae", "title": "Артём", "day": 1, "start": 750, "end": 825, "categoryId": "cat-class", "notes": "" },
      { "id": "00da1407-b66d-4e63-9b72-db2587109cae", "title": "Глеб 2500", "day": 1, "start": 855, "end": 930, "categoryId": "cat-class", "notes": "" },
      { "id": "07f6df51-ac82-483c-b2b3-bd54a05c90cb", "title": "Артём", "day": 2, "start": 570, "end": 630, "categoryId": "cat-class", "notes": "" },
      { "id": "f3f4205e-587d-4854-9e2a-b7659860d199", "title": "Уборка", "day": 2, "start": 675, "end": 735, "categoryId": "cat-other", "notes": "" },
      { "id": "9a00c00e-027f-4cea-a927-7735cb82b97d", "title": "Кирилл", "day": 2, "start": 780, "end": 840, "categoryId": "cat-class", "notes": "" },
      { "id": "80202850-7431-4719-a073-31c7d11b11d7", "title": "Егор Ким", "day": 2, "start": 855, "end": 900, "categoryId": "cat-class", "notes": "" },
      { "id": "7b350611-f12d-4b98-8524-eae7f5f5b6dd", "title": "Артём", "day": 2, "start": 960, "end": 1050, "categoryId": "cat-class", "notes": "" },
      { "id": "41e89b4a-d4e2-4e66-9734-8c47a41c9529", "title": "Ника физика", "day": 3, "start": 525, "end": 570, "categoryId": "cat-class", "notes": "" },
      { "id": "b2302263-d580-4de3-a753-b3e791c38e16", "title": "Данил 1500", "day": 3, "start": 600, "end": 660, "categoryId": "cat-class", "notes": "" },
      { "id": "0f1d5b8d-0886-4f3c-a676-d5ff3588b5f6", "title": "Максим", "day": 4, "start": 510, "end": 555, "categoryId": "cat-class", "notes": "" },
      { "id": "fcfb0eac-d42a-4b7d-8816-7556dc9890a8", "title": "Марк ВК", "day": 4, "start": 585, "end": 630, "categoryId": "cat-class", "notes": "" },
      { "id": "9856364d-7df7-420a-b5cd-f6ce9a1bc91e", "title": "Полина 1800", "day": 4, "start": 660, "end": 750, "categoryId": "cat-class", "notes": "" },
      { "id": "b284bc53-d2a8-40c5-a4a3-16603a3a9477", "title": "Вика", "day": 4, "start": 750, "end": 810, "categoryId": "cat-class", "notes": "" },
      { "id": "8e0fb898-fb56-4794-8dea-021e1d35c951", "title": "Созвон с родителями", "day": 5, "start": 570, "end": 630, "categoryId": "cat-other", "notes": "" },
      { "id": "560dde20-fb06-429b-96dc-e0afa9325c99", "title": "Бассейн", "day": 5, "start": 645, "end": 720, "categoryId": "cat-other", "notes": "" },
      { "id": "b7416fd1-d9a7-491d-b8e2-d3b45110baaf", "title": "София 2000", "day": 5, "start": 765, "end": 840, "categoryId": "cat-class", "notes": "" },
      { "id": "3d8bcb50-5e43-4188-a3d6-8ebc4632100d", "title": "Спортзал", "day": 6, "start": 525, "end": 600, "categoryId": "cat-other", "notes": "" },
      { "id": "59c4d97f-7eaa-4516-a3b0-5e1659a848c0", "title": "Ника физика", "day": 6, "start": 630, "end": 675, "categoryId": "cat-class", "notes": "" },
      { "id": "50412733-6979-432f-b391-b9bb5bab3859", "title": "Глеб 2500", "day": 6, "start": 720, "end": 780, "categoryId": "cat-class", "notes": "" },
      { "id": "74b75558-ab88-4823-adac-3a23f1304517", "title": "Кирилл", "day": 6, "start": 825, "end": 915, "categoryId": "cat-class", "notes": "" }
    ],
    "nameColors": {
      "Артём": "#4f6bff",
      "Спортзал": "#e5484d",
      "Кирилл": "#30a46c",
      "Марк ВК": "#8e4ec6",
      "Данил 1500": "#0891b2",
      "Глеб 2500": "#e93d82",
      "Уборка": "#65a30d",
      "Егор Ким": "#d97706",
      "Ника физика": "#6366f1",
      "Максим": "#0d9488",
      "Полина 1800": "#c026d3",
      "Вика": "#a16207",
      "Созвон с родителями": "#475569",
      "Бассейн": "#7c3aed",
      "София 2000": "#0284c7"
    }
  };

  var DAY_START = 6 * 60, DAY_END = 24 * 60;
  var GAP_ROW_HEIGHT = 8, PX_PER_MIN = 1.1, MIN_CONTENT_HEIGHT = 30;
  var SNAP = 15, MIN_DURATION = 15;
  var DAY_NAMES = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
  var DAY_SHORT_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  var MOBILE_BREAKPOINT = '(max-width: 700px)';
  function isMobileViewport() { return !!(window.matchMedia && window.matchMedia(MOBILE_BREAKPOINT).matches); }
  function todayDayIndex() { return (new Date().getDay() + 6) % 7; }
  var mobileActiveDay = todayDayIndex();

  var NAME_PALETTE = [
    '#4f6bff', '#e5484d', '#30a46c', '#8e4ec6', '#0891b2', '#e93d82',
    '#65a30d', '#d97706', '#6366f1', '#0d9488', '#c026d3', '#a16207',
    '#475569', '#7c3aed', '#0284c7', '#be123c', '#4d7c0f', '#b45309',
    '#4338ca', '#ffab40'
  ];

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  var gridEl = document.getElementById('schedule-grid');
  // Live state starts EMPTY (only the base categories, so the <select>s work).
  // Nothing is shown or written until the first onValue() snapshot arrives —
  // this is what prevents DEFAULT_STATE from ever overwriting real data.
  var state = { categories: clone(DEFAULT_STATE.categories), events: [], nameColors: {} };
  var editingId = null;
  // Starts read-only: editing unlocks only once Firebase Auth reports a
  // signed-in user (see onAuthStateChanged in connectFirebase).
  var isReadOnly = true;
  var currentLayout = null;

  // Firebase wiring.
  var scheduleRef = null;
  var authInstance = null;
  var currentUser = null;
  var stateLoaded = false;    // first onValue() snapshot from the server has arrived
  var seedChecked = false;    // the one-time "is the DB empty?" get() check has run
  var isConnected = false;
  var pendingWrite = false;   // a local mutation is waiting for its debounced write
  var syncTimer = null;
  var isInteracting = false;  // a drag/resize gesture is in progress
  var pendingRemote = null;   // remote snapshot received mid-gesture, applied on release

  function uid() {
    return (crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now() + '-' + Math.random().toString(16).slice(2));
  }
  function clamp(v, lo, hi) { return Math.min(hi, Math.max(lo, v)); }
  function snap(min) { return Math.round(min / SNAP) * SNAP; }
  function parseTime(str) { var p = str.split(':'); return Number(p[0]) * 60 + Number(p[1]); }
  function formatTime(min) {
    var h = Math.floor(min / 60), m = min % 60;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  }
  function getCategory(id) { return state.categories.find(function (c) { return c.id === id; }) || state.categories[0]; }

  function nameKey(title) {
    return (title || '').trim() || '—';
  }
  function getNameColor(title) {
    return (state.nameColors && state.nameColors[nameKey(title)]) || NAME_PALETTE[0];
  }
  function ensureNameColor(title) {
    var key = nameKey(title);
    if (!state.nameColors) state.nameColors = {};
    if (state.nameColors[key]) return state.nameColors[key];
    var color = NAME_PALETTE[Object.keys(state.nameColors).length % NAME_PALETTE.length];
    state.nameColors[key] = color;
    return color;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  var DAY_ALIASES = [
    { day: 0, names: ['понедельник', 'пн', 'mon', 'monday'] },
    { day: 1, names: ['вторник', 'вт', 'tue', 'tues', 'tuesday'] },
    { day: 2, names: ['среда', 'ср', 'wed', 'wednesday'] },
    { day: 3, names: ['четверг', 'чт', 'thu', 'thur', 'thursday'] },
    { day: 4, names: ['пятница', 'пт', 'fri', 'friday'] },
    { day: 5, names: ['суббота', 'сб', 'sat', 'saturday'] },
    { day: 6, names: ['воскресенье', 'вс', 'sun', 'sunday'] }
  ];

  function matchDayName(cell) {
    var norm = (cell || '').trim().toLowerCase().replace(/[.,]+$/, '');
    if (!norm) return null;
    for (var i = 0; i < DAY_ALIASES.length; i++) if (DAY_ALIASES[i].names.indexOf(norm) !== -1) return DAY_ALIASES[i].day;
    for (var j = 0; j < DAY_ALIASES.length; j++) {
      var names = DAY_ALIASES[j].names;
      for (var k = 0; k < names.length; k++) if (names[k].length >= 3 && norm.indexOf(names[k]) === 0) return DAY_ALIASES[j].day;
    }
    return null;
  }

  function parseSingleTime(s) {
    if (!s) return null;
    var m = s.trim().match(/^(\d{1,2})[:.\sч]*(\d{2})?/);
    if (!m) return null;
    var h = Number(m[1]);
    var min = m[2] ? Number(m[2]) : 0;
    if (isNaN(h) || h > 23 || min > 59) return null;
    return h * 60 + min;
  }

  function parseTimeCell(raw) {
    var cleaned = (raw || '').trim();
    if (!cleaned || cleaned === '-' || cleaned === '—' || cleaned === '–') return null;

    var informal = cleaned.match(/^(\d{1,2})-(\d{2})$/);
    if (informal) {
      var ih = Number(informal[1]), imin = Number(informal[2]);
      if (ih <= 23 && imin <= 59) return { start: ih * 60 + imin, end: ih * 60 + imin + 60 };
    }

    var parts = cleaned.replace(/^с\s+/i, '').split(/\s*(?:-|–|—|до|to)\s*/i).filter(Boolean);
    var start = parseSingleTime(parts[0]);
    if (start == null) return null;
    var end = parts.length > 1 ? parseSingleTime(parts[1]) : null;
    if (end == null || end <= start) end = start + 60;
    return { start: clamp(start, DAY_START, DAY_END), end: clamp(end, DAY_START, DAY_END) };
  }

  function splitRow(line) {
    if (line.indexOf('\t') !== -1) return line.split('\t');
    var cells = [], cur = '', inQuotes = false;
    for (var i = 0; i < line.length; i++) {
      var ch = line[i];
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { cells.push(cur); cur = ''; continue; }
      cur += ch;
    }
    cells.push(cur);
    return cells;
  }

  function parseImportGrid(text) {
    var lines = text.replace(/\r\n/g, '\n').split('\n').filter(function (l) { return l.trim() !== ''; });
    if (lines.length < 2) return { events: [], total: 0, skipped: 0 };

    var header = splitRow(lines[0]);
    var dayForColumn = header.map(matchDayName);
    var defaultCategoryId = (state.categories.find(function (c) { return c.isClass; }) || state.categories[0]).id;

    var events = [], total = 0, skipped = 0;
    for (var r = 1; r < lines.length; r++) {
      var row = splitRow(lines[r]);
      var name = (row[0] || '').trim();
      if (!name) continue;
      for (var c = 1; c < row.length; c++) {
        var day = dayForColumn[c];
        var cell = (row[c] || '').trim();
        if (day == null || !cell) continue;
        total++;
        var parsed = parseTimeCell(cell);
        if (!parsed) { skipped++; continue; }
        events.push({ id: uid(), title: name, day: day, start: parsed.start, end: parsed.end, categoryId: defaultCategoryId, notes: '' });
      }
    }
    return { events: events, total: total, skipped: skipped };
  }

  function showImportStatus(message, kind) {
    var el = document.getElementById('import-status');
    el.textContent = message;
    el.className = 'import-status' + (kind ? ' ' + kind : '');
    el.hidden = false;
  }

  function runImport(text) {
    if (isReadOnly) return;
    if (!text || !text.trim()) { showImportStatus('Вставьте скопированные ячейки или выберите файл.', 'error'); return; }
    var parsedResult = parseImportGrid(text);
    var parsed = parsedResult.events, total = parsedResult.total, skipped = parsedResult.skipped;
    if (!total) {
      showImportStatus('Не нашлось ни одной ячейки с временем. Проверьте, что имена — в первом столбце, а дни недели — в первой строке.', 'error');
      return;
    }

    var existingKey = function (ev) { return ev.title + '|' + ev.day + '|' + ev.start + '|' + ev.end; };
    var existing = {};
    state.events.forEach(function (ev) { existing[existingKey(ev)] = true; });
    var toAdd = [];
    parsed.forEach(function (ev) {
      var key = existingKey(ev);
      if (existing[key]) return;
      existing[key] = true;
      toAdd.push(ev);
    });

    if (!toAdd.length) {
      showImportStatus('Добавлено занятий: 0, уже было: ' + parsed.length + (skipped > 0 ? ', не удалось распознать: ' + skipped : '') + '.', 'error');
      return;
    }

    commit(function () { toAdd.forEach(function (ev) { ensureNameColor(ev.title); state.events.push(ev); }); });

    var parts = ['Добавлено занятий: ' + toAdd.length];
    var dupes = parsed.length - toAdd.length;
    if (dupes > 0) parts.push('уже было: ' + dupes);
    if (skipped > 0) parts.push('не удалось распознать: ' + skipped);
    showImportStatus(parts.join(', ') + '.', 'ok');
  }

  function bindImport() {
    document.getElementById('btn-import').addEventListener('click', function () {
      runImport(document.getElementById('import-text').value);
    });
    document.getElementById('btn-import-file').addEventListener('click', function () {
      document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', function (e) {
      var file = e.target.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        document.getElementById('import-text').value = String(reader.result);
        runImport(String(reader.result));
      };
      reader.readAsText(file);
      e.target.value = '';
    });
  }

  function setStatus(mode) {
    var pill = document.getElementById('status-pill');
    var text = document.getElementById('status-text');
    if (mode === 'readonly') {
      pill.classList.add('readonly');
      text.textContent = 'Только просмотр';
    } else if (mode === 'saving') {
      pill.classList.remove('readonly');
      text.textContent = 'Сохранение…';
    } else if (mode === 'offline') {
      pill.classList.add('readonly');
      text.textContent = 'Нет соединения';
    } else if (mode === 'loading') {
      pill.classList.remove('readonly');
      text.textContent = 'Загрузка…';
    } else {
      pill.classList.remove('readonly');
      text.textContent = 'Синхронизировано';
    }
  }

  // Reflects the real Realtime Database state: "Загрузка…" until the first
  // snapshot arrives, "Сохранение…" while a write is queued/in flight,
  // "Нет соединения" when .info/connected is false, "Синхронизировано" otherwise.
  function refreshConnectionStatus() {
    if (isReadOnly) { setStatus('readonly'); return; }
    if (!stateLoaded) { setStatus('loading'); return; }
    if (pendingWrite || syncTimer) { setStatus('saving'); return; }
    setStatus(isConnected ? 'idle' : 'offline');
  }

  // Sync the whole UI to the current isReadOnly value: sidebar forms, import
  // controls, the readonly notice, and a re-render (event drag handles and the
  // category delete buttons are drawn conditionally on isReadOnly).
  function applyReadOnlyUI() {
    var disable = isReadOnly;
    document.getElementById('readonly-notice').hidden = !isReadOnly;
    document.getElementById('event-form').querySelectorAll('input,select,textarea,button').forEach(function (el) { el.disabled = disable; });
    document.getElementById('category-form').querySelectorAll('input,button').forEach(function (el) { el.disabled = disable; });
    document.getElementById('btn-clear').disabled = disable;
    document.getElementById('import-text').disabled = disable;
    document.getElementById('btn-import').disabled = disable;
    document.getElementById('btn-import-file').disabled = disable;
    render();
    renderCategoryList();
    refreshConnectionStatus();
  }

  function enterReadOnly() {
    clearHistory();
    if (isReadOnly) { applyReadOnlyUI(); return; }
    isReadOnly = true;
    applyReadOnlyUI();
  }

  function exitReadOnly() {
    if (!isReadOnly) return;
    isReadOnly = false;
    applyReadOnlyUI();
  }

  // Undo/redo history: snapshots of the whole state, newest last. Cleared on
  // reload (in-memory only, like a text editor's undo buffer).
  var undoStack = [];
  var redoStack = [];
  var HISTORY_LIMIT = 100;

  function clearHistory() { undoStack.length = 0; redoStack.length = 0; }

  // Push the current state to Firebase on a 500ms debounce so a burst of quick
  // edits collapses into one write.
  function scheduleWrite() {
    if (isReadOnly || !stateLoaded) return;
    pendingWrite = true;
    setStatus('saving');
    if (syncTimer) clearTimeout(syncTimer);
    syncTimer = setTimeout(flushSync, 500);
  }

  // Every mutation goes through here: snapshot the pre-mutation state for undo,
  // apply the change, render, and schedule the write. Refuses to run until the
  // real data has loaded from the server, so a local edit can never be based
  // on (and then persist) the empty placeholder state.
  function commit(mutateFn) {
    if (isReadOnly || !stateLoaded) return;
    var before = clone(state);
    mutateFn();
    render();
    undoStack.push(before);
    if (undoStack.length > HISTORY_LIMIT) undoStack.shift();
    redoStack.length = 0;
    scheduleWrite();
  }

  function applyHistorySnapshot(snapshot) {
    state = snapshot;
    render();
    renderCategoryOptions();
    renderCategoryList();
    scheduleWrite();
  }

  function undo() {
    if (isReadOnly || !undoStack.length) return;
    redoStack.push(clone(state));
    applyHistorySnapshot(undoStack.pop());
  }

  function redo() {
    if (isReadOnly || !redoStack.length) return;
    undoStack.push(clone(state));
    applyHistorySnapshot(redoStack.pop());
  }

  function bindUndoRedo() {
    document.addEventListener('keydown', function (e) {
      if ((!e.ctrlKey && !e.metaKey) || e.altKey) return;

      // Use e.code (physical key), not e.key: on a Cyrillic keyboard layout
      // e.key for the Z key is 'я', so `e.key === 'z'` would silently fail.
      var isZ = e.code === 'KeyZ' || (e.key || '').toLowerCase() === 'z';
      var isY = e.code === 'KeyY' || (e.key || '').toLowerCase() === 'y';
      if (!isZ && !isY) return;

      var isUndo = isZ && !e.shiftKey;
      var isRedo = (isZ && e.shiftKey) || (isY && !e.shiftKey);

      // TEMP diagnostic — remove once Ctrl+Z is confirmed working on the live site.
      console.log('[undo] Ctrl+Z нажат', {
        key: e.key, code: e.code, shift: e.shiftKey,
        action: isUndo ? 'undo' : 'redo',
        isReadOnly: isReadOnly, signedIn: !!currentUser,
        undoStack: undoStack.length, redoStack: redoStack.length
      });

      // Let the browser handle Ctrl+Z inside text fields, and don't fire while
      // a modal (edit / auth / confirm) is open or the board is read-only.
      var t = e.target;
      var tag = t && t.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (t && t.isContentEditable)) {
        console.log('[undo] пропущено: фокус в поле ввода (' + tag + ')');
        return;
      }
      if (document.querySelector('.modal-backdrop.open')) {
        console.log('[undo] пропущено: открыт модальный диалог');
        return;
      }
      if (isReadOnly) {
        console.log('[undo] пропущено: режим «только просмотр» (нужно войти)');
        return;
      }

      e.preventDefault();
      if (isUndo) undo(); else redo();
    });
  }

  function flushSync() {
    syncTimer = null;
    // Never write unless: Firebase is ready, the owner is signed in (RTDB
    // rules reject anyone else), and the real data has loaded (so we can't
    // push the empty placeholder over it).
    if (!scheduleRef || !currentUser || !stateLoaded) { pendingWrite = false; refreshConnectionStatus(); return; }
    set(scheduleRef, clone(state)).then(function () {
      pendingWrite = false;
      refreshConnectionStatus();
    }).catch(function (err) {
      console.error('Не удалось записать в Firebase', err);
      pendingWrite = false;
      refreshConnectionStatus();
      showDialog('Не удалось сохранить изменения. Попробуйте ещё раз.', false);
    });
  }

  // Firebase drops empty arrays/objects, so a round-tripped node can be
  // missing keys — rebuild a well-formed { categories, events, nameColors }.
  function normalizeState(raw) {
    raw = raw || {};
    var categories = Array.isArray(raw.categories) && raw.categories.length
      ? raw.categories
      : clone(DEFAULT_STATE.categories);
    var events = Array.isArray(raw.events) ? raw.events.filter(Boolean) : [];
    var nameColors = (raw.nameColors && typeof raw.nameColors === 'object') ? raw.nameColors : {};
    var out = { categories: categories, events: events, nameColors: nameColors };
    if (raw._seeded) out._seeded = true; // carry the one-time seed marker through
    return out;
  }

  function beginInteraction() { isInteracting = true; }
  function endInteraction() {
    isInteracting = false;
    if (pendingRemote != null && !pendingWrite && !syncTimer) {
      var raw = pendingRemote;
      pendingRemote = null;
      applyRemoteState(raw);
    }
  }

  function applyRemoteState(raw) {
    pendingRemote = null;
    state = normalizeState(raw);
    state.events.forEach(function (ev) { ensureNameColor(ev.title); });
    render();
    renderCategoryOptions();
    renderCategoryList();
  }

  // One-time, first-run-only seeding. Runs at most once per page load, only
  // when signed in and connected. Does an explicit get() (single read straight
  // from the server) and writes DEFAULT_STATE *only* if the node truly does
  // not exist AND carries no /schedule/_seeded marker. After a successful seed
  // the marker is set, so this can never fire twice — not even by accident, on
  // any device. It is NOT driven by onValue(), so it cannot lose a race with
  // the real data arriving.
  async function seedIfEmpty() {
    if (seedChecked || !scheduleRef || !currentUser || !isConnected) return;
    seedChecked = true;
    try {
      var snap = await get(scheduleRef);
      // Seed only if the node is truly absent. Any existing content — real
      // data, or just the /schedule/_seeded marker from a previous seed —
      // makes snap.exists() true and blocks a second seed forever.
      if (snap.exists()) return;
      var seed = clone(DEFAULT_STATE);
      seed._seeded = true;
      await set(scheduleRef, seed);
      console.log('[seed] база была пуста — записаны стартовые данные один раз');
    } catch (e) {
      seedChecked = false;                  // let a later auth/connect retry
      console.error('[seed] проверка не удалась', e);
    }
  }

  function connectFirebase() {
    var db;
    try {
      var app = initializeApp(firebaseConfig);
      db = getDatabase(app);
      authInstance = getAuth(app);
    } catch (e) {
      console.error('Не удалось инициализировать Firebase. Проверьте firebase-config.js', e);
      setStatus('offline');
      return;
    }

    // Firebase persists the session (browserLocalPersistence by default), so
    // this fires with the previously signed-in user on reload without a
    // re-login prompt.
    onAuthStateChanged(authInstance, function (user) {
      currentUser = user || null;
      updateAuthUI();
      if (currentUser) {
        exitReadOnly();
        seedIfEmpty();
      } else {
        enterReadOnly();
      }
    });

    scheduleRef = ref(db, SCHEDULE_PATH);

    onValue(ref(db, '.info/connected'), function (snap) {
      isConnected = snap.val() === true;
      refreshConnectionStatus();
      if (isConnected) seedIfEmpty();
    });

    // The single source of truth. state is only ever replaced from here; the
    // first snapshot flips stateLoaded, which is what unblocks commits/writes.
    onValue(scheduleRef, function (snap) {
      var val = snap.val();
      var hasData = val && typeof val === 'object';

      if (hasData) {
        // Don't stomp on edits the local user is still making; the echo of our
        // own write will re-sync once the debounce has flushed. A snapshot that
        // lands mid drag/resize is stashed and applied when the gesture ends.
        if (pendingWrite || syncTimer) {
          // keep current local state
        } else if (isInteracting) {
          pendingRemote = val;
        } else {
          applyRemoteState(val);
        }
      }
      // Empty node (hasData === false): keep the empty placeholder on screen.
      // seedIfEmpty() — not this handler — decides whether to populate it.

      if (!stateLoaded) {
        stateLoaded = true;
        refreshConnectionStatus();
      }
    }, function (err) {
      console.error('Ошибка чтения из Firebase', err);
      setStatus('offline');
    });
  }

  function updateAuthUI() {
    var login = document.getElementById('btn-login');
    var logout = document.getElementById('btn-logout');
    if (login) login.hidden = !!currentUser;
    if (logout) logout.hidden = !currentUser;
  }

  function authErrorText(err) {
    var code = (err && err.code) || '';
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Неверный email или пароль.';
      case 'auth/invalid-email':
        return 'Некорректный адрес email.';
      case 'auth/user-disabled':
        return 'Эта учётная запись отключена.';
      case 'auth/too-many-requests':
        return 'Слишком много попыток входа. Попробуйте позже.';
      case 'auth/network-request-failed':
        return 'Нет соединения с сервером. Проверьте интернет.';
      default:
        return 'Не удалось войти.' + ((err && err.message) ? ' ' + err.message : '');
    }
  }

  function openAuthModal() {
    document.getElementById('auth-backdrop').classList.add('open');
    var email = document.getElementById('auth-email');
    if (email) { try { email.focus(); } catch (e) { } }
  }

  function closeAuthModal() {
    document.getElementById('auth-backdrop').classList.remove('open');
  }

  function bindAuth() {
    document.getElementById('btn-login').addEventListener('click', openAuthModal);

    document.getElementById('btn-logout').addEventListener('click', function () {
      if (!authInstance) return;
      signOut(authInstance).catch(function (err) {
        showDialog('Не удалось выйти. ' + ((err && err.message) || ''), false);
      });
    });

    document.getElementById('auth-cancel').addEventListener('click', closeAuthModal);

    var backdrop = document.getElementById('auth-backdrop');
    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeAuthModal(); });

    document.getElementById('auth-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!authInstance) { showDialog('Firebase не инициализирован. Проверьте firebase-config.js.', false); return; }
      var email = document.getElementById('auth-email').value.trim();
      var password = document.getElementById('auth-password').value;
      if (!email || !password) return;
      var submitBtn = e.target.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;
      signInWithEmailAndPassword(authInstance, email, password).then(function () {
        document.getElementById('auth-password').value = '';
        closeAuthModal();
      }).catch(function (err) {
        showDialog(authErrorText(err), false);
      }).finally(function () {
        if (submitBtn) submitBtn.disabled = false;
      });
    });
  }

  var dialogResolve = null;

  function showDialog(message, showCancel) {
    return new Promise(function (resolve) {
      dialogResolve = resolve;
      document.getElementById('confirm-message').textContent = message;
      document.getElementById('confirm-cancel').hidden = !showCancel;
      document.getElementById('confirm-backdrop').classList.add('open');
    });
  }

  function closeDialog(result) {
    document.getElementById('confirm-backdrop').classList.remove('open');
    var resolve = dialogResolve;
    dialogResolve = null;
    if (resolve) resolve(result);
  }

  function bindDialog() {
    document.getElementById('confirm-ok').addEventListener('click', function () { closeDialog(true); });
    document.getElementById('confirm-cancel').addEventListener('click', function () { closeDialog(false); });
    document.getElementById('confirm-backdrop').addEventListener('click', function (e) {
      if (e.target === document.getElementById('confirm-backdrop')) closeDialog(false);
    });
  }

  function computeSegments() {
    var points = {}; points[DAY_START] = true; points[DAY_END] = true;
    state.events.forEach(function (ev) {
      points[clamp(ev.start, DAY_START, DAY_END)] = true;
      points[clamp(ev.end, DAY_START, DAY_END)] = true;
    });
    var sorted = Object.keys(points).map(Number).sort(function (a, b) { return a - b; });
    var segs = [];
    for (var i = 0; i < sorted.length - 1; i++) {
      var from = sorted[i], to = sorted[i + 1];
      if (to <= from) continue;
      var busy = state.events.some(function (ev) { return ev.start < to && ev.end > from; });
      segs.push({ from: from, to: to, busy: busy });
    }
    if (!segs.length) segs.push({ from: DAY_START, to: DAY_END, busy: false });
    return segs;
  }

  function computeLayout() {
    var y = 0;
    var segments = computeSegments().map(function (seg) {
      var h = seg.busy ? Math.max(MIN_CONTENT_HEIGHT, Math.round((seg.to - seg.from) * PX_PER_MIN)) : GAP_ROW_HEIGHT;
      var item = { from: seg.from, to: seg.to, busy: seg.busy, y: y, h: h };
      y += h;
      return item;
    });
    return { segments: segments, totalHeight: y };
  }

  function minutesToY(layout, minutes) {
    var segs = layout.segments;
    for (var i = 0; i < segs.length; i++) {
      var s = segs[i];
      if (minutes <= s.from) return s.y;
      if (minutes < s.to) return s.y + ((minutes - s.from) / (s.to - s.from)) * s.h;
    }
    var last = segs[segs.length - 1];
    return last.y + last.h;
  }

  function yToMinutes(layout, y) {
    var segs = layout.segments;
    if (y <= 0) return segs[0].from;
    for (var i = 0; i < segs.length; i++) {
      var s = segs[i];
      if (y <= s.y + s.h) {
        var frac = clamp((y - s.y) / s.h, 0, 1);
        return s.from + frac * (s.to - s.from);
      }
    }
    var last = segs[segs.length - 1];
    return last.to;
  }

  function segmentBackground(layout) {
    var parts = [], y = 0;
    layout.segments.forEach(function (seg, i) {
      if (i > 0) parts.push('var(--seam) ' + y + 'px ' + (y + 1) + 'px');
      var fillStart = i > 0 ? y + 1 : y;
      var fill = seg.busy ? 'var(--surface)' : 'var(--surface-alt)';
      parts.push(fill + ' ' + fillStart + 'px ' + (y + seg.h) + 'px');
      y += seg.h;
    });
    return 'linear-gradient(to bottom, ' + parts.join(', ') + ')';
  }

  function render() {
    currentLayout = computeLayout();
    rebuildSkeleton(currentLayout);
    renderEvents();
    renderNameColorList();
    renderDayTabs();
  }

  function rebuildSkeleton(layout) {
    var heightPx = layout.totalHeight;

    var header = document.createElement('div');
    header.className = 'grid-header';
    header.innerHTML = '<div class="corner"></div>' + DAY_NAMES.map(function (n, i) {
      return '<div class="day-head' + (i === mobileActiveDay ? '' : ' hidden-mobile') + '">' + n + '</div>';
    }).join('');

    var body = document.createElement('div');
    body.className = 'grid-body';
    body.style.height = heightPx + 'px';

    var timeCol = document.createElement('div');
    timeCol.className = 'time-col';
    timeCol.style.height = heightPx + 'px';
    layout.segments.forEach(function (seg) {
      if (!seg.busy) return;
      var label = document.createElement('div');
      label.className = 'time-label';
      label.style.top = seg.y + 'px';
      label.textContent = formatTime(seg.from);
      timeCol.appendChild(label);
    });
    body.appendChild(timeCol);

    var dayBg = segmentBackground(layout);
    for (var d = 0; d < 7; d++) {
      var col = document.createElement('div');
      col.className = 'day-col' + (d === mobileActiveDay ? '' : ' hidden-mobile');
      col.dataset.day = String(d);
      col.style.height = heightPx + 'px';
      col.style.backgroundImage = dayBg;
      body.appendChild(col);
    }

    gridEl.innerHTML = '';
    gridEl.appendChild(header);
    gridEl.appendChild(body);
  }

  function renderDayTabs() {
    var wrap = document.getElementById('day-tabs');
    if (!wrap) return;
    wrap.innerHTML = DAY_SHORT_NAMES.map(function (name, i) {
      return '<button type="button" data-day="' + i + '" class="' + (i === mobileActiveDay ? 'active' : '') + '">' + name + '</button>';
    }).join('');
  }

  function bindDayTabs() {
    var wrap = document.getElementById('day-tabs');
    if (!wrap) return;
    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('button[data-day]');
      if (!btn) return;
      mobileActiveDay = Number(btn.dataset.day);
      render();
    });
  }

  function dayColEl(day) { return gridEl.querySelector('.day-col[data-day="' + day + '"]'); }
  function dayColAtPoint(clientX) {
    var cols = gridEl.querySelectorAll('.day-col');
    for (var i = 0; i < cols.length; i++) {
      var r = cols[i].getBoundingClientRect();
      if (clientX >= r.left && clientX <= r.right) return cols[i];
    }
    return null;
  }

  function layoutDay(events) {
    var sorted = events.slice().sort(function (a, b) { return a.start - b.start || a.end - b.end; });
    var clusters = [], current = [], currentEnd = -Infinity;
    sorted.forEach(function (ev) {
      if (current.length && ev.start >= currentEnd) { clusters.push(current); current = []; currentEnd = -Infinity; }
      current.push(ev);
      currentEnd = Math.max(currentEnd, ev.end);
    });
    if (current.length) clusters.push(current);

    var positioned = [];
    clusters.forEach(function (cluster) {
      var columnsEnd = [], colOf = {};
      cluster.forEach(function (ev) {
        var placed = false;
        for (var c = 0; c < columnsEnd.length; c++) {
          if (columnsEnd[c] <= ev.start) { columnsEnd[c] = ev.end; colOf[ev.id] = c; placed = true; break; }
        }
        if (!placed) { columnsEnd.push(ev.end); colOf[ev.id] = columnsEnd.length - 1; }
      });
      var totalCols = columnsEnd.length;
      cluster.forEach(function (ev) { positioned.push({ ev: ev, col: colOf[ev.id], totalCols: totalCols }); });
    });
    return positioned;
  }

  function renderEvents() {
    for (var d = 0; d < 7; d++) {
      var col = dayColEl(d);
      col.querySelectorAll('.event').forEach(function (n) { n.remove(); });
      var dayEvents = state.events.filter(function (e) { return e.day === d; });
      layoutDay(dayEvents).forEach(function (p) { col.appendChild(buildEventEl(p.ev, p.col, p.totalCols)); });
    }
  }

  function buildEventEl(ev, col, totalCols) {
    var cat = getCategory(ev.categoryId);
    var el = document.createElement('div');
    el.className = 'event' + (cat.isClass ? '' : ' other-type') + (isReadOnly ? ' readonly' : '');
    el.dataset.id = ev.id;
    positionEventEl(el, ev, col, totalCols, currentLayout);
    el.style.background = getNameColor(ev.title);

    var title = document.createElement('div');
    title.className = 'ev-title';
    title.textContent = ev.title;
    var time = document.createElement('div');
    time.className = 'ev-time';
    time.textContent = formatTime(ev.start) + '–' + formatTime(ev.end);

    el.appendChild(title);
    el.appendChild(time);

    if (!isReadOnly) {
      var handleTop = document.createElement('div');
      handleTop.className = 'resize-handle top';
      var handleBottom = document.createElement('div');
      handleBottom.className = 'resize-handle bottom';
      el.appendChild(handleTop);
      el.appendChild(handleBottom);
      makeDraggable(el, ev);
      makeResizable(el, ev, handleTop, handleBottom);
    }

    return el;
  }

  function positionEventEl(el, ev, col, totalCols, layout) {
    var width = 100 / totalCols, left = col * width;
    var top = minutesToY(layout, ev.start);
    var bottom = minutesToY(layout, ev.end);
    el.style.top = top + 'px';
    el.style.height = Math.max(MIN_CONTENT_HEIGHT, bottom - top) + 'px';
    el.style.left = 'calc(' + left + '% + 2px)';
    el.style.width = 'calc(' + width + '% - 4px)';
  }

  function makeDraggable(el, ev) {
    el.addEventListener('pointerdown', function (e) {
      if (isReadOnly || e.target.classList.contains('resize-handle')) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      beginInteraction();

      var frozen = currentLayout;
      var duration = ev.end - ev.start;
      var startX = e.clientX, startY = e.clientY, moved = false;
      var previewDay = ev.day, previewStart = ev.start;

      function onMove(e2) {
        var dx = e2.clientX - startX, dy = e2.clientY - startY;
        if (!moved && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) moved = true;
        if (!moved) return;
        el.classList.add('dragging');
        var originY = minutesToY(frozen, ev.start);
        var rawStart = yToMinutes(frozen, originY + dy);
        previewStart = clamp(snap(rawStart), DAY_START, DAY_END - duration);
        var targetCol = dayColAtPoint(e2.clientX);
        if (targetCol) {
          previewDay = Number(targetCol.dataset.day);
          if (targetCol !== el.parentElement) targetCol.appendChild(el);
        }
        var top = minutesToY(frozen, previewStart);
        var bottom = minutesToY(frozen, previewStart + duration);
        el.style.top = top + 'px';
        el.style.height = Math.max(MIN_CONTENT_HEIGHT, bottom - top) + 'px';
        el.style.left = '2px';
        el.style.width = 'calc(100% - 4px)';
      }
      function onUp(e2) {
        el.releasePointerCapture(e2.pointerId);
        el.removeEventListener('pointermove', onMove);
        el.removeEventListener('pointerup', onUp);
        el.classList.remove('dragging');
        if (moved) {
          commit(function () { ev.day = previewDay; ev.start = previewStart; ev.end = previewStart + duration; });
        } else {
          openEditModal(ev.id);
        }
        endInteraction();
      }
      el.addEventListener('pointermove', onMove);
      el.addEventListener('pointerup', onUp);
    });
  }

  function makeResizable(el, ev, handleTop, handleBottom) {
    function bind(handle, edge) {
      handle.addEventListener('pointerdown', function (e) {
        if (isReadOnly) return;
        e.stopPropagation();
        e.preventDefault();
        handle.setPointerCapture(e.pointerId);
        beginInteraction();
        var frozen = currentLayout;
        var startY = e.clientY, origStart = ev.start, origEnd = ev.end;
        var originY = minutesToY(frozen, edge === 'top' ? origStart : origEnd);
        var pendingStart = origStart, pendingEnd = origEnd;

        function onMove(e2) {
          var rawMinutes = yToMinutes(frozen, originY + (e2.clientY - startY));
          if (edge === 'top') {
            pendingStart = clamp(snap(rawMinutes), DAY_START, origEnd - MIN_DURATION);
          } else {
            pendingEnd = clamp(snap(rawMinutes), origStart + MIN_DURATION, DAY_END);
          }
          var top = minutesToY(frozen, pendingStart);
          var bottom = minutesToY(frozen, pendingEnd);
          el.style.top = top + 'px';
          el.style.height = Math.max(MIN_CONTENT_HEIGHT, bottom - top) + 'px';
        }
        function onUp(e2) {
          handle.releasePointerCapture(e2.pointerId);
          handle.removeEventListener('pointermove', onMove);
          handle.removeEventListener('pointerup', onUp);
          commit(function () { ev.start = pendingStart; ev.end = pendingEnd; });
          endInteraction();
        }
        handle.addEventListener('pointermove', onMove);
        handle.addEventListener('pointerup', onUp);
      });
    }
    bind(handleTop, 'top');
    bind(handleBottom, 'bottom');
  }

  function renderCategoryOptions() {
    ['f-category', 'e-category'].forEach(function (id) {
      var sel = document.getElementById(id), prev = sel.value;
      sel.innerHTML = state.categories.map(function (c) { return '<option value="' + c.id + '">' + escapeHtml(c.name) + '</option>'; }).join('');
      if (state.categories.some(function (c) { return c.id === prev; })) sel.value = prev;
    });
  }

  function renderCategoryList() {
    var list = document.getElementById('category-list');
    list.innerHTML = '';
    state.categories.forEach(function (cat) {
      var li = document.createElement('li');
      var preview = document.createElement('span'); preview.className = 'style-preview' + (cat.isClass ? '' : ' dashed');
      var name = document.createElement('span'); name.textContent = cat.name;
      var type = document.createElement('span'); type.className = 'cat-type'; type.textContent = cat.isClass ? 'занятие' : 'дело';
      var del = document.createElement('button');
      del.className = 'cat-del'; del.type = 'button'; del.textContent = '✕'; del.title = 'Удалить категорию';
      del.hidden = isReadOnly;
      del.addEventListener('click', function () { deleteCategory(cat.id); });
      li.append(preview, name, type, del);
      list.appendChild(li);
    });
  }

  function renderNameColorList() {
    var list = document.getElementById('name-color-list');
    if (!list) return;
    var seen = {};
    var names = [];
    state.events.forEach(function (ev) {
      var key = nameKey(ev.title);
      if (!seen[key]) { seen[key] = true; names.push(key); }
    });
    names.sort(function (a, b) { return a.localeCompare(b, 'ru'); });
    list.innerHTML = '';
    names.forEach(function (name) {
      var li = document.createElement('li');
      var swatch = document.createElement('span'); swatch.className = 'swatch'; swatch.style.background = getNameColor(name);
      var label = document.createElement('span'); label.textContent = name;
      li.append(swatch, label);
      list.appendChild(li);
    });
    if (!names.length) {
      var li = document.createElement('li');
      li.className = 'empty-hint';
      li.textContent = 'Пока нет занятий';
      list.appendChild(li);
    }
  }

  function deleteCategory(id) {
    if (isReadOnly) return;
    if (state.categories.length <= 1) { showDialog('Должна остаться хотя бы одна категория.', false); return; }
    var cat = getCategory(id);
    showDialog('Удалить категорию «' + cat.name + '»? Все связанные занятия перейдут в другую категорию.', true).then(function (ok) {
      if (!ok) return;
      var fallback = state.categories.find(function (c) { return c.id !== id; }).id;
      commit(function () {
        state.events.forEach(function (ev) { if (ev.categoryId === id) ev.categoryId = fallback; });
        state.categories = state.categories.filter(function (c) { return c.id !== id; });
      });
      renderCategoryOptions();
      renderCategoryList();
    });
  }

  function bindForms() {
    document.getElementById('event-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (isReadOnly) return;
      var title = document.getElementById('f-title').value.trim();
      var day = Number(document.getElementById('f-day').value);
      var start = parseTime(document.getElementById('f-start').value);
      var end = parseTime(document.getElementById('f-end').value);
      var categoryId = document.getElementById('f-category').value;
      var notes = document.getElementById('f-notes').value.trim();
      if (!title) return;
      if (end <= start) { showDialog('Время окончания должно быть позже времени начала.', false); return; }
      commit(function () {
        ensureNameColor(title);
        state.events.push({ id: uid(), title: title, day: day, start: clamp(start, DAY_START, DAY_END), end: clamp(end, DAY_START, DAY_END), categoryId: categoryId, notes: notes });
      });
      e.target.reset();
      document.getElementById('f-start').value = '09:00';
      document.getElementById('f-end').value = '10:00';
    });

    document.getElementById('category-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (isReadOnly) return;
      var name = document.getElementById('c-name').value.trim();
      var isClass = document.getElementById('c-is-class').checked;
      if (!name) return;
      commit(function () { state.categories.push({ id: 'cat-' + uid(), name: name, isClass: isClass }); });
      renderCategoryOptions();
      renderCategoryList();
      e.target.reset();
    });

    document.getElementById('btn-clear').addEventListener('click', function () {
      if (isReadOnly) return;
      showDialog('Удалить все занятия и дела из расписания?', true).then(function (ok) {
        if (!ok) return;
        commit(function () { state.events = []; });
      });
    });

    var backdrop = document.getElementById('edit-backdrop');
    document.getElementById('edit-form').addEventListener('submit', function (e) {
      e.preventDefault();
      if (isReadOnly) return;
      var ev = state.events.find(function (x) { return x.id === editingId; });
      if (!ev) return;
      var start = parseTime(document.getElementById('e-start').value);
      var end = parseTime(document.getElementById('e-end').value);
      if (end <= start) { showDialog('Время окончания должно быть позже времени начала.', false); return; }
      commit(function () {
        ev.title = document.getElementById('e-title').value.trim() || ev.title;
        ensureNameColor(ev.title);
        ev.day = Number(document.getElementById('e-day').value);
        ev.start = clamp(start, DAY_START, DAY_END);
        ev.end = clamp(end, DAY_START, DAY_END);
        ev.categoryId = document.getElementById('e-category').value;
        ev.notes = document.getElementById('e-notes').value.trim();
      });
      closeEditModal();
    });

    document.getElementById('e-cancel').addEventListener('click', closeEditModal);
    document.getElementById('e-delete').addEventListener('click', function () {
      if (isReadOnly || !editingId) return;
      var id = editingId;
      closeEditModal();
      showDialog('Удалить это занятие?', true).then(function (ok) {
        if (!ok) return;
        commit(function () { state.events = state.events.filter(function (x) { return x.id !== id; }); });
      });
    });
    backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeEditModal(); });
  }

  function openEditModal(id) {
    var ev = state.events.find(function (x) { return x.id === id; });
    if (!ev) return;
    editingId = id;
    document.getElementById('e-title').value = ev.title;
    document.getElementById('e-day').value = String(ev.day);
    document.getElementById('e-start').value = formatTime(ev.start);
    document.getElementById('e-end').value = formatTime(ev.end);
    document.getElementById('e-category').value = ev.categoryId;
    document.getElementById('e-notes').value = ev.notes || '';
    document.getElementById('edit-backdrop').classList.add('open');
    document.getElementById('edit-form').querySelectorAll('input,select,textarea,button').forEach(function (el) { el.disabled = isReadOnly; });
    document.getElementById('e-cancel').disabled = false;
  }
  function closeEditModal() {
    editingId = null;
    document.getElementById('edit-backdrop').classList.remove('open');
  }

  var SIDEBAR_COLLAPSE_KEY = 'schedulePlannerSidebarCollapsed';

  function bindSidebarToggle() {
    var layout = document.querySelector('.layout');
    var toggle = document.getElementById('sidebar-toggle');
    if (!layout || !toggle) return;

    var stored = null;
    try { stored = localStorage.getItem(SIDEBAR_COLLAPSE_KEY); } catch (e) { }
    var collapsed = stored === null ? isMobileViewport() : stored === 'true';
    applySidebarState(layout, toggle, collapsed);

    toggle.addEventListener('click', function () {
      var next = !layout.classList.contains('sidebar-collapsed');
      applySidebarState(layout, toggle, next);
      try { localStorage.setItem(SIDEBAR_COLLAPSE_KEY, String(next)); } catch (e) { }
    });

    window.addEventListener('resize', function () {
      applySidebarState(layout, toggle, layout.classList.contains('sidebar-collapsed'));
    });
  }

  function bindSidebarBackdrop() {
    var backdrop = document.getElementById('sidebar-backdrop');
    var layout = document.querySelector('.layout');
    var toggle = document.getElementById('sidebar-toggle');
    if (!backdrop || !layout || !toggle) return;
    backdrop.addEventListener('click', function () {
      applySidebarState(layout, toggle, true);
      try { localStorage.setItem(SIDEBAR_COLLAPSE_KEY, 'true'); } catch (e) { }
    });
  }

  function applySidebarState(layout, toggle, collapsed) {
    layout.classList.toggle('sidebar-collapsed', collapsed);
    toggle.textContent = collapsed ? '▶' : '◀';
    toggle.title = collapsed ? 'Показать панель' : 'Свернуть панель';
    var backdrop = document.getElementById('sidebar-backdrop');
    if (backdrop) backdrop.classList.toggle('open', !collapsed && isMobileViewport());
  }

  function init() {
    state.events.forEach(function (ev) { ensureNameColor(ev.title); });

    render();
    renderCategoryOptions();
    renderCategoryList();
    bindForms();
    bindImport();
    bindDialog();
    bindAuth();
    bindUndoRedo();
    bindSidebarToggle();
    bindSidebarBackdrop();
    bindDayTabs();

    // Locked until Firebase Auth reports a signed-in user.
    updateAuthUI();
    applyReadOnlyUI();

    connectFirebase();
  }

  init();
})();
