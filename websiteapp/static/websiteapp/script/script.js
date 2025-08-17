if (navigator.language.substring(0, 2) !== "tr" && "en") {
    language = "en";
}
else {
    language = navigator.language.substring(0, 2);
}


let langData = []

async function loadLanguage(lang) {
    try {
        const response = await fetch(`/static/websiteapp/lang/${lang}.json`)
        langData = await response.json();
    }
    catch (error) {
        console.error("Dil dosyası yüklenemedi:", error)
    }


}

async function setSomeWordsByLanguage() {
    document.getElementById("total-point").innerHTML = langData.total_point + totalPoint
    document.getElementById("max-point").innerHTML = langData.max_point + getMaxScore()
    document.getElementById("guessbox").placeholder = langData.search_the_game
    document.getElementById("get-game-btn").innerHTML = langData.skip
    document.getElementById("guess-game-btn").innerHTML = langData.guess

    for (let i = 1; i < 4; i++) {
        document.getElementById(`hint-text${i}`).innerHTML = langData.hint;
    }

}

async function setupGame() {
    await loadLanguage(language);
    await setSomeWordsByLanguage();
    await getGameNames();
    await fetchGame();
}

let developerMode = false

let pointLoseFromImage = 150

let pointLoseFromHint = 100

let btn

let text

let gameQuantity

let dataList

let playedGames = []

let currentGame

let seenImages = []

let hints = []

let totalPoint = 0
let pointGain = 1000
let maxSeenIndex

let gameOver = false

let currentImageIndex


document.addEventListener("DOMContentLoaded", async function () {
    await setupGame();
});

document.getElementById("max-point").innerHTML = "Maksimum Puan: " + getMaxScore();

document.getElementById("get-game-btn").addEventListener("click", fetchGame);

document.getElementById("next-img-btn").addEventListener("click", function () { showImage(1); updateIndicators(currentImageIndex, seenImages) });

document.getElementById("prev-img-btn").addEventListener("click", function () { showImage(-1); updateIndicators(currentImageIndex, seenImages) });

document.getElementById("guess-game-btn").addEventListener("click", checkGame);

document.getElementById("dev-get-game-button").addEventListener("click", getGameByName)

document.addEventListener("click", checkForPointGain)



for (let i = 1; i <= 3; i++) {
    const btn = document.getElementById(`hint-button${i}`);
    const text = document.getElementById(`hint-text${i}`);
    const img = document.getElementById(`hint-image${i}`)

    btn.addEventListener("mouseenter", () => {
        if (btn.classList.contains("active") == false) {
            if (i === 1) { text.textContent = langData.release_date; }
            else if (i === 2) text.textContent = langData.genre;
            else if (i === 3) text.textContent = langData.developer;
        }
    });

    btn.addEventListener("mouseleave", () => {
        if (btn.classList.contains("active") == false) {
            text.textContent = langData.hint;
        }
    });

    btn.addEventListener("click", () => {
        btn.classList.add("active");
        if (i === 1) { btn.disabled = true; text.textContent = `${langData.release_date}: ` + data.hintDate; pointGain -= pointLoseFromHint; document.getElementById("point-gain").innerHTML = langData.point_gain + pointGain; img.style.display = "none" }
        else if (i === 2) { btn.disabled = true; text.textContent = `${langData.genre}: ` + data.hintGenre; pointGain -= (pointLoseFromHint + 50); document.getElementById("point-gain").innerHTML = langData.point_gain + pointGain; img.style.display = "none" }
        else if (i === 3) { btn.disabled = true; text.textContent = `${langData.developer}: ` + data.hintDeveloper; pointGain -= (pointLoseFromHint + 300); document.getElementById("point-gain").innerHTML = langData.point_gain + pointGain; img.style.display = "none" }

    });

}

function checkForPointGain() {
    if (pointGain <= 0) {
        pointGain = 50;
        document.getElementById("point-gain").innerHTML = langData.point_gain + pointGain;
    }
}

function enableHintButtons() {
    const hintButtons = document.querySelectorAll(".hint-buttons button");
    const hintImages = document.querySelectorAll(".hint-buttons button img");
    hintButtons.forEach(btn => {
        btn.classList.remove("active");
        btn.disabled = false;
    });

    hintImages.forEach(img => {
        img.style.display = "inline"
    });

    for (let i = 1; i < 4; i++) {
        text = document.getElementById(`hint-text${i}`);
        text.textContent = langData.hint;
    }

}

const devBox = document.getElementById("devbox");
const devGetGameButton = document.getElementById("dev-get-game-button")

devBox.disabled = true;
devBox.style.display = "none";
document.getElementById("dev-mode").innerHTML = "";
devGetGameButton.disabled = true;
devGetGameButton.style.display = "none";
const guessbox = document.getElementById("guessbox");
guessbox.removeAttribute("list");

document.addEventListener("keydown", function (event) {
    if (event.key == "F9" && developerMode == false) {
        developerMode = true;
        console.log("Geliştirici modu aktif.");
        document.getElementById("dev-mode").innerHTML = langData.dev_mode
        devBox.disabled = false;
        devBox.style.display = "block";
        devGetGameButton.disabled = false;
        devGetGameButton.style.display = "inline";
    }
    else if (event.key == "F9" && developerMode == true) {
        developerMode = false;
        document.getElementById("dev-mode").innerHTML = "";
        console.log("Geliştirici modu deaktif");
        devBox.disabled = true;
        devBox.style.display = "none";
        devGetGameButton.disabled = true;
        devGetGameButton.style.display = "none";
    }
});

