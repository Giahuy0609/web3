function createCandle() {
    const count = parseInt(document.getElementById("candleCount")?.value || 3); // Mặc định 3 nếu không có input
    const cake = document.getElementById("cake");

    // Xóa nến cũ nếu có
    const oldCandles = cake.querySelectorAll(".candle");
    oldCandles.forEach(c => c.remove());

    // Giới hạn số nến hiển thị
    const maxCandles = Math.min(count, 30);
    const cakeWidth = 400;
    const spacing = cakeWidth / (maxCandles + 1);

    for (let i = 0; i < maxCandles; i++) {
        const candle = document.createElement("div");
        candle.className = "candle";
        candle.style.left = `${(i + 1) * spacing}px`;

        const flame = document.createElement("div");
        flame.className = "flame";

        candle.appendChild(flame);
        cake.appendChild(candle);
    }
}

function blowOutFlames(countToBlow) {
    const candles = document.querySelectorAll(".candle");
    let blown = 0;

    for (let i = 0; i < countToBlow; i++) {
        for (let j = candles.length - 1; j >= 0; j--) {
            const candle = candles[j];
            const flame = candle.querySelector(".flame");

            if (flame) {
                // Thêm hiệu ứng tắt lửa
                flame.classList.add("fade-out");
                setTimeout(() => flame.remove(), 500);
                blown++;
                break;
            }
        }
    }

    // Nếu tất cả nến đã tắt, chuyển nút
    const remainingFlames = document.querySelectorAll(".flame");
    if (remainingFlames.length - blown <= 0) {
        document.getElementById("blowOutBtn").style.display = "none";
        document.getElementById("lightUpBtn").style.display = "inline-block";
    }
}
// Bắt micro để thổi nến
navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
        const audioContext = new AudioContext();
        const analyzer = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);

        microphone.connect(analyzer);
        analyzer.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

        const loudnessThreshold = 50;

        scriptProcessor.addEventListener("audioprocess", () => {
            const array = new Uint8Array(analyzer.frequencyBinCount);
            analyzer.getByteFrequencyData(array);

            let sum = 0;
            for (let i = 0; i < array.length; i++) {
                sum += array[i];
            }

            const average = sum / array.length;
            if (average > loudnessThreshold) {
                blowOutFlames(2); // Chỉ thổi nến khi có tiếng thổi
            }
        });
    })
    .catch((error) => {
        console.error("Lỗi mic:", error);
    });

// Bắt đầu hiệu ứng nhạc + bóng bóng khi nhấn nút "Bắt đầu"
document.getElementById("blowOutBtn")?.addEventListener("click", () => {
    const song = document.getElementById("birthdaySong");
    if (song) song.play();

    const container = document.getElementById("bubbles-container");
    if (!container) return;
    container.innerHTML = "";

    const balloonColors = ["red", "blue", "green", "yellow", "purple", "orange"];
    for (let i = 0; i < 30; i++) {
        const balloon = document.createElement("div");
        balloon.className = "balloon";
        balloon.style.left = Math.random() * 100 + "vw";
        balloon.style.animationDuration = 4 + Math.random() * 3 + "s";
        balloon.style.backgroundColor = balloonColors[Math.floor(Math.random() * balloonColors.length)];
        balloon.style.width = balloon.style.height = 30 + Math.random() * 20 + "px";

        container.appendChild(balloon);
        setTimeout(() => balloon.remove(), 7000);
    }
});

document.getElementById("lightUpBtn")?.addEventListener("click", () => {
    const candles = document.querySelectorAll(".candle");

    candles.forEach(candle => {
        const hasFlame = candle.querySelector(".flame");
        if (!hasFlame) {
            const newFlame = document.createElement("div");
            newFlame.className = "flame";
            candle.appendChild(newFlame);
        }
    });

    document.getElementById("lightUpBtn").style.display = "none";
    document.getElementById("blowOutBtn").style.display = "inline-block";
});