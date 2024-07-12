<script>
    import { onMount } from 'svelte';
    import back from '../../../../resources/back.svg?raw';
    import skip from '../../../../resources/pomodoro/icons/skip.svg?raw';
    import click from "../../../../resources/pomodoro/audio/click.mp3?asset";
    import timer from "../../../../resources/pomodoro/audio/timer.mp3?asset";
    export let handleGoBack;

    let selectedOption = "pomodoro",
        optionText = "Time to focus!",
        running = false,
        counter = 1,
        minutes = 25,
        seconds = 0,
        utterance,
        setIntervalFunc;

    const selectOption = (option) => {
        running = false;
        selectedOption = option;

        if (option == "pomodoro") {
            optionText = "Time to focus!";
            minutes = 25;
            seconds = 0;
        } else if (option == "short-break") {
            optionText = "Time for a break!";
            minutes = 5;
            seconds = 0;
        } else if (option == "long-break") {
            optionText = "Time for a break!";
            minutes = 15;
            seconds = 0;
        }
    }

    const countdownTimer = () => {
        if (seconds - 1 < 0) {
            seconds = 59;

            if (minutes - 1 < 0) {
                window.speechSynthesis.cancel();

                if (selectedOption == "pomodoro" && (counter + 1) % 4 == 0) {
                    selectOption("long-break");

                    utterance = new SpeechSynthesisUtterance("Time for a break!");
                    window.speechSynthesis.speak(utterance);
                } else if (selectedOption == "pomodoro") {
                    selectOption("short-break");

                    utterance = new SpeechSynthesisUtterance("Time for a break!");
                    window.speechSynthesis.speak(utterance);
                } else {
                    selectOption("pomodoro");

                    utterance = new SpeechSynthesisUtterance("Time to focus!");
                    window.speechSynthesis.speak(utterance);
                }

                running = false;
                counter += 1;

                window.document.getElementsByClassName("timer-audio")[0].play();

                clearInterval(setIntervalFunc);
            } else {
                minutes -= 1;
            }
        } else {
            seconds -= 1;
        }
    }

    const skipTimer = () => {
        window.speechSynthesis.cancel();

        if (selectedOption == "pomodoro" && (counter + 1) % 4 == 0) {
            selectOption("long-break");

            utterance = new SpeechSynthesisUtterance("Time for a break!");
            window.speechSynthesis.speak(utterance);
        } else if (selectedOption == "pomodoro") {
            selectOption("short-break");

            utterance = new SpeechSynthesisUtterance("Time for a break!");
            window.speechSynthesis.speak(utterance);
        } else {
            selectOption("pomodoro");

            utterance = new SpeechSynthesisUtterance("Time to focus!");
            window.speechSynthesis.speak(utterance);
        }

        window.speechSynthesis.pause();
        window.speechSynthesis.resume();

        running = false;
        counter += 1;

        clearInterval(setIntervalFunc);
    }

    const startTimer = () => {
        window.document.getElementsByClassName("click-audio")[0].play();

        if (running) {
            running = false;
            clearInterval(setIntervalFunc);
        } else {
            running = true;
            setIntervalFunc = setInterval(countdownTimer, 1000);
            setIntervalFunc();
        }
    }

    onMount(() => {
        utterance = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(utterance);
    });
</script>

<div class="container">    
    <audio class="timer-audio" src={timer} preload="auto"></audio>
    <audio class="click-audio" src={click} preload="auto"></audio>
    <button on:click={handleGoBack}><span>{@html back}</span>Go Back</button>
    <div class="{selectedOption}">
        <section class="timer">
            <ul>
                <li><button class:active={selectedOption == "pomodoro"} on:click={() => selectOption("pomodoro")}>Pomodoro</button></li>
                <li><button class:active={selectedOption == "short-break"} on:click={() => selectOption("short-break")}>Short Break</button></li>
                <li><button class:active={selectedOption == "long-break"} on:click={() => selectOption("long-break")}>Long Break</button></li>
            </ul>
            <p>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</p>
            <div>
                <button class="start-timer" class:running={running} on:click={startTimer}>{running ? "Pause" : "Start"}</button>
                <div class="skip-timer">
                    <button class:show={running} on:click={skipTimer}>
                        {@html skip}
                    </button>
                </div>
            </div>
        </section>
        <section class="counter">
            <p class="number">#{counter}</p>
            <p>{optionText}</p>
        </section>
    </div>