guessbox.addEventListener("input", function () {
    if (guessbox.value.length >= 2) {
        guessbox.setAttribute("list", "game-names");
    }
    else {
        guessbox.removeAttribute("list");
    }

})

imageElement = document.getElementById('image-section');

async function getGameNames() { // Verinin tamamını çekmekte sakınca yok bence dümdüz string veri çekiyoz her seferinde sunucuya sorgu atmaktan iyidir.
    try {
        const response = await fetch("quizgame/api/get-game-names");
        data = await response.json();

        const dataList = document.getElementById("game-names");
        dataList.innerHTML = '';

        data.games.forEach(function (gameName) {
            const option = document.createElement("option");
            option.value = gameName;
            dataList.appendChild(option);

        });
        gameQuantity = data.games.length;

    } catch (error) {
        console.error("Hata:", error);
    }
}



function getMaxScore() {
    return parseInt(localStorage.getItem("maxScore")) || 0;
}

let data = []

async function fetchGame() {
    try {
        const response = await fetch("quizgame/api/get-game",
            {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify({ playedGames: playedGames })
            });

        data = await response.json();
        console.log(data);

        if (data.error) {
            console.error(data.error);
            gameOver = true;
            document.getElementById("game-quantity").innerHTML =
                playedGames.length + "/" + gameQuantity + langData.game_over + totalPoint;
            return;
        }



        currentImageIndex = 0;
        images = [data.image1, data.image2, data.image3, data.image4, data.image5]
        showImage(0)
        //console.log("oyun adı:", data.name);

        currentGame = data.name
        seenImages = [true, false, false, false, false]
        pointGain = 1000
        document.getElementById("point-gain").innerHTML = langData.point_gain + pointGain
        maxSeenIndex = 0
        document.getElementById("guessbox").value = ""
        //console.log(playedGames)
        playedGames.push(currentGame);
        document.getElementById("game-quantity").innerHTML = playedGames.length + "/" + gameQuantity;
        updateIndicators(currentImageIndex, seenImages)
        enableHintButtons();
        guessbox.removeAttribute("list");
    }
    catch (error) {
        console.error(error)
        gameOver = true;
        document.getElementById("game-quantity").innerHTML = playedGames.length + "/" + gameQuantity + langData.game_over + totalPoint
        return;
    }


}


function showImage(direction) {

    if (direction == 0) {
        imageElement.src = images[currentImageIndex];
    }
    else if (direction == 1) {
        if (currentImageIndex != 4) {
            currentImageIndex = currentImageIndex + 1;
            imageElement.src = images[currentImageIndex]
        }
        else {

        }
    }
    else if (direction == -1) {
        if (currentImageIndex != 0) {
            currentImageIndex = currentImageIndex - 1;
            imageElement.src = images[currentImageIndex]

        }
        else {

        }

    }

    //console.log(seenImages)
    //console.log(pointGain)

    if (seenImages[currentImageIndex] == false) {
        seenImages[currentImageIndex] = true;
        pointGain -= pointLoseFromImage;

        document.getElementById("point-gain").innerHTML = langData.point_gain + pointGain

    }

}

function showImageByIndex(index) {
    imageElement.src = images[index]
    currentImageIndex = index

    if (seenImages[currentImageIndex] == false) {
        seenImages[currentImageIndex] = true;
        pointGain -= pointLoseFromImage;

        document.getElementById("point-gain").innerHTML = langData.point_gain + pointGain

    }

}

function checkGame() {

    if (!gameOver) {
        gameEntry = document.getElementById("guessbox").value

        if (currentGame == gameEntry) {
            totalPoint += pointGain
            document.getElementById("total-point").innerHTML = langData.total_point + totalPoint
            if (totalPoint > getMaxScore()) {
                localStorage.setItem("maxScore", totalPoint);
            }
            document.getElementById("max-point").innerHTML = langData.max_point + getMaxScore();
            fetchGame();

        }
        else {

            for (let i = 0; i < seenImages.length; i++) {
                if (seenImages[i] == false) {
                    showImageByIndex(i);
                    updateIndicators(currentImageIndex, seenImages)
                    break;
                }
            }

        }
    }

    document.getElementById("guessbox").value = ""
}

function updateIndicators(currentImageIndex, seenImages) {
    for (let i = 0; i < 5; i++) {
        const circle = document.getElementById(`circle-${i}`);
        circle.classList.remove("current", "seen");

        if (i < seenImages.length && seenImages[i]) {
            circle.classList.add("seen");
        }

        if (i === currentImageIndex) {
            circle.classList.add("current");
        }
    }
}



async function getGameByName() {

    const response = await fetch(`/quizgame/api/get-game-by-name?name=${encodeURIComponent(devBox.value)}`);

    data = await response.json();

    if (data.error) {

        console.error(data.error);
        devBox.value = "Oyun bulunamadı"

    }
    else {
        currentImageIndex = 0;
        images = [data.image1, data.image2, data.image3, data.image4, data.image5]
        showImage(0)
        //console.log("oyun adı:", data.name);
        console.log(data);

        currentGame = data.name
        seenImages = [true, false, false, false, false]
        pointGain = 1000
        document.getElementById("point-gain").innerHTML = langData.point_gain + pointGain
        maxSeenIndex = 0
        document.getElementById("guessbox").value = ""
        //console.log(playedGames)
        updateIndicators(currentImageIndex, seenImages)
        enableHintButtons();
    }


}