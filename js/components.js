// ----- Top Bar Expand Manager -----
const TopBarExpandManager = {
  // Ativa ou desativa a exibição das opções da Top Bar
  defineState(show, button) {
    const topBar = document.querySelector("#header-top-bar");

    if (show) {
      topBar.setAttribute("show-top-bar-options", "true");
    } else {
      topBar.removeAttribute("show-top-bar-options");
    }

    // Atualiza o ícone do botão
    if (button) {
      const downSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
      </svg>`;
      const upSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1.646 11.354a.5.5 0 0 0 .708 0L8 5.707l5.646 5.647a.5.5 0 0 0 .708-.708l-6-6a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 0 .708"/>
      </svg>`;

      button.innerHTML = show ? upSvg : downSvg;
    }

    // Salva no localStorage
    localStorage.setItem("showTopBarOptions", show ? "true" : "false");
  },

  // Alterna o estado atual
  toggle(button) {
    const current = localStorage.getItem("showTopBarOptions") === "true";
    this.defineState(!current, button);
  },

  // Inicializa de acordo com o valor salvo
  init(button) {
    const saved = localStorage.getItem("showTopBarOptions") === "true";
    this.defineState(saved, button);
  },
};

// ----- Top Bar -----
class ComponentTopBar {
  constructor() {
    // --- Referências principais ---
    this.divTopSpacer = document.querySelector("#div-top-spacer");
    this.topBar = document.querySelector("#header-top-bar");
    this.buttonExpandCollapse = null;

    // --- Configurações ---
    this.threshold = 15;
    this.visible = false;
    this.lastY = Infinity;
    this.hideTimeout = null;

    // --- Carrega o componente no HTML ---
    this.loadContent();

    // --- Inicializa referências e eventos ---
    this.initReferences();
    this.initEvents();

    // --- Reset de expansão no carregamento ---
    TopBarExpandManager.defineState(false, this.buttonExpandCollapse);
  }

  initReferences() {
    this.buttonExpandCollapse = this.topBar.querySelector(
      "#button-expand-collapse"
    );
  }

  // Carrega o conteúdo da Top Bar
  loadContent() {
    const div = document.createElement("div");
    const a1 = document.createElement("a");
    const buttonSettings = document.createElement("button");
    const buttonExpandCollapse = document.createElement("button");

    a1.innerText = "Início";
    a1.href = "/index.html";

    buttonSettings.id = "button-settings";
    buttonSettings.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-fill" viewBox="0 0 16 16">
  <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"/>
</svg>`;

    buttonExpandCollapse.id = "button-expand-collapse";
    buttonExpandCollapse.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
</svg>`;

    div.appendChild(a1);
    div.appendChild(buttonSettings);
    this.topBar.appendChild(div);

    this.topBar.appendChild(buttonExpandCollapse);
  }

