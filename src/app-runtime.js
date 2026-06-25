(function () {
  const root = document.getElementById("root");
  const STORAGE_KEY = "french_vocabulary_quizzer_items_v1";
  const QUIZ_STORAGE_KEY = "french_vocabulary_quizzer_saved_quizzes_v1";
  const PERF_KEY = "french_vocabulary_quizzer_performance_v1";
  const SEPARATORS = ["->", "→", "\t", "=", ":", "*", "|", ",", " - ", " -", "- "];
  const QUIZ_SIZES = [5, 10, 20, 50];
  const SHARE_PREFIX = "vocab=";
  const QUIZ_SHARE_PREFIX = "quiz=";
  const TTS_LANG_KEY = "french_vocabulary_quizzer_tts_lang_v1";
  const SOUND_SRC = "./assets/correct-wrong.mp3";
  let soundContext = null;
  let soundBuffer = null;
  let soundCues = null;
  let soundLoadPromise = null;
  const sharedVocabulary = loadSharedVocabulary();
  const sharedQuiz = loadSharedQuiz();

  const state = {
    vocabulary: sharedQuiz ? mergeVocabulary(loadVocabulary(), sharedQuiz.items) : sharedVocabulary || loadVocabulary(),
    savedQuizzes: sharedQuiz ? upsertSavedQuiz(loadSavedQuizzes(), sharedQuiz) : loadSavedQuizzes(),
    query: "",
    form: { term: "", definition: "" },
    editingId: null,
    bulkText: "",
    importSummary: null,
    shareLink: "",
    shareStatus: "",
    quizName: sharedQuiz ? sharedQuiz.name : "",
    savedQuizLink: "",
    savedQuizStatus: sharedQuiz ? `Đã tải bài kiểm tra: ${sharedQuiz.name}.` : "",
    quizSize: 10,
    customSize: "",
    quizDirection: "term-to-def",
    quizMode: "type",
    choiceOptions: [],
    ttsLang: localStorage.getItem(TTS_LANG_KEY) || "fr-FR",
    view: sharedQuiz ? "quiz" : "study",
    quizItems: sharedQuiz ? shuffle(sharedQuiz.items) : [],
    activeQuizName: sharedQuiz ? sharedQuiz.name : "",
    questionIndex: 0,
    answer: "",
    answers: [],
    feedback: null,
    sortMode: "incorrect-first",
  };

  if (sharedVocabulary) {
    saveVocabulary();
    state.shareStatus = `Đã tải ${state.vocabulary.length} từ được chia sẻ.`;
  }
  if (sharedQuiz) {
    saveVocabulary();
    saveSavedQuizzes();
  }

  preloadSound();

  function createId() {
    return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
  }

  function migrateLegacyItem(item) {
    if (item && 'french' in item && !('term' in item)) {
      return { id: item.id || createId(), term: item.french || "", definition: item.vietnamese || "" };
    }
    return item;
  }

  function loadVocabulary() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw).map(migrateLegacyItem) : [];
    } catch {
      return [];
    }
  }

  function loadSavedQuizzes() {
    try {
      const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
      return raw ? JSON.parse(raw).map(q => ({ ...q, items: (q.items || []).map(migrateLegacyItem) })) : [];
    } catch {
      return [];
    }
  }

  function saveVocabulary() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.vocabulary));
    } catch {
      console.warn("Không thể lưu từ vựng: bộ nhớ có thể đã đầy.");
    }
  }

  function saveSavedQuizzes() {
    try {
      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(state.savedQuizzes));
    } catch {
      console.warn("Không thể lưu bài kiểm tra: bộ nhớ có thể đã đầy.");
    }
  }

  function perfKey(item) {
    return `${item.term.toLowerCase().trim()}|${item.definition.toLowerCase().trim()}`;
  }

  function loadPerformance() {
    try {
      const raw = localStorage.getItem(PERF_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  function savePerformance(perf) {
    try {
      localStorage.setItem(PERF_KEY, JSON.stringify(perf));
    } catch {}
  }

  function updatePerformance(answers) {
    const perf = loadPerformance();
    answers.forEach(({ item, correct, skipped }) => {
      if (skipped) return;
      const key = perfKey(item);
      const cur = perf[key] || { attempts: 0, correct: 0 };
      perf[key] = { attempts: cur.attempts + 1, correct: cur.correct + (correct ? 1 : 0) };
    });
    savePerformance(perf);
  }

  function weightedSelectItems(items, count) {
    const perf = loadPerformance();
    const weighted = items.map(item => {
      const data = perf[perfKey(item)];
      let weight;
      if (!data || data.attempts === 0) weight = 3;
      else {
        const acc = data.correct / data.attempts;
        weight = acc < 0.5 ? 4 : acc < 0.8 ? 2 : 1;
      }
      return { item, weight };
    });

    const selected = [];
    const pool = [...weighted];
    const target = Math.min(count, pool.length);

    while (selected.length < target && pool.length > 0) {
      const total = pool.reduce((s, w) => s + w.weight, 0);
      let rand = Math.random() * total;
      let idx = 0;
      while (idx < pool.length - 1 && (rand -= pool[idx].weight) > 0) idx++;
      selected.push(pool[idx].item);
      pool.splice(idx, 1);
    }
    return shuffle(selected);
  }

  function bytesToBase64(bytes) {
    let binary = "";
    for (let index = 0; index < bytes.length; index += 0x8000) {
      binary += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
    }
    return btoa(binary);
  }

  function base64ToBytes(value) {
    const binary = atob(value);
    const bytes = new Uint8Array(binary.length);
    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }
    return bytes;
  }

  function encodeSharePayload(items) {
    const payload = items.map(({ term, definition }) => ({ term, definition }));
    return bytesToBase64(new TextEncoder().encode(JSON.stringify(payload)));
  }

  function decodeSharePayload(value) {
    const json = new TextDecoder().decode(base64ToBytes(value));
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return null;
    const items = parsed
      .map((item) => ({
        id: createId(),
        term: typeof item.term === "string" ? item.term.trim() : (typeof item.french === "string" ? item.french.trim() : ""),
        definition: typeof item.definition === "string" ? item.definition.trim() : (typeof item.vietnamese === "string" ? item.vietnamese.trim() : ""),
      }))
      .filter((item) => item.term && item.definition);
    return items.length ? items : null;
  }

  function normalizeSharedItems(items) {
    if (!Array.isArray(items)) return [];
    return items
      .map((item) => ({
        id: createId(),
        term: typeof item.term === "string" ? item.term.trim() : (typeof item.french === "string" ? item.french.trim() : ""),
        definition: typeof item.definition === "string" ? item.definition.trim() : (typeof item.vietnamese === "string" ? item.vietnamese.trim() : ""),
      }))
      .filter((item) => item.term && item.definition);
  }

  function encodeQuizPayload(quiz) {
    const payload = {
      name: quiz.name,
      items: quiz.items.map(({ term, definition }) => ({ term, definition })),
    };
    return bytesToBase64(new TextEncoder().encode(JSON.stringify(payload)));
  }

  function decodeQuizPayload(value) {
    const json = new TextDecoder().decode(base64ToBytes(value));
    const parsed = JSON.parse(json);
    const items = normalizeSharedItems(parsed && parsed.items);
    if (!items.length) return null;
    return {
      id: createId(),
      name: typeof parsed.name === "string" && parsed.name.trim() ? parsed.name.trim() : "Shared quiz",
      items,
      createdAt: new Date().toISOString(),
    };
  }

  function loadSharedVocabulary() {
    try {
      if (!window.location.hash.startsWith(`#${SHARE_PREFIX}`)) return null;
      const encoded = decodeURIComponent(window.location.hash.slice(SHARE_PREFIX.length + 1));
      return decodeSharePayload(encoded);
    } catch {
      return null;
    }
  }

  function loadSharedQuiz() {
    try {
      if (!window.location.hash.startsWith(`#${QUIZ_SHARE_PREFIX}`)) return null;
      const encoded = decodeURIComponent(window.location.hash.slice(QUIZ_SHARE_PREFIX.length + 1));
      return decodeQuizPayload(encoded);
    } catch {
      return null;
    }
  }

  function mergeVocabulary(currentItems, incomingItems) {
    const seen = new Set(currentItems.map((item) => `${item.term}\n${item.definition}`.toLowerCase()));
    const additions = incomingItems.filter((item) => {
      const key = `${item.term}\n${item.definition}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    return [...additions, ...currentItems];
  }

  function upsertSavedQuiz(quizzes, quiz) {
    const key = `${quiz.name}\n${quiz.items.map((item) => `${item.term}:${item.definition}`).join("|")}`.toLowerCase();
    const exists = quizzes.some((saved) => {
      const savedKey = `${saved.name}\n${saved.items.map((item) => `${item.term}:${item.definition}`).join("|")}`.toLowerCase();
      return savedKey === key;
    });
    return exists ? quizzes : [{ ...quiz, id: quiz.id || createId(), createdAt: quiz.createdAt || new Date().toISOString() }, ...quizzes];
  }

  async function shortenUrl(url) {
    if (url.startsWith("file://") || url.includes("localhost") || url.includes("127.0.0.1")) {
      return url;
    }
    try {
      const response = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`);
      if (!response.ok) throw new Error("failed");
      const short = (await response.text()).trim();
      return short.startsWith("http") ? short : url;
    } catch {
      return url;
    }
  }

  async function createShareLink() {
    if (state.vocabulary.length === 0) return;
    const encoded = encodeURIComponent(encodeSharePayload(state.vocabulary));
    const longUrl = `${window.location.href.split("#")[0]}#${SHARE_PREFIX}${encoded}`;
    state.shareLink = "";
    state.shareStatus = "Đang rút gọn link…";
    render();
    const short = await shortenUrl(longUrl);
    state.shareLink = short;
    state.shareStatus = short !== longUrl
      ? `Đã rút gọn link cho ${state.vocabulary.length} từ.`
      : `Đã tạo link cho ${state.vocabulary.length} từ.`;
    render();
  }

  async function copyShareLink() {
    if (!state.shareLink) return;
    try {
      await navigator.clipboard.writeText(state.shareLink);
      state.shareStatus = "Đã sao chép link.";
    } catch {
      state.shareStatus = "Không thể tự động sao chép. Hãy chọn link và sao chép thủ công.";
    }
    render();
  }

  function createQuizShareLink(quiz) {
    const encoded = encodeURIComponent(encodeQuizPayload(quiz));
    return `${window.location.href.split("#")[0]}#${QUIZ_SHARE_PREFIX}${encoded}`;
  }

  async function copySavedQuizLink() {
    if (!state.savedQuizLink) return;
    try {
      await navigator.clipboard.writeText(state.savedQuizLink);
      state.savedQuizStatus = "Đã sao chép link bài kiểm tra.";
    } catch {
      state.savedQuizStatus = "Không thể tự động sao chép. Hãy chọn link và sao chép thủ công.";
    }
    render();
  }

  function clearCurrentVocabulary() {
    const confirmed = window.confirm(
      "Xóa tất cả từ vựng hiện tại và bắt đầu danh sách mới? Các bài đã lưu sẽ không bị xóa.",
    );
    if (!confirmed) return;
    state.vocabulary = [];
    state.query = "";
    state.form = { term: "", definition: "" };
    state.editingId = null;
    state.bulkText = "";
    state.importSummary = null;
    state.shareLink = "";
    state.shareStatus = "";
    state.quizName = "";
    state.savedQuizLink = "";
    state.quizItems = [];
    state.activeQuizName = "";
    state.questionIndex = 0;
    state.answer = "";
    state.answers = [];
    state.feedback = null;
    state.view = "study";
    saveVocabulary();
    render();
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    })[char]);
  }

  function parseImport(text) {
    const imported = [];
    let skipped = 0;

    text.split(/\r?\n/).forEach((line) => {
      const source = line.trim();
      if (!source) return;

      let match = null;
      SEPARATORS.forEach((separator) => {
        const index = source.indexOf(separator);
        if (index >= 0 && (match === null || index < match.index)) {
          match = { index, separator };
        }
      });

      if (match === null) {
        skipped += 1;
        return;
      }

      const term = source.slice(0, match.index).trim();
      const definition = source.slice(match.index + match.separator.length).trim();
      if (!term || !definition) {
        skipped += 1;
        return;
      }

      imported.push({ id: createId(), term, definition });
    });

    return { imported, skipped };
  }

  function shuffle(items) {
    const copy = [...items];
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [copy[index], copy[randomIndex]] = [copy[randomIndex], copy[index]];
    }
    return copy;
  }

  function setState(updates) {
    Object.assign(state, updates);
    render();
  }

  function filteredVocabulary() {
    const term = state.query.trim().toLowerCase();
    if (!term) return state.vocabulary;
    return state.vocabulary.filter((item) =>
      `${item.term} ${item.definition}`.toLowerCase().includes(term),
    );
  }

  function reviewRows() {
    const rows = [...state.answers];
    if (state.sortMode === "incorrect-first") return rows.sort((a, b) => Number(a.correct) - Number(b.correct));
    if (state.sortMode === "correct-first") return rows.sort((a, b) => Number(b.correct) - Number(a.correct));
    return rows;
  }

  function normalizeAnswer(value) {
    return value.trim().replace(/\s+/g, " ").toLowerCase();
  }

  function stripNotes(value) {
    return value
      .replace(/\([^)]*\)/g, "")
      .replace(/\[[^\]]*\]/g, "")
      .replace(/\{[^}]*\}/g, "")
      .trim();
  }

  function answerVariants(value) {
    const base = value.trim();
    const withoutNotes = stripNotes(base);
    const candidates = new Set([base, withoutNotes]);
    [base, withoutNotes].forEach((source) => {
      source
        .split(/\s*(?:\/|;|\bor\b|\bou\b|\|)\s*/i)
        .map(stripNotes)
        .forEach((candidate) => {
          if (candidate) candidates.add(candidate);
        });
    });
    return [...candidates].map(normalizeAnswer).filter(Boolean);
  }

  function isCorrectAnswer(userAnswer, expectedAnswer) {
    const normalized = normalizeAnswer(userAnswer);
    return answerVariants(expectedAnswer).includes(normalized);
  }

  function getSoundContext() {
    soundContext = soundContext || new (window.AudioContext || window.webkitAudioContext)();
    return soundContext;
  }

  function detectCueRegions(buffer) {
    const channelCount = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const frameSize = 1024;
    const frameCount = Math.ceil(buffer.length / frameSize);
    const levels = [];
    let peak = 0;

    for (let frame = 0; frame < frameCount; frame += 1) {
      const start = frame * frameSize;
      const end = Math.min(buffer.length, start + frameSize);
      let sum = 0;
      let samples = 0;
      for (let channel = 0; channel < channelCount; channel += 1) {
        const data = buffer.getChannelData(channel);
        for (let index = start; index < end; index += 1) {
          sum += Math.abs(data[index]);
          samples += 1;
        }
      }
      const level = samples ? sum / samples : 0;
      peak = Math.max(peak, level);
      levels.push(level);
    }

    const threshold = Math.max(peak * 0.12, 0.012);
    const maxSilentGapFrames = Math.ceil(0.22 * sampleRate / frameSize);
    const rawRegions = [];
    let regionStart = null;
    let silentFrames = 0;

    levels.forEach((level, frame) => {
      if (level >= threshold) {
        if (regionStart === null) regionStart = frame;
        silentFrames = 0;
        return;
      }
      if (regionStart !== null) {
        silentFrames += 1;
        if (silentFrames > maxSilentGapFrames) {
          rawRegions.push({ startFrame: regionStart, endFrame: frame - silentFrames });
          regionStart = null;
          silentFrames = 0;
        }
      }
    });

    if (regionStart !== null) rawRegions.push({ startFrame: regionStart, endFrame: levels.length - 1 });

    return rawRegions
      .map((region) => ({
        start: Math.max(0, (region.startFrame * frameSize) / sampleRate - 0.03),
        end: Math.min(buffer.duration, ((region.endFrame + 1) * frameSize) / sampleRate + 0.05),
      }))
      .filter((region) => region.end - region.start > 0.08);
  }

  async function preloadSound() {
    if (soundLoadPromise) return soundLoadPromise;
    soundLoadPromise = (async () => {
      const context = getSoundContext();
      const response = await fetch(SOUND_SRC);
      const arrayBuffer = await response.arrayBuffer();
      soundBuffer = await context.decodeAudioData(arrayBuffer);
      const regions = detectCueRegions(soundBuffer);
      const midpoint = soundBuffer.duration / 2;
      const firstRegion = regions[0] || { start: 0, end: Math.min(midpoint, soundBuffer.duration) };
      const wrongRegion =
        regions.find((region) => region.start >= midpoint - 0.15) ||
        regions[1] ||
        { start: midpoint, end: soundBuffer.duration };
      soundCues = {
        correct: firstRegion,
        wrong: wrongRegion,
        complete: firstRegion,
      };
    })().catch(() => {
      soundLoadPromise = null;
    });
    return soundLoadPromise;
  }

  async function playQuizSound(kind) {
    await preloadSound();
    if (!soundBuffer || !soundCues) return;
    const context = getSoundContext();
    if (context.state === "suspended") await context.resume();
    const cue = soundCues[kind] || soundCues.correct;
    const source = context.createBufferSource();
    const gain = context.createGain();
    source.buffer = soundBuffer;
    gain.gain.value = 0.9;
    source.connect(gain);
    gain.connect(context.destination);
    source.start(0, cue.start, Math.max(0.08, cue.end - cue.start));
  }

  // Maps BCP-47 lang codes → ResponsiveVoice voice names
  const RV_VOICES = {
    "fr-FR": "French Female",
    "en-US": "US English Female",
    "en-GB": "UK English Female",
    "ja-JP": "Japanese Female",
    "ko-KR": "Korean Female",
    "zh-CN": "Chinese Female",
    "zh-TW": "Traditional Chinese Female",
    "es-ES": "Spanish Female",
    "de-DE": "Deutsch Female",
    "it-IT": "Italian Female",
    "ru-RU": "Russian Female",
    "th-TH": "Thai Female",
    "pt-BR": "Brazilian Portuguese Female",
    "vi-VN": "Vietnamese Female",
  };

  function speak(text, lang) {
    const targetLang = lang || state.ttsLang;
    if (window.responsiveVoice) {
      const voice = RV_VOICES[targetLang] || "US English Female";
      responsiveVoice.speak(text, voice, { rate: 0.9 });
      return;
    }
    // Fallback to Web Speech API if ResponsiveVoice didn't load
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      const tl = targetLang.toLowerCase();
      const voices = window.speechSynthesis.getVoices();
      const voice =
        voices.find(v => v.lang.toLowerCase() === tl) ||
        voices.find(v => v.lang.toLowerCase().startsWith(tl.split("-")[0])) ||
        voices[0];
      if (voice) utterance.voice = voice;
      utterance.lang = targetLang;
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }, 150);
  }

  function submitVocabulary(event) {
    event.preventDefault();
    const term = state.form.term.trim();
    const definition = state.form.definition.trim();
    if (!term || !definition) return;

    if (state.editingId) {
      state.vocabulary = state.vocabulary.map((item) =>
        item.id === state.editingId ? { ...item, term, definition } : item,
      );
    } else {
      state.vocabulary = [{ id: createId(), term, definition }, ...state.vocabulary];
    }
    state.form = { term: "", definition: "" };
    state.editingId = null;
    state.shareLink = "";
    saveVocabulary();
    render();
  }

  function importVocabulary() {
    const parsed = parseImport(state.bulkText);
    if (parsed.imported.length > 0) {
      state.vocabulary = [...parsed.imported, ...state.vocabulary];
      state.bulkText = "";
      state.shareLink = "";
      saveVocabulary();
    }
    state.importSummary = { imported: parsed.imported.length, skipped: parsed.skipped };
    render();
  }

  function selectQuizItems(sourceItems = state.vocabulary, requestedSize = state.quizSize) {
    const custom = Number(state.customSize);
    const size = state.customSize.trim() ? custom : requestedSize;
    const safeSize = Number.isFinite(size) && size > 0 ? Math.floor(size) : requestedSize;
    return weightedSelectItems(sourceItems, Math.min(safeSize, sourceItems.length));
  }

  function generateChoiceOptions(question) {
    const isTermToDef = state.quizDirection !== "def-to-term";
    const correct = isTermToDef ? question.definition : question.term;
    const pool = state.vocabulary
      .filter(item => item.id !== question.id)
      .map(item => isTermToDef ? item.definition : item.term);
    const distractors = shuffle(pool).slice(0, 3);
    return shuffle([correct, ...distractors]);
  }

  function startQuiz(sourceItems = state.vocabulary, requestedSize = state.quizSize, quizName = "") {
    const selected = selectQuizItems(sourceItems, requestedSize);
    if (selected.length === 0) return;
    const updates = {
      quizItems: selected,
      activeQuizName: quizName || "",
      questionIndex: 0,
      answer: "",
      answers: [],
      feedback: null,
      view: "quiz",
      choiceOptions: [],
    };
    if (state.quizMode === "choice" && selected.length > 0) {
      updates.choiceOptions = generateChoiceOptions(selected[0]);
    }
    setState(updates);
  }

  function saveQuizFromItems(name, items) {
    const cleanName = name.trim();
    if (!cleanName || items.length === 0) {
      state.savedQuizStatus = "Hãy đặt tên bài trước khi lưu.";
      render();
      return null;
    }
    const quiz = {
      id: createId(),
      name: cleanName,
      items: items.map(({ term, definition }) => ({ id: createId(), term, definition })),
      createdAt: new Date().toISOString(),
    };
    state.savedQuizzes = [quiz, ...state.savedQuizzes.filter((saved) => saved.name.toLowerCase() !== cleanName.toLowerCase())];
    state.savedQuizStatus = `Đã lưu bài: ${cleanName}.`;
    state.savedQuizLink = "";
    saveSavedQuizzes();
    render();
    return quiz;
  }

  function saveGeneratedQuiz() {
    saveQuizFromItems(state.quizName, state.vocabulary);
  }

  function saveCurrentQuiz() {
    const name = state.quizName || state.activeQuizName;
    saveQuizFromItems(name, state.quizItems);
  }

  function startSavedQuiz(id) {
    const quiz = state.savedQuizzes.find((item) => item.id === id);
    if (!quiz) return;
    state.quizName = quiz.name;
    startQuiz(quiz.items, quiz.items.length, quiz.name);
  }

  async function shareSavedQuiz(id) {
    const quiz = state.savedQuizzes.find((item) => item.id === id);
    if (!quiz) return;
    const longUrl = createQuizShareLink(quiz);
    state.savedQuizLink = "";
    state.savedQuizStatus = "Đang rút gọn link…";
    render();
    const short = await shortenUrl(longUrl);
    state.savedQuizLink = short;
    state.savedQuizStatus = short !== longUrl
      ? `Đã rút gọn link cho ${quiz.name}.`
      : `Đã tạo link cho ${quiz.name}.`;
    render();
  }

  function deleteSavedQuiz(id) {
    state.savedQuizzes = state.savedQuizzes.filter((item) => item.id !== id);
    state.savedQuizLink = "";
    saveSavedQuizzes();
    render();
  }

  function submitAnswer(skipped) {
    const currentQuestion = state.quizItems[state.questionIndex];
    if (!currentQuestion || state.feedback) return;
    const normalized = skipped ? "" : state.answer.trim();
    const expectedAnswer = state.quizDirection === "def-to-term" ? currentQuestion.definition : currentQuestion.term;
    const correct = !skipped && isCorrectAnswer(normalized, expectedAnswer);
    state.answers = [...state.answers, { item: currentQuestion, answer: normalized, correct, skipped }];
    state.feedback = correct ? "correct" : "incorrect";
    playQuizSound(correct ? "correct" : "wrong");
    render();
  }

  function nextQuestion() {
    if (state.questionIndex + 1 >= state.quizItems.length) {
      updatePerformance(state.answers);
      playQuizSound("complete");
      setState({ view: "results", feedback: null, answer: "" });
      return;
    }
    const nextIndex = state.questionIndex + 1;
    const updates = { questionIndex: nextIndex, answer: "", feedback: null };
    if (state.quizMode === "choice") {
      updates.choiceOptions = generateChoiceOptions(state.quizItems[nextIndex]);
    }
    setState(updates);
  }

  function retryIncorrect() {
    const incorrectItems = state.answers.filter((item) => !item.correct).map((item) => item.item);
    startQuiz(incorrectItems, incorrectItems.length);
  }

  function exportVocabulary() {
    if (state.vocabulary.length === 0) return;
    const lines = state.vocabulary.map(item => `${item.term} - ${item.definition}`);
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "vocabulary.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function renderStudy() {
    const rows = filteredVocabulary();
    const perf = loadPerformance();
    return `
      ${state.vocabulary.length === 0 ? `
        <section class="empty-state">
          <h2>Chưa có từ vựng.</h2>
          <p>Thêm từ hoặc nhập danh sách để bắt đầu.</p>
        </section>
      ` : ""}

      <section class="grid two-columns">
        <form class="card stack" data-action="vocab-form">
          <h2>${state.editingId ? "Chỉnh sửa từ vựng" : "Thêm từ vựng"}</h2>
          <label>
            <span>Từ cần học</span>
            <input data-field="term" value="${escapeHtml(state.form.term)}" />
          </label>
          <label>
            <span>Nghĩa</span>
            <input data-field="definition" value="${escapeHtml(state.form.definition)}" />
          </label>
          <div class="button-row">
            <button class="primary-button" type="submit">${state.editingId ? "Lưu" : "Thêm"}</button>
            ${state.editingId ? `<button class="secondary-button" type="button" data-action="cancel-edit">Hủy</button>` : ""}
          </div>
        </form>

        <section class="card stack">
          <h2>Nhập hàng loạt</h2>
          <textarea rows="8" data-field="bulk" placeholder="bonjour = xin chào&#10;merci: cảm ơn&#10;apprendre -> học&#10;manger | ăn">${escapeHtml(state.bulkText)}</textarea>
          <button class="primary-button" type="button" data-action="import">Nhập</button>
          ${state.importSummary ? `<p class="summary" aria-live="polite">Imported: ${state.importSummary.imported} · Skipped: ${state.importSummary.skipped}</p>` : ""}
          <button class="secondary-button" type="button" data-action="clear-vocabulary" ${state.vocabulary.length === 0 ? "disabled" : ""}>Xóa danh sách hiện tại</button>
        </section>
      </section>

      <section class="card stack">
        <div class="section-head">
          <h2>Chia sẻ từ vựng</h2>
          <div class="button-row">
            <button class="primary-button" type="button" data-action="create-share" ${state.vocabulary.length === 0 ? "disabled" : ""}>Tạo link chia sẻ</button>
            <button class="secondary-button" type="button" data-action="export" ${state.vocabulary.length === 0 ? "disabled" : ""}>Xuất .txt</button>
          </div>
        </div>
        ${state.shareLink ? `
          <label>
            <span>Link chia sẻ danh sách</span>
            <input readonly data-field="share-link" value="${escapeHtml(state.shareLink)}" />
          </label>
          <button class="secondary-button" type="button" data-action="copy-share">Sao chép link</button>
        ` : ""}
        ${state.shareStatus ? `<p class="summary" aria-live="polite">${escapeHtml(state.shareStatus)}</p>` : ""}
      </section>

      <section class="card stack">
        <div class="section-head">
          <h2>Từ vựng</h2>
          <input class="search-input" data-field="query" value="${escapeHtml(state.query)}" placeholder="Tìm kiếm..." />
        </div>
        <div class="table-wrap">
          <table>
            <thead>
              <tr><th>Từ cần học</th><th>Nghĩa</th><th>Thao tác</th></tr>
            </thead>
            <tbody>
              ${rows.map((item) => `
                <tr>
                  <td>
                    ${escapeHtml(item.term)}
                    ${(() => { const d = perf[perfKey(item)]; if (!d || d.attempts === 0) return ''; const acc = d.correct/d.attempts; const lvl = acc >= 0.8 ? 'strong' : acc >= 0.5 ? 'weak' : 'struggling'; return `<span class="perf-dot perf-${lvl}" title="${d.correct}/${d.attempts} correct"></span>`; })()}
                    <button class="speak-btn" type="button" data-action="speak" data-text="${escapeHtml(item.term)}" data-lang="${escapeHtml(state.ttsLang)}" title="Nghe phát âm">🔊</button>
                  </td>
                  <td>${escapeHtml(item.definition)}</td>
                  <td class="actions">
                    <button class="text-button" type="button" data-action="edit" data-id="${item.id}">Sửa</button>
                    <button class="text-button danger" type="button" data-action="delete" data-id="${item.id}">Xóa</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </section>

      <section class="card stack quiz-builder">
        <h2>Tạo bài kiểm tra</h2>
        <label>
          <span>Tên bài</span>
          <input data-field="quiz-name" value="${escapeHtml(state.quizName)}" placeholder="Ví dụ: Chủ đề 1, Tuần 3..." />
        </label>
        <div class="size-options">
          <button class="${state.quizDirection === "term-to-def" ? "selected" : ""}" type="button" data-action="direction" data-dir="term-to-def">Nghĩa → Từ</button>
          <button class="${state.quizDirection === "def-to-term" ? "selected" : ""}" type="button" data-action="direction" data-dir="def-to-term">Từ → Nghĩa</button>
        </div>
        <div class="size-options">
          <button class="${state.quizMode === 'type' ? 'selected' : ''}" type="button" data-action="mode" data-mode="type">Gõ đáp án</button>
          <button class="${state.quizMode === 'choice' ? 'selected' : ''}" type="button" data-action="mode" data-mode="choice">Trắc nghiệm</button>
        </div>
        <div class="size-options">
          ${QUIZ_SIZES.map((size) => `
            <button class="${state.quizSize === size && !state.customSize ? "selected" : ""}" type="button" data-action="size" data-size="${size}">
              ${size} câu
            </button>
          `).join("")}
          <label class="custom-size">
            <span>Tùy chỉnh</span>
            <input type="number" min="1" data-field="custom-size" value="${escapeHtml(state.customSize)}" />
          </label>
        </div>
        <label>
          <span>Ngôn ngữ đang học</span>
          <select data-field="tts-lang">
            ${[
              ["fr-FR", "🇫🇷 Tiếng Pháp"],
              ["en-US", "🇺🇸 Tiếng Anh (Mỹ)"],
              ["en-GB", "🇬🇧 Tiếng Anh (Anh)"],
              ["ja-JP", "🇯🇵 Tiếng Nhật"],
              ["ko-KR", "🇰🇷 Tiếng Hàn"],
              ["zh-CN", "🇨🇳 Tiếng Trung (Giản thể)"],
              ["zh-TW", "🇹🇼 Tiếng Trung (Phồn thể)"],
              ["es-ES", "🇪🇸 Tiếng Tây Ban Nha"],
              ["de-DE", "🇩🇪 Tiếng Đức"],
              ["it-IT", "🇮🇹 Tiếng Ý"],
              ["ru-RU", "🇷🇺 Tiếng Nga"],
              ["th-TH", "🇹🇭 Tiếng Thái"],
              ["pt-BR", "🇧🇷 Tiếng Bồ Đào Nha"],
            ].map(([code, label]) => `<option value="${code}" ${state.ttsLang === code ? "selected" : ""}>${label}</option>`).join("")}
          </select>
        </label>
        <div class="button-row">
          <button class="primary-button large-button" type="button" data-action="start-quiz" ${state.vocabulary.length === 0 ? "disabled" : ""}>Bắt đầu</button>
          <button class="secondary-button large-button" type="button" data-action="save-generated-quiz" ${state.vocabulary.length === 0 ? "disabled" : ""}>Lưu bài</button>
          <button class="secondary-button large-button" type="button" data-action="clear-vocabulary" ${state.vocabulary.length === 0 ? "disabled" : ""}>Danh sách mới</button>
        </div>
        ${state.vocabulary.length > 0 ? `<p class="summary">Nếu số câu lớn hơn danh sách, tất cả ${state.vocabulary.length} từ sẽ được dùng.</p>` : ""}
      </section>

      <section class="card stack">
        <div class="section-head">
          <h2>Bài kiểm tra đã lưu</h2>
          <span class="summary">${state.savedQuizzes.length} đã lưu</span>
        </div>
        ${state.savedQuizzes.length === 0 ? `
          <p class="summary">Chưa có bài nào được lưu. Đặt tên và lưu bài, hoặc lưu từ màn hình kết quả.</p>
        ` : `
          <div class="saved-quiz-list">
            ${state.savedQuizzes.map((quiz) => `
              <article class="saved-quiz-item">
                <div>
                  <h3>${escapeHtml(quiz.name)}</h3>
                  <p class="summary">${quiz.items.length} câu</p>
                </div>
                <div class="button-row">
                  <button class="primary-button" type="button" data-action="start-saved-quiz" data-id="${quiz.id}">Bắt đầu</button>
                  <button class="secondary-button" type="button" data-action="share-saved-quiz" data-id="${quiz.id}">Chia sẻ</button>
                  <button class="text-button danger" type="button" data-action="delete-saved-quiz" data-id="${quiz.id}">Xóa</button>
                </div>
              </article>
            `).join("")}
          </div>
        `}
        ${state.savedQuizLink ? `
          <label>
            <span>Link bài kiểm tra</span>
            <input readonly data-field="saved-quiz-link" value="${escapeHtml(state.savedQuizLink)}" />
          </label>
          <button class="secondary-button" type="button" data-action="copy-saved-quiz">Sao chép link</button>
        ` : ""}
        ${state.savedQuizStatus ? `<p class="summary" aria-live="polite">${escapeHtml(state.savedQuizStatus)}</p>` : ""}
      </section>
    `;
  }

  function renderQuiz() {
    const currentQuestion = state.quizItems[state.questionIndex];
    const progressPercent = state.quizItems.length ? Math.round((state.answers.length / state.quizItems.length) * 100) : 0;
    const latest = state.answers[state.answers.length - 1];
    const isTermToDef = state.quizDirection !== "def-to-term";
    const prompt = isTermToDef ? currentQuestion.definition : currentQuestion.term;
    const promptLabel = isTermToDef ? "Nghĩa:" : "Từ cần học:";
    const fullAnswer = isTermToDef ? currentQuestion.term : currentQuestion.definition;
    const isChoiceMode = state.quizMode === "choice";
    const correctAnswer = isTermToDef ? currentQuestion.term : currentQuestion.definition;

    return `
      <section class="quiz-screen card">
        <div class="quiz-progress">
          <p>${state.activeQuizName ? `${escapeHtml(state.activeQuizName)} · ` : ""}Câu ${state.questionIndex + 1} / ${state.quizItems.length}</p>
          <strong>${progressPercent}%</strong>
          <div class="progress-track" aria-label="${progressPercent}% complete"><span style="width: ${progressPercent}%"></span></div>
        </div>
        <button class="secondary-button clear-quiz-button" type="button" data-action="clear-vocabulary">Xóa và bắt đầu lại</button>

        <div class="question-block">
          <span>${escapeHtml(promptLabel)}</span>
          <div class="question-word-row">
            <h1>${escapeHtml(prompt)}</h1>
            ${!isTermToDef ? `<button class="speak-btn" type="button" data-action="speak" data-text="${escapeHtml(currentQuestion.term)}" data-lang="${escapeHtml(state.ttsLang)}" title="Nghe phát âm">🔊</button>` : ""}
          </div>
        </div>

        ${isChoiceMode ? `
          <div class="choice-options">
            ${state.choiceOptions.map(option => {
              let cls = "choice-btn";
              if (state.feedback) {
                if (option === correctAnswer) cls += " choice-correct";
                else if (option === (latest && latest.answer)) cls += " choice-wrong";
              }
              return `<button class="${cls}" type="button" data-action="choose" data-choice="${escapeHtml(option)}" ${state.feedback ? "disabled" : ""}>${escapeHtml(option)}</button>`;
            }).join("")}
          </div>
        ` : `
          <label class="answer-label">
            <span>Trả lời:</span>
            <input data-field="answer" value="${escapeHtml(state.answer)}" ${state.feedback ? "disabled" : ""} autocorrect="off" autocapitalize="off" spellcheck="false" autofocus />
          </label>

          ${!state.feedback ? `
            <div class="button-row">
              <button class="primary-button large-button" type="button" data-action="submit-answer">Gửi</button>
              <button class="secondary-button large-button" type="button" data-action="skip-answer">Bỏ qua</button>
            </div>
          ` : ""}
        `}

        ${state.feedback ? `
          <section class="feedback ${state.feedback}">
            <h2>${state.feedback === "correct" ? "✅ Đúng rồi!" : "❌ Sai rồi"}</h2>
            ${state.feedback === "incorrect" ? `
              <p>Câu trả lời của bạn: ${escapeHtml(latest && latest.answer ? latest.answer : "Skipped")}</p>
            ` : ""}
            <div class="feedback-answer-row">
              <p>Đáp án đúng: <strong>${escapeHtml(fullAnswer)}</strong></p>
              ${isTermToDef ? `<button class="speak-btn" type="button" data-action="speak" data-text="${escapeHtml(currentQuestion.term)}" data-lang="${escapeHtml(state.ttsLang)}" title="Nghe phát âm">🔊</button>` : ""}
            </div>
            <p class="summary">Nhấn Enter để tiếp tục</p>
            <button class="primary-button large-button" type="button" data-action="continue">Tiếp tục</button>
          </section>
        ` : ""}
      </section>
    `;
  }

  function renderResults() {
    const incorrectAnswers = state.answers.filter((item) => !item.correct);
    const correctCount = state.answers.length - incorrectAnswers.length;
    const accuracy = state.answers.length ? Math.round((correctCount / state.answers.length) * 100) : 0;

    return `
      <section class="card stack">
        <div class="results-head">
          <h1>${state.activeQuizName ? `${escapeHtml(state.activeQuizName)} – Hoàn thành!` : "Hoàn thành!"}</h1>
          <div class="results-grid">
            <p>Đúng: ${correctCount}</p>
            <p>Sai: ${incorrectAnswers.length}</p>
            <p>Độ chính xác: ${accuracy}%</p>
          </div>
        </div>

        <section class="save-completed">
          <label>
            <span>Lưu bài kiểm tra</span>
            <input data-field="quiz-name" value="${escapeHtml(state.quizName || state.activeQuizName)}" placeholder="Đặt tên cho bài..." />
          </label>
          <button class="secondary-button" type="button" data-action="save-current-quiz">Lưu bài này</button>
          ${state.savedQuizStatus ? `<p class="summary" aria-live="polite">${escapeHtml(state.savedQuizStatus)}</p>` : ""}
        </section>

        <div class="section-head">
          <h2>Xem lại</h2>
          <select data-field="sort-mode">
            <option value="incorrect-first" ${state.sortMode === "incorrect-first" ? "selected" : ""}>Sai trước</option>
            <option value="correct-first" ${state.sortMode === "correct-first" ? "selected" : ""}>Đúng trước</option>
            <option value="all" ${state.sortMode === "all" ? "selected" : ""}>Theo thứ tự</option>
          </select>
        </div>

        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>${state.quizDirection === "def-to-term" ? "Từ cần học" : "Nghĩa"}</th>
                <th>Câu trả lời</th>
                <th>Đáp án đúng</th>
                <th>Kết quả</th>
              </tr>
            </thead>
            <tbody>
              ${reviewRows().map((row) => {
                const isTermToDef = state.quizDirection !== "def-to-term";
                const questionShown = isTermToDef ? row.item.definition : row.item.term;
                const correctAnswer = isTermToDef ? row.item.term : row.item.definition;
                return `
                  <tr class="${row.correct ? "correct-row" : "incorrect-row"}">
                    <td>${escapeHtml(questionShown)}</td>
                    <td>${escapeHtml(row.answer || "Skipped")}</td>
                    <td>
                      ${escapeHtml(correctAnswer)}
                      ${isTermToDef ? `<button class="speak-btn" type="button" data-action="speak" data-text="${escapeHtml(row.item.term)}" data-lang="${escapeHtml(state.ttsLang)}" title="Nghe">🔊</button>` : ""}
                    </td>
                    <td>${row.correct ? "Đúng" : "Sai"}</td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>

        <div class="button-row">
          <button class="primary-button large-button" type="button" data-action="retry" ${incorrectAnswers.length === 0 ? "disabled" : ""}>Làm lại câu sai</button>
          <button class="secondary-button large-button" type="button" data-action="study">Về từ vựng</button>
        </div>
      </section>
    `;
  }

  function render() {
    root.innerHTML = `
      <main class="app-shell">
        <header class="topbar">
          <button class="brand" type="button" data-action="study">Luyện Từ Vựng</button>
          <div class="topbar-actions">
            <button class="secondary-button" type="button" data-action="study">Từ vựng</button>
            <button class="secondary-button" type="button" data-action="clear-vocabulary" ${state.vocabulary.length === 0 ? "disabled" : ""}>Bài mới</button>
          </div>
        </header>
        ${state.view === "quiz" ? renderQuiz() : state.view === "results" ? renderResults() : renderStudy()}
      </main>
    `;
    bindEvents();
  }

  function bindEvents() {
    root.querySelectorAll("[data-field]").forEach((element) => {
      element.addEventListener("input", (event) => {
        const field = event.currentTarget.dataset.field;
        const value = event.currentTarget.value;
        if (field === "term") state.form.term = value;
        if (field === "definition") state.form.definition = value;
        if (field === "bulk") state.bulkText = value;
        if (field === "query") state.query = value;
        if (field === "custom-size") state.customSize = value;
        if (field === "answer") state.answer = value;
        if (field === "quiz-name") state.quizName = value;
        if (field === "tts-lang") {
          state.ttsLang = value;
          try { localStorage.setItem(TTS_LANG_KEY, value); } catch {}
        }
      });

      element.addEventListener("change", (event) => {
        const field = event.currentTarget.dataset.field;
        if (field === "sort-mode") setState({ sortMode: event.currentTarget.value });
        if (field === "tts-lang") {
          state.ttsLang = event.currentTarget.value;
          try { localStorage.setItem(TTS_LANG_KEY, event.currentTarget.value); } catch {}
          render();
        }
      });
    });

    const form = root.querySelector("[data-action='vocab-form']");
    if (form) form.addEventListener("submit", submitVocabulary);

    const answerInput = root.querySelector("[data-field='answer']");
    if (answerInput) {
      answerInput.focus();
      answerInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          submitAnswer(false);
        }
      });
    }

    root.querySelectorAll("[data-action]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const action = event.currentTarget.dataset.action;
        const id = event.currentTarget.dataset.id;
        if (action === "study") setState({ view: "study" });
        if (action === "cancel-edit") setState({ form: { term: "", definition: "" }, editingId: null });
        if (action === "import") importVocabulary();
        if (action === "edit") {
          const item = state.vocabulary.find((entry) => entry.id === id);
          if (item) setState({ editingId: item.id, form: { term: item.term, definition: item.definition } });
        }
        if (action === "delete") {
          state.vocabulary = state.vocabulary.filter((entry) => entry.id !== id);
          state.shareLink = "";
          saveVocabulary();
          render();
        }
        if (action === "create-share") createShareLink();
        if (action === "copy-share") copyShareLink();
        if (action === "copy-saved-quiz") copySavedQuizLink();
        if (action === "clear-vocabulary") clearCurrentVocabulary();
        if (action === "size") setState({ quizSize: Number(event.currentTarget.dataset.size), customSize: "" });
        if (action === "direction") setState({ quizDirection: event.currentTarget.dataset.dir });
        if (action === "mode") setState({ quizMode: event.currentTarget.dataset.mode });
        if (action === "speak") {
          speak(event.currentTarget.dataset.text, event.currentTarget.dataset.lang);
          const answerInput = root.querySelector("[data-field='answer']");
          if (answerInput && !state.feedback) answerInput.focus();
        }
        if (action === "choose") {
          state.answer = event.currentTarget.dataset.choice;
          submitAnswer(false);
        }
        if (action === "export") exportVocabulary();
        if (action === "start-quiz") startQuiz(state.vocabulary, state.quizSize, state.quizName.trim());
        if (action === "save-generated-quiz") saveGeneratedQuiz();
        if (action === "save-current-quiz") saveCurrentQuiz();
        if (action === "start-saved-quiz") startSavedQuiz(id);
        if (action === "share-saved-quiz") shareSavedQuiz(id);
        if (action === "delete-saved-quiz") deleteSavedQuiz(id);
        if (action === "submit-answer") submitAnswer(false);
        if (action === "skip-answer") submitAnswer(true);
        if (action === "continue") nextQuestion();
        if (action === "retry") retryIncorrect();
      });
    });
  }

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Enter" &&
      state.view === "quiz" &&
      state.feedback !== null &&
      !event.target.matches("[data-field='answer']")
    ) {
      event.preventDefault();
      nextQuestion();
    }
  });

  render();
})();