</div>

<style>
    .container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        height: 100%;
        padding: 1rem;
    }

    .container > button {
        font-family: "arial";
        font-weight: 800;
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        font-size: 1.5rem; /* 24px */
        line-height: 2rem; /* 32px */
        width: fit-content;
    }

    .container > button > span {
        display: block;
        width: 2rem;
        height: 2rem;
        margin-right: 0.25rem;
        transition-duration: 200ms;
    }

    .container > button:hover > span {
        margin-right: 0.75rem;
    }

    .container > div {
        position: relative;
        color: white;
        flex-grow: 1;
        height: 100%;
        padding: 1rem;
        border-radius: 0.5rem; /* 8px */
        transition-duration: 200ms;
    }

    .container > div.pomodoro {
        background-color: #e65f57;
    }

    .container > div.short-break {
        background-color: #429E9D;
    }

    
    .container > div.long-break {
        background-color: #0476D0;
    }

    .timer {
        font-family: "fuschia";
        width: 100%;
        max-width: 33rem;
        margin: 0 auto;
        padding: 1rem 3rem;
        border-radius: 0.5rem; /* 8px */
        transition-duration: 200ms;
        z-index: 10;
    }

    .container > div.pomodoro > .timer {
        background-color: #ff7871;
    }

    .container > div.short-break > .timer {
        background-color: #55a8a7;
    }

    .container > div.long-break > .timer {
        background-color: #1d84d5;
    }

    .timer > ul {
        display: flex;
        justify-content: center;
        column-gap: 1rem;
        font-size: 0.875rem; /* 14px */
        line-height: 1.25rem; /* 20px */
        margin: 0 auto;        
    }

    .timer > ul > li > button {
        padding: 0.25rem 1rem;
        border-radius: 0.5rem; /* 8px */
    }

    .timer > ul > li > button.active {
        font-weight: 700;
        background-color: rgba(0, 0, 0, 0.25);
    }

    .timer > p {
        font-size: 6rem; /* 96px */
        line-height: 1;
        margin: 1.5rem;
        text-align: center;
    }

    .timer > div {
        position: relative;
        width: 100%;
        margin-top: 0.375rem;
        border: 1px solid transparent;
    }

    .timer > div > button.start-timer {
        display: block;
        width: 75%;
        padding: 0.5rem 4rem;
        border-radius: 0.25rem; 
        border-bottom-width: 0.375rem; 
        border-color: #E6E6E6; 
        background-color: #FFFFFF;
        margin: 0 auto;
        font-size: 1.125rem; /* 18px */
        line-height: 1.75rem; /* 28px */
    }

    .container > div.pomodoro > .timer > div > button.start-timer {
        color: #ff7871;
    }

    .container > div.short-break > .timer > div > button.start-timer {
        color: #55a8a7;
    }

    .container > div.long-break > .timer > div > button.start-timer {
        color: #1d84d5;
    }

    .timer > div > button.start-timer.running {
        border-bottom-width: 0px;
        margin-top: 0.375rem;
    }

    .timer > div > div.skip-timer {
        display: flex;
        align-items: center;
        position: absolute;
        top: 0;
        right: 0;
        height: 100%;
        transform: translateX(25%);
        padding-top: 0.375rem;
    }

    .timer > div > div.skip-timer > button {
        opacity: 0;
        width: auto;
        height: 75%;
        margin: auto 0;
        transition-duration: 200ms;
        pointer-events: none;
    }

    .timer > div > div.skip-timer > button.show {
        display: block;
        opacity: 1;
        pointer-events: all;
    }

    .counter {
        font-family: "fuschia";
        text-align: center;
        margin-top: 2rem;
        font-size: 1.125rem; /* 18px */
        line-height: 1.75rem; /* 28px */
        z-index: 10;
    }

    .counter > p.number {
        font-family: "arial";
        opacity: 0.8;
        font-size: 1rem; /* 16px */
        line-height: 1.5rem; /* 24px */
    }
</style>