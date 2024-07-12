<script>
    import distraction from '../../../../resources/selection/images/distraction.png?asset';
    import pomodoro from '../../../../resources/selection/images/pomodoro.png?asset';
    export let handleSelection;
</script>


<div class="container">
    <header>
        <h1><span>Welcome!</span></h1>
        <p>Which feature do you wish to use?</p>
    </header>
    <section class="options">
        <button on:click={() => handleSelection("distraction-detector")}>
            <h6>Distraction Detector</h6>
            <ul>
                <li><p>Detect distractors and alert to prompt you to refocus.</p></li>
                <li><p>Encourages you maintain discipline by eliminating distractions.</p></li>
                <li><p>Manage your time effectively by limiting distractions.</p></li>
            </ul>
            <img src={distraction} alt="Girl reading books with educational-related items on the background">
        </button>
        <p>OR</p>
        <button on:click={() => handleSelection("pomodoro")}>
            <h6>Pomodoro Timer</h6>
            <ul>
                <li><p>Maintain your concentration by breaking work into manageable intervals.</p></li>
                <li><p>Mitigate your tendency to procrastinate by creating a sense of urgency within each Pomodoro session.</p></li>
                <li><p>Help yourself to regular breaks to prevent burnout and maintain overall well-being.</p></li>
            </ul>
            <img src={pomodoro} alt="Girl holding a clock">
        </button>
    </section>
</div>

<style>
    header {
        text-align: center;
    }

    header > h1 {
        font-size: 1.5rem; /* 24px */
        line-height: 2rem; /* 32px */
    }

    header > h1 > span {
        font-family: "arial";
        font-weight: 800;
    }

    header > p {
        font-family: "fuschia";
        font-size: 1.125rem; /* 18px */
        line-height: 1.75rem; /* 28px */
    }

    .container {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        height: 100%;
        padding: 1rem;
    }

    .options {
        display: flex;
        column-gap: 3rem;
        flex-grow: 1;
        padding: 1rem 3rem;
    }

    .options > button {
        position: relative;
        display: flex;
        flex-direction: column;
        border-radius: 0.5rem; /* 8px */
        width: 100%;
        padding: 1rem 2rem;
        background: linear-gradient(135deg, hsla(350, 100%, 88%, 1) 0%, hsla(331, 100%, 84%, 1) 100%);
        transition-duration: 200ms;
    }

    .options > button:hover {
        transform: scale(1.020);
    }

    .options > button:hover:after {
        opacity: 1;
    }

    .options > button:after {
        content: '';
        opacity: 0;
        position: absolute;
        top: -4px;
        left: -4px;
        bottom: -4px;
        right: -4px;
        border: 1px solid #FFC0CB;
        border-radius: 0.75rem; /* 8px */
        pointer-events: none;
        transition-duration: 200ms;
    }

    .options > button > h6 {
        font-family: "arial";
        font-size: 1.5rem; /* 24px */
        line-height: 2rem; /* 32px */
        font-weight: 800;
        margin: 2rem auto;
    }

    .options > button > img {
        position: absolute;
        overflow: hidden;
        left: 0;
        bottom: 0;
        width: 100%;
        height: 75%;
        object-fit: cover;
        opacity: 25%;
    }
    
    .options > button > ul {
        font-family: "fuschia";
        display: flex;
        flex-direction: column;
        row-gap: 1rem;
        text-align: left;
        z-index: 10;
        font-size: 0.875rem; /* 14px */
        line-height: 1.25rem; /* 20px */
    }

    .options > button > ul > li > p::before {
        content: "→";
        margin-right: 1rem;
    }

    .options > p {
        font-family: "fuschia";
        font-size: 1.5rem; /* 24px */
        line-height: 2rem; /* 32px */
        text-align: center;
        margin: auto 0;
    }
</style>