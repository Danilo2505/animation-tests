/**
 * Aplica o efeito de máquina de escrever em um elemento.
 *
 * Modos de uso:
 *  - Escrita simples (erase = false)
 *  - Escrita + apagar (erase = true)
 *  - Apenas apagar o texto atual (eraseOnly = true)
 *
 * Recursos:
 *  - Loop opcional
 *  - Controle externo (pause, resume, stop)
 *  - Cursor visual com piscar configurável
 */
async function effectTypewriter({
  selector,
  text = "",
  speedMS = 120, // velocidade padrão (~8 caracteres/s)
  initialText = "",
  cursor = true,
  cursorBlink = true,
  cursorBlinkSpeedMS = 600,
  loop = false,
  delayStart = 0,
  delayEnd = 1000,
  erase = false,
  eraseOnly = false,
  onFinish = null,
}) {
  // --- Busca o elemento alvo no DOM ---
  const element = document.querySelector(selector);
  if (!element) return;

  // --- Estado de controle externo ---
  let paused = false;
  let stopped = false;

  const controls = {
    pause: () => (paused = true),
    resume: () => (paused = false),
    stop: () => (stopped = true),
    get isPaused() {
      return paused;
    },
    get isStopped() {
      return stopped;
    },
  };

  // --- Configuração do cursor ---
  const hadCursorBefore = element.classList.contains("with-cursor");

  if (cursor && !hadCursorBefore) {
    element.classList.add("with-cursor");

    // Define velocidade do piscar ou desativa totalmente
    const blinkSpeed = cursorBlink ? `${cursorBlinkSpeedMS}ms` : "0ms";
    element.style.setProperty("--cursor-blink-speed", blinkSpeed);
  }

  // --- Delay inicial antes de começar ---
  await delay(delayStart);

  // --- Loop principal ---
  do {
    // --- Caso 1: Apenas apagar texto existente ---
    if (eraseOnly) {
      const currentLength = element.textContent.length;
      for (let i = currentLength; i > 0; i--) {
        while (paused && !stopped) await delay(100);
        if (stopped) break;

        element.textContent = element.textContent.slice(0, -1);
        await delay(speedMS);
      }

      if (stopped) break;
      if (loop) await delay(delayEnd);
      continue; // volta ao início do loop
    }

    // --- Caso 2: Escrita normal ---
    element.textContent = initialText;

    for (let i = 0; i < text.length; i++) {
      while (paused && !stopped) await delay(100);
      if (stopped) break;

      element.textContent += text[i];
      await delay(speedMS);
    }

    if (stopped) break;

    // Espera antes de apagar (ou reiniciar)
    await delay(delayEnd);

    // --- Caso 3: Escrever e apagar ---
    if (erase) {
      for (let i = text.length; i > 0; i--) {
        while (paused && !stopped) await delay(100);
        if (stopped) break;

        element.textContent = element.textContent.slice(0, -1);
        await delay(speedMS);
      }

      if (stopped) break;
    }

    // Espera antes de repetir, se loop estiver ativo
    if (loop) await delay(delayEnd);
  } while (loop && !stopped);

  // --- Limpeza do cursor ---
  if (cursor && !hadCursorBefore) {
    element.classList.remove("with-cursor");
    element.style.removeProperty("--cursor-blink-speed");
  }

  // --- Callback final ---
  if (onFinish) await onFinish();

  // --- Retorna os controles externos ---
  return controls;
}

// Instancia os Componentes
const topBar = new ComponentTopBar();
const settingsPanel = new ComponentSettingsPanel();

/**
 * Showcase: demonstra todas as funções do effectTypewriter
 * - Escrita simples
 * - Escrita + apagar
 * - Apenas apagar
 * - Loop
 * - Controle externo (pause, resume, stop)
 * - Cursor com e sem piscar
 */
async function showcase() {
  // 1️⃣ Escrita simples
  await effectTypewriter({
    selector: ".texto-1",
    text: "Efeito 1: Escrita simples.",
    speedMS: 80,
  });

  // 2️⃣ Escrita + apagar
  await effectTypewriter({
    selector: ".texto-2",
    text: "Efeito 2: Escreve e apaga.",
    erase: true,
    speedMS: 80,
    delayEnd: 800,
  });

  // 3️⃣ Apenas apagar
  const el3 = document.querySelector(".texto-3");
  el3.textContent = "Efeito 3: Apenas apagar.";
  await delay(800);
  await effectTypewriter({
    selector: ".texto-3",
    eraseOnly: true,
    speedMS: 60,
  });

  // 4️⃣ Loop
  const loopControls = await effectTypewriter({
    selector: ".texto-4",
    text: "Efeito 4: Loop infinito.",
    erase: true,
    loop: true,
    speedMS: 80,
    delayEnd: 600,
  });

  // Para mostrar o controle externo, pausa e retoma
  await delay(2500);
  loopControls.pause();
  const el4 = document.querySelector(".texto-4");
  el4.textContent += " (pausado)";
  await delay(1500);
  el4.textContent = el4.textContent.replace(" (pausado)", "");
  loopControls.resume();

  // Para não ficar infinito, para o loop depois de alguns segundos
  await delay(5000);
  loopControls.stop();

  // 5️⃣ Cursor sem piscar
  await effectTypewriter({
    selector: ".texto-5",
    text: "Efeito 5: Cursor fixo (sem piscar).",
    cursorBlink: false,
    speedMS: 80,
  });
}

showcase();
