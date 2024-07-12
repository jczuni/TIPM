<script>
    import { onMount } from "svelte";
    import * as tf from "@tensorflow/tfjs";
    import "@tensorflow/tfjs-backend-webgl"; // set backend to webgl
    import back from '../../../../resources/back.svg?raw';
    import circle from '../../../../resources/distractiondetector/icons/circle.svg?raw';
    import webcam from '../../../../resources/distractiondetector/images/webcam.png?asset';
    import buzzer from "../../../../resources/distractiondetector/audio/buzzer.mp3?asset";
    export let handleGoBack;

    let videoFeed,
        currStream, 
        distracted = false,
        distractedSfx = false;

    const xywh2xyxy = (x) => {
        //Convert boxes from [x, y, w, h] to [x1, y1, x2, y2] where xy1=top-left, xy2=bottom-right
        var y = [];
        y[0] = x[0] - x[2] / 2  //top left x
        y[1] = x[1] - x[3] / 2  //top left y
        y[2] = x[0] + x[2] / 2  //bottom right x
        y[3] = x[1] + x[3] / 2  //bottom right y

        return y;
    }

    const non_max_suppression = (res, conf_thresh=0.30, iou_thresh=0.7, max_det = 300) => {
        // Initialize an empty list to store the selected boxes
        const selected_detections = [];

        for (let i = 0; i < res.length; i++) {
            // Check if the box has sufficient score to be selected
            if (res[i][4] < conf_thresh) {
                continue;
            }

            var box = res[i].slice(0,4);
            const cls_detections = res[i].slice(5);
            var klass = cls_detections.reduce((imax, x, i, arr) => x > arr[imax] ? i : imax, 0);
            const score = res[i][klass + 5];

            let object = xywh2xyxy(box);
            let addBox = true;


            // Check for overlap with previously selected boxes
            for (let j = 0; j < selected_detections.length; j++) {
                let selectedBox = xywh2xyxy(selected_detections[j]);

                // Calculate the intersection and union of the two boxes
                let intersectionXmin = Math.max(object[0], selectedBox[0]);
                let intersectionYmin = Math.max(object[1], selectedBox[1]);
                let intersectionXmax = Math.min(object[2], selectedBox[2]);
                let intersectionYmax = Math.min(object[3], selectedBox[3]);
                let intersectionWidth = Math.max(0, intersectionXmax - intersectionXmin);
                let intersectionHeight = Math.max(0, intersectionYmax - intersectionYmin);
                let intersectionArea = intersectionWidth * intersectionHeight;
                let boxArea = (object[2] - object[0]) * (object[3] - object[1]);
                let selectedBoxArea = (selectedBox[2] - selectedBox[0]) * (selectedBox[3] - selectedBox[1]);
                let unionArea = boxArea + selectedBoxArea - intersectionArea;

                // Calculate the IoU and check if the boxes overlap
                let iou = intersectionArea / unionArea;
                if (iou >= iou_thresh) {
                    addBox = false;
                    break;
            }
            }

            // Add the box to the selected boxes list if it passed the overlap check
            if (addBox) {
                const row =  box.concat(score, klass);
                selected_detections.push(row);
            }
        }

        return selected_detections;
    }

    const shortenedCol = (arrayofarray, indexlist) => {
        return arrayofarray.map(function (array) {
            return indexlist.map(function (idx) {
                return array[idx];
            });
        });
    }

    const detectFrame = async (model) => {
        const model_dim = [640, 640];

        tf.engine().startScope();

        const input = tf.tidy(() => {
            const img = tf.image
                        .resizeBilinear(tf.browser.fromPixels(videoFeed), model_dim)
                        .div(255.0)
                        .transpose([2, 0, 1])
                        .expandDims(0);

            return img;
        });

        await model.executeAsync(input).then((res) => {
            res = res.arraySync()[0];

            const detections = non_max_suppression(res);
            const class_detect = shortenedCol(detections, [5]);

            for (let i = 0; i < class_detect.length; i++) {
                if (!distracted && class_detect[i][0] === 67) {
                    distracted = true;
                }
            }

            if (distracted && !distractedSfx) {
                distractedSfx = true;
                window.document.getElementsByClassName("buzzer-audio")[0].play();
            }

            tf.dispose(res);
        });

        requestAnimationFrame(() => detectFrame(model)); // get another frame
        tf.engine().endScope();
    };

    const checkWebcam = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});

        currStream = stream;
        videoFeed.srcObject = currStream;
        videoFeed.onloadedmetadata = () => {
            detectFrame(model);
        }
    }

    onMount(async () => {
        tf.loadGraphModel("models/yolov7/model.json")
            .then(async (model) => {
                const dummyInput = tf.ones(model.inputs[0].shape);
                await model.executeAsync(dummyInput).then(async (warmupResult) => {
                    tf.dispose(warmupResult);
                    tf.dispose(dummyInput);

                    const stream = await navigator.mediaDevices.getUserMedia({video: true});

                    currStream = stream;
                    videoFeed.srcObject = currStream;
                    videoFeed.onloadedmetadata = () => {
                        detectFrame(model);
                    }
                });
            });

        window.addEventListener("message", (event) => {
            if (distracted && event.data === "q-pressed") {
                distracted = false;
                distractedSfx = false;
                window.document.getElementsByClassName("buzzer-audio")[0].pause();
                window.document.getElementsByClassName("buzzer-audio")[0].currentTime = 0;
            }
        });
    });
