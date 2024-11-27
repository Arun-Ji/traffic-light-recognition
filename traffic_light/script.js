const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const statusText = document.getElementById('status-text');
const startButton = document.getElementById('start');
const ctx = canvas.getContext('2d');

let streaming = false;

// Initialize webcam
function startWebcam() {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            video.srcObject = stream;
            streaming = true;
        })
        .catch(err => {
            console.error("Error accessing webcam:", err);
            alert("Unable to access the webcam. Please check permissions.");
        });
}

// Process the frame
function processFrame() {
    if (!streaming) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const detectedColor = detectColor(imageData);

    // Display detected color status
    if (detectedColor === 'red') {
        statusText.textContent = "STOP";
        statusText.style.color = "red";
    } else if (detectedColor === 'yellow') {
        statusText.textContent = "READY";
        statusText.style.color = "orange";
    } else if (detectedColor === 'green') {
        statusText.textContent = "GO";
        statusText.style.color = "green";
    } else {
        statusText.textContent = "Not a Traffic Light Color";
        statusText.style.color = "black";
    }

    requestAnimationFrame(processFrame);
}

// Detect dominant color
function detectColor(imageData) {
    const { data } = imageData;

    let redPixels = 0, greenPixels = 0, yellowPixels = 0;

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Red color detection
        if (r > 200 && g < 100 && b < 100) redPixels++;

        // Yellow color detection
        else if (r > 200 && g > 200 && b < 100) yellowPixels++;

        // Green color detection
        else if (g > 200 && r < 100 && b < 100) greenPixels++;
    }

    if (redPixels > greenPixels && redPixels > yellowPixels) return 'red';
    if (yellowPixels > redPixels && yellowPixels > greenPixels) return 'yellow';
    if (greenPixels > redPixels && greenPixels > yellowPixels) return 'green';
    return 'unknown';
}

// Start detection
startButton.addEventListener('click', () => {
    startWebcam();
    processFrame();
});
