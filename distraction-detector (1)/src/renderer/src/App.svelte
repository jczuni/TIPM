<script>
  import background from '../../../resources/background.jpg?asset';
  import DistractionDetector from "./views/DistractionDetector.svelte";
  import Pomodoro from "./views/Pomodoro.svelte";
  import Selection from "./views/Selection.svelte";

  let currentView = "";

  const minimizeWindow = () => { window.electron.minimizeWindow() }
  const closeWindow = () => { window.electron.closeWindow() }
  
  const handleGoBack = () => {
    currentView = "";
  }

  const handleSelection = (selectedView) => {
    currentView = selectedView;
    console.log(currentView);
  }
</script>

<div class="main-container">
  <section class="custom-window-title">
    <div class="window-title">
      <p>Distraction Detector + Pomodoro</p>
    </div>
    <div class="window-buttons">
      <button class="minimize-window" on:click={minimizeWindow}>-</button>
      <button class="close-window" on:click={closeWindow}>X</button>
    </div>
  </section>
  {#if currentView === "distraction-detector"}
    <DistractionDetector {handleGoBack} />
  {:else if currentView === "pomodoro"}
    <Pomodoro {handleGoBack} />
  {:else}
    <Selection {handleSelection} />
  {/if}

  <img src={background} alt="Flat design abstract floral wallpaper">
  <div class="background-color"></div>
</div>

<style>
  .custom-window-title {
    display: flex;
    justify-content: space-between;
    font-family: "fuschia";
    background: linear-gradient(135deg, hsla(350, 100%, 88%, 1) 0%, hsla(331, 100%, 84%, 1) 100%);
    height: 100%;
    min-height: 2rem;
    border-top-left-radius: 0.75rem; /* 8px */
    border-top-right-radius: 0.75rem; /* 8px */
    overflow: hidden;
    padding: 0.25rem 1rem;
  }

  .custom-window-title > div.window-title {
    -webkit-app-region: drag;
    width: 100%;
  }

  .custom-window-title > div.window-buttons {
    display: flex;
  }

  .custom-window-title > div.window-buttons > button {
    position: relative;
    padding: 0 0.75rem;
  }

  .custom-window-title > div.window-buttons > button:hover:after {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    background-color: black;
    opacity: 0.2;
    width: 100%;
    height: 100%;
  }

  .custom-window-title > div.window-buttons > .close-window:hover:after {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    background-color: red;
    opacity: 0.2;
    width: 100%;
    height: 100%;
  }

  .custom-window-title > div.window-buttons > :hover:after {
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    background-color: black;
    opacity: 0.1;
    width: 100%;
    height: 100%;
  }

  .main-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: 0.75rem;
  }

  .main-container > img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -10;
    opacity: 0.25;
    border-radius: 0.75rem;
    overflow: hidden;
  }

  .main-container > .background-color {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -20;
    background: linear-gradient(135deg, hsla(350, 100%, 88%, 1) 0%, hsla(331, 100%, 84%, 1) 100%);
    border-radius: 0.75rem;
    overflow: hidden;
  }
</style>