  // Define os Event Listeners
  initEvents() {
    const scrollY = window.scrollY;

    // --- Mostra a Top Bar se a página estiver no topo ---
    if (scrollY <= 50) {
      // 50px do topo, ajuste se necessário
      this.showBar();
    }

    // Detecta movimento do mouse
    window.addEventListener("mousemove", (e) => {
      this.lastY = e.clientY;

      if (e.clientY <= this.threshold) {
        this.showBar();
        return;
      }

      // Se o ponteiro estiver longe do topo e a barra estiver visível, agendar esconder
      if (this.visible) {
        if (this.hideTimeout) clearTimeout(this.hideTimeout);
        this.hideTimeout = setTimeout(() => {
          if (this.lastY > this.threshold + 20) this.hideBar();
        }, 300);
      }
    });

    // Mostrar ao rolar para cima
    let lastScrollY = window.scrollY;
    window.addEventListener(
      "scroll",
      () => {
        const curr = window.scrollY;

        // --- Mostra a Top Bar se estiver rolando para cima ---
        if (curr < lastScrollY) {
          this.showBar();
          if (this.hideTimeout) clearTimeout(this.hideTimeout);
          this.hideTimeout = setTimeout(() => this.hideBar(), 1500);
        }

        // --- Mostra a Top Bar se estiver próximo ao topo (scroll baixo) ---
        if (curr <= 50) {
          // 50px do topo, pode ajustar
          this.showBar();
        }

        lastScrollY = curr;
      },
      { passive: true }
    );

    // Teclado: ESC fecha
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.hideBar();
    });

    // Foco dentro/fora da barra
    this.topBar.addEventListener("focusin", () => this.showBar());
    this.topBar.addEventListener("focusout", () => {
      setTimeout(() => {
        if (!this.topBar.contains(document.activeElement)) this.hideBar();
      }, 120);
    });

    // Toque no topo em dispositivos touch
    window.addEventListener(
      "touchstart",
      (e) => {
        const touch = e.touches[0];
        if (touch && touch.clientY <= this.threshold) {
          this.showBar();
        }
      },
      { passive: true }
    );

    // --- Dentro do initEvents() do ComponentTopBar ---
    const buttonExpandCollapse = this.topBar.querySelector(
      "#button-expand-collapse"
    );
    buttonExpandCollapse.addEventListener("click", () => {
      TopBarExpandManager.toggle(buttonExpandCollapse);
    });

    // Inicializa o estado salvo
    TopBarExpandManager.init(buttonExpandCollapse);
  }

  // Mostra a Top Bar
  showBar() {
    if (!this.visible) {
      this.visible = true;
      this.topBar.classList.add("show");
      this.divTopSpacer.style.setProperty(
        "margin-top",
        `${
          this.topBar.clientHeight +
          Number(
            window
              .getComputedStyle(this.topBar, "::after")
              .height.replaceAll("px", "")
          )
        }px`
      );
    }

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  // Esconde a Top Bar
  hideBar() {
    if (this.visible) {
      this.visible = false;
      this.topBar.classList.remove("show");
      this.divTopSpacer.style.removeProperty("margin-top");

      // --- Atualiza o estado de expansão ao esconder ---
      if (this.topBar.hasAttribute("show-top-bar-options")) {
        this.topBar.removeAttribute("show-top-bar-options");
        localStorage.setItem("showTopBarOptions", "false");
      }

      // Se estiver usando o botão, também pode atualizar o ícone
      if (this.buttonExpandCollapse) {
        const downSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
        <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
      </svg>`;
        this.buttonExpandCollapse.innerHTML = downSvg;
      }
    }
  }
}

// ----- Audio Player -----
class ComponentAudioPlayer {
  constructor() {
    // --- Referências principais ---
    this.audioPlayer = document.querySelector("#div-audio-player");

    // --- Carrega o componente no HTML ---
    this.loadContent();

    this.buttonBack = this.audioPlayer.querySelector("#button-back");
    this.buttonPlayPause = this.audioPlayer.querySelector("#button-play-pause");
    this.buttonNext = this.audioPlayer.querySelector("#button-next");
    this.audio = document.querySelector("#audio-from-audio-player");
    this.coverImg = document.querySelector("#div-audio-player .img-song-cover");

    this.audioIndex = 0;
    this.songs = [
      "../../assets/media/audio/Second Wind - Matt Pridgyn.mp3",
      "../../assets/media/audio/Rewind - More Plastic.mp3",
      "../../assets/media/audio/The Flow of Time - Alex Cristoforetti.mp3",
    ];

    // --- Event Listeners ---
    this.initEvents();
  }

  // Cria o conteúdo do Player (imagem, botões e áudio)
  loadContent() {
    // --- Capa da Música ---
    // Cria imagem
    const img = document.createElement("img");
    img.classList.add("img-song-cover");
    img.src = "assets/media/images/song-not-found.jpg";
    img.alt = "";

    // --- Informações da Música ---
    // Cria container dos botões
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("div-song-info");

    // Nome e Artista da Música
    const title = document.createElement("span");
    const artist = document.createElement("span");

    title.classList.add("span-song-title");
    artist.classList.add("span-song-artist");

    // --- Botões de Controle ---
    // Cria container dos botões
    const controlsDiv = document.createElement("div");
    controlsDiv.classList.add("div-song-controls");

    // - Botão Voltar -
    const buttonBack = document.createElement("button");
    buttonBack.id = "button-back";
    buttonBack.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-skip-start-fill" viewBox="0 0 16 16">
  <path d="M4 4a.5.5 0 0 1 1 0v3.248l6.267-3.636c.54-.313 1.232.066 1.232.696v7.384c0 .63-.692 1.01-1.232.697L5 8.753V12a.5.5 0 0 1-1 0z"/>
</svg>`;

    // - Botão Play/Pause -
    const buttonPlayPause = document.createElement("button");
    buttonPlayPause.id = "button-play-pause";
    buttonPlayPause.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
    </svg>`;

    // - Botão Próximo -
    const buttonNext = document.createElement("button");
    buttonNext.id = "button-next";
    buttonNext.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-skip-end-fill" viewBox="0 0 16 16">
  <path d="M12.5 4a.5.5 0 0 0-1 0v3.248L5.233 3.612C4.693 3.3 4 3.678 4 4.308v7.384c0 .63.692 1.01 1.233.697L11.5 8.753V12a.5.5 0 0 0 1 0z"/>
</svg>`;

    // --- Áudio ---
    // Cria o áudio
    const audio = document.createElement("audio");
    audio.id = "audio-from-audio-player";

    // --- Adicionar Elementos ---
    // Adiciona as informações
    infoDiv.append(title, artist);

    // Adiciona os botões
    controlsDiv.append(buttonBack, buttonPlayPause, buttonNext);

    // Adiciona tudo ao container principal
    this.audioPlayer.append(img, infoDiv, controlsDiv, audio);
  }

  async loadSongMetadata() {
    try {
      // Tenta ler o áudio
      jsmediatags.read(this.audio.src, {
        onSuccess: function (tag) {
          // --- Capa ---
          const coverImg = document.querySelector(
            "#div-audio-player .img-song-cover"
          );
          const image = tag.tags.picture;

          if (image) {
            const bytes = new Uint8Array(image.data);
            const blob = new Blob([bytes], { type: image.format });
            const reader = new FileReader();

            reader.onload = (e) => {
              coverImg.src = e.target.result; // já vira dataURL automaticamente
            };

            reader.readAsDataURL(blob);
          } else {
            coverImg.src = "assets/media/images/song-not-found.jpg";
            console.log("Nenhuma imagem de capa encontrada nas tags MP3.");
          }

          // --- Título ---
          const title = tag.tags.title || "Título desconhecido";
          const spanTitle = document.querySelector(
            "#div-audio-player .span-song-title"
          );
          spanTitle.textContent = title;

          // --- Artista ---
          const artist = tag.tags.artist || "Artista desconhecido";
          const spanArtist = document.querySelector(
            "#div-audio-player .span-song-artist"
          );
          spanArtist.textContent = artist;
        },

        onError: (error) => {
          console.error("Erro ao ler as tags:", JSON.stringify(error, null, 2));
        },
      });
    } catch (error) {
      console.error(error);
    }
  }

  // Define os Event Listeners
  initEvents() {
    // Clique no Botão de Música Anterior
    this.buttonBack.addEventListener("click", () => {
      this.backSong();
    });

    // Clique no Botão de Play/Pause
    this.buttonPlayPause.addEventListener("click", () => {
      this.playPause();
    });

    // Clique no Botão de Música Seguinte
    this.buttonNext.addEventListener("click", () => {
      this.nextSong();
    });

    // Fim da Música, vai para a próxima música
    this.audio.addEventListener("ended", () => {
      this.nextSong();
    });

    // Quando o navegador começa a carregar a nova fonte de áudio
    this.audio.addEventListener("loadstart", async () => {
      await this.loadSongMetadata();
    });

    // Define o Botão como Play e coloca uma música no Áudio
    this.setPlaySvg();
    this.audio.src = this.songs[this.audioIndex];
  }

  // --- Controle Visual ---
  // Atualiza o Botão de Play/Pause
  updatePlayPauseButton() {
    if (this.audio.paused) {
      this.setPauseSvg();
    } else {
      this.setPlaySvg();
    }
  }

  // Atualiza o Elemento de Audio de acordo com um índice
  updateAudioByIndex(index) {
    this.audioIndex = index;
    this.audio.pause();
    this.audio.src = this.songs[this.audioIndex];
    this.audio.play();
    this.setPauseSvg();
  }

  // Define o botão de Play
  setPlaySvg() {
    const playSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
    <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/>
    </svg>`;
    const element = xmlStringToHtmlElement(playSvg);

    this.buttonPlayPause.querySelector("svg").replaceWith(element);
  }

  // Define o botão de Pause
  setPauseSvg() {
    const pauseSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
    <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5"/>
    </svg>`;
    const element = xmlStringToHtmlElement(pauseSvg);

    this.buttonPlayPause.querySelector("svg").replaceWith(element);
  }

  // --- Controle de Músicas ---
  // Volta para a Música Anterior
  backSong() {
    if (this.audioIndex > 0) {
      this.updateAudioByIndex(this.audioIndex - 1);
    } else {
      this.updateAudioByIndex(this.songs.length - 1);
    }
  }

  // Pausa ou Continua a Música
  playPause() {
    if (this.audio.paused) {
      this.setPauseSvg();
      this.audio.play();
    } else {
      this.setPlaySvg();
      this.audio.pause();
    }
  }

  // Vai para a Música Seguinte
  nextSong() {
    if (this.audioIndex < this.songs.length - 1) {
      this.updateAudioByIndex(this.audioIndex + 1);
    } else {
      this.updateAudioByIndex(0);
    }
  }
}
// ----- Settings Panel (Modal) -----
class ComponentSettingsPanel {
  constructor() {
    this.panel = document.querySelector("#div-settings-panel");
    this.buttonOpen = document.querySelector("#button-settings");

    this.loadContent();
    this.initReferences();
    this.initEvents();
    this.initState();
  }

  // Adiciona o conteúdo do modal
  loadContent() {
    if (!this.panel) {
      console.error("❌ #div-settings-panel não encontrado.");
      return;
    }

    this.panel.innerHTML = `
      <div class="modal-content">
        <div class="modal-title-bar">
          <h2>Configurações</h2>
          <span class="close" tabindex="0">&times;</span>
        </div>
        <div>
          <span>Mudar tema</span>
          <button id="button-tema" aria-label="Mudar tema">Tema</button>
        </div>
        <div>
          <span>Mudar fonte</span>
          <button id="button-fonte" aria-label="Mudar fonte">Fonte</button>
        </div>
      </div>
    `;
  }

  initReferences() {
    this.buttonClose = this.panel.querySelector(".close");
    this.buttonTema = this.panel.querySelector("#button-tema");
    this.buttonFonte = this.panel.querySelector("#button-fonte");
  }

  initEvents() {
    // Abrir painel
    this.buttonOpen.addEventListener("click", () => this.showPanel());

    // Fechar painel com X
    this.buttonClose.addEventListener("keydown", () => this.hidePanel());
    this.buttonClose.addEventListener("click", () => this.hidePanel());

    // Fechar clicando fora do conteúdo
    window.addEventListener("click", (e) => {
      if (e.target === this.panel) this.hidePanel();
    });

    // ESC fecha
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") this.hidePanel();
    });

    // Botões de tema e fonte
    this.buttonTema.addEventListener("click", () =>
      ThemeManager.toggleTheme(this.buttonTema)
    );

    this.buttonFonte.addEventListener("click", () =>
      FontManager.toggleFont(this.buttonFonte)
    );
  }

  initState() {
    ThemeManager.init(this.buttonTema);
    FontManager.init(this.buttonFonte);
  }

  showPanel() {
    this.panel.classList.add("show");
  }

  hidePanel() {
    this.panel.classList.remove("show");
  }
}