</script>

<div class="container">
    <audio class="buzzer-audio" src={buzzer} preload="auto" loop></audio>
    <button on:click={handleGoBack}><span>{@html back}</span>Go Back</button>
    <div>
        <p class="camera-info" class:active={currStream}><span>{@html circle}</span>{currStream ? "A camera is detected and used." : "No camera is being detected, please try again..."}</p>
        <div>
            <section>
                <video autoplay="true" bind:this={videoFeed}></video>
            </section>
            <button on:click={checkWebcam} disabled={currStream}>
                <img src={webcam} alt="3D render of a webcam">
                <p>{currStream ? "Don't worry, everything is working fine!" : "Click here to manually detect your camera"}</p>
            </button>
        </div>
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
        font-family: "fuschia";
        display: flex;
        flex-direction: column;
        background: linear-gradient(135deg, hsla(350, 100%, 88%, 1) 0%, hsla(331, 100%, 84%, 1) 100%);
        flex-grow: 1;
        height: 100%;
        padding: 1rem;
        border-radius: 0.5rem; /* 8px */
    }

    .camera-info {
        display: flex;
        align-items: center;
        column-gap: 0.5rem;
        font-size: 1.125rem; /* 18px */
        line-height: 1.75rem; /* 28px */
    }

    .camera-info > span {
        display: block;
        width: 1.5rem;
        height: 1.5rem;
        color: red;
        transition-duration: 200ms;
    }

    .camera-info.active > span {
        color: darkgreen;
        transition-duration: 200ms;
    }

    .container > div > div {
        display: flex;
        flex-grow: 1;
        margin-top: 1rem;
        column-gap: 1rem;
    }

    .container > div > div > section {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 60%;
        flex-grow: 1;
        background-color: black;
        border-radius: 0.5rem;
        overflow: hidden;
    }

    .container > div > div > section > video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .container > div > div > button {
        position: relative;
        width: 40%;
        border-radius: 0.5rem;
        font-size: 1.125rem; /* 18px */
        line-height: 1.75rem; /* 28px */
        padding: 2rem;
        background: linear-gradient(135deg, hsla(303, 79%, 76%, 1) 0%, hsla(360, 86%, 67%, 1) 100%);
        transition-duration: 200ms;
    }

    .container > div > div > button:disabled {
        pointer-events: none;
        opacity: 0.5;
    }

    .container > div > div > button:after {
        content: '';
        opacity: 0;
        position: absolute;
        top: -4px;
        left: -4px;
        bottom: -4px;
        right: -4px;
        border: 1px solid #F292ED;
        border-radius: 0.75rem; /* 8px */
        pointer-events: none;
        transition-duration: 200ms;
    }
    
    .container > div > div > button:hover:after {
        opacity: 1;
    }

    .container > div > div > button > img {
        width: 6rem;
        height: 6.5rem;
        margin: 0 auto;
    }

    .container > div > div > button > p {
        margin-top: 1rem;
    }
</style>