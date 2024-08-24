let currentPage = 1;
const totalPages = 7;
document.addEventListener('DOMContentLoaded', () => {
const muteButton = document.querySelector('.mute-button');
const audioPlayer = document.getElementById('audio-player');
// 設定音量為30%
audioPlayer.volume = 0.3;

// 音樂自動播放設置
window.addEventListener('click', () => {
    audioPlayer.play().catch(error => {
        console.error('播放失敗:', error);
    });
});

// 靜音按鈕功能
muteButton.addEventListener('click', () => {
    if (audioPlayer.muted) {
        audioPlayer.muted = false;
        muteButton.querySelector('.white-icon').textContent = '🔊'; // 顯示音量圖標
        muteButton.classList.remove('white-icon');
    } else {
        audioPlayer.muted = true;
        muteButton.querySelector('.white-icon').textContent = '🔇'; // 顯示靜音圖標
        muteButton.classList.add('white-icon');
    }
});

// 初始顯示第 1 頁
showPage(currentPage);

document.getElementById('start-quiz').addEventListener('click', () => {
    document.getElementById('start-page').style.display = 'none';
    document.getElementById('quiz-form').style.display = 'block';
    showPage(currentPage);  // 顯示測驗的第一頁
});

    document.getElementById('submit-button').addEventListener('click', submitQuiz);
});

function showPage(pageNumber) {
    for (let i = 1; i <= totalPages; i++) {
        document.getElementById(`page-${i}`).style.display = i === pageNumber ? 'block' : 'none';
    }
}

document.getElementById('start-quiz').addEventListener('click', () => {
    document.getElementById('start-page').style.display = 'none';
    document.getElementById('quiz-form').style.display = 'block';
    showPage(currentPage);  // 顯示測驗的第一頁
});

function goToStart() {
    document.getElementById('quiz-form').style.display = 'none';
    document.getElementById('start-page').style.display = 'block';
}

function nextPage() {
    if (isPageValid(currentPage)) {
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
        }
    } else {
        alert("你沒有選到選項哦");
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        showPage(currentPage);
    }
}

function isPageValid(pageNumber) {
    const page = document.getElementById(`page-${pageNumber}`);
    const selectedOption = page.querySelector('input[type="radio"]:checked');
    return selectedOption !== null;
}

function submitQuiz(event) {
    if (isPageValid(currentPage)) {
        const resultDiv = document.getElementById('result');

        // 簡單的結果判斷
        const answers = document.querySelectorAll('input[type="radio"]:checked');
        let score = {dog: 0, rabbit: 0, cat: 0, salamander: 0};
        
        // 調試輸出選擇的答案
        console.log('選擇的答案:', Array.from(answers).map(a => a.value));

        answers.forEach(answer => {
            if (score.hasOwnProperty(answer.value)) {
                score[answer.value]++;
            } else {
                console.warn('未知的選項值:', answer.value);
            }
        });

        let maxScore = Math.max(...Object.values(score));
        let result = Object.keys(score).filter(animal => score[animal] === maxScore);

        // 處理同分情況
        if (result.length > 1) {
            // 修改此處邏輯以匹配新的標籤結構
            if (result.includes('dog') && result.includes('rabbit')) {
                result = answers[2]?.value === 'rabbit' ? '兔兔' : '狗狗';
            } else if (result.includes('dog') && result.includes('cat')) {
                result = answers[0]?.value === 'dog' ? '狗狗' : '貓貓';
            } else if (result.includes('dog') && result.includes('salamander')) {
                result = answers[0]?.value === 'dog' ? '狗狗' : '蠑螈';
            } else if (result.includes('cat') && result.includes('rabbit')) {
                result = answers[5]?.value === 'cat' ? '貓貓' : '兔兔';
            } else if (result.includes('cat') && result.includes('salamander')) {
                result = answers[3]?.value === 'cat' ? '貓貓' : '蠑螈';
            } else if (result.includes('rabbit') && result.includes('salamander')) {
                result = answers[1]?.value === 'rabbit' ? '兔兔' : '蠑螈';
            }
        } else {
            result = result[0] === 'dog' ? '狗狗' :
                    result[0] === 'rabbit' ? '兔兔' :
                    result[0] === 'cat' ? '貓貓' : '蠑螈';
        }

        // 定義結果文字
        let resultText = "你的結果是：" + result;
        let imageUrl = '';

        // 添加額外描述
        if (result === '兔兔') {
            resultText += '<br>兔子：<br>老好人aka宿舍的氣氛調節器，適應團體生活，能很快融入集體。經常主動照顧同寢的夥伴們，溫柔的關心每一個人。有時會在你意想不到時後投餵許多小零食哦～';
            imageUrl = 'image/rabbit.png';
        } else if (result === '蠑螈') {
            resultText += '<br>蠑螈：<br>平時很安靜，經常沉浸在自己的小世界，靜靜地享受自己的時光。個性隨和好相處，號稱“人間活菩薩”，但偶爾會做出無厘頭的舉動（？）總是默默的觀察大家，用自己的方式關心夥伴。';
            imageUrl = 'image/salamander.png';
        } else if (result === '狗狗') {
            resultText += '<br>狗狗：<br>個性熱情開朗，總是坦率的表達自己的想法。喜歡和朋友們一起玩樂，有他在身邊永遠充滿驚喜與快樂。雖然有時不太擅長讀空氣，但他的真誠與熱情總是感染著身邊的人，可以說是行走的發電機～';
            imageUrl = 'image/dog.png';
        } else if (result === '貓貓') {
            resultText += '<br>貓貓：<br>感覺是話很少的人，喜歡獨來獨往（或只跟特定對象一起行動），但意外地知道很多宿舍秘辛。在外人眼中，對周遭事物似乎都有些許冷淡，散發著一股神秘的氣息，喜歡一個人獨處的時光，也不排斥跟其他人打交道，雖然平常不太起眼，但意外的知道很多宿舍秘辛，面冷心善的他也默默用自己的方式關心著大家~'
            imageUrl = 'image/cat.png';
        }

        if (imageUrl) {
            resultText = `<img src="${imageUrl}" alt="${result}" style="max-width: 100%;"><br>` + resultText;
        }
        resultText += '<br><small style="color: black; display: block; text-align: center; padding: 5px">長按上方結果圖就能儲存囉！</small>';

        resultText += `
            <div class="button-container">
                <label class="result-button" onclick="restartQuiz()">再測一次</label>
                <label class="result-button" onclick="shareResult('${imageUrl}', '${result}')">分享結果</label>
                <label class="about-button" onclick="aboutUs()">關於我們</label>
            </div>`;

        // 隱藏所有頁面，顯示結果
        document.querySelectorAll('.quiz-page').forEach(page => page.style.display = 'none');
        resultDiv.style.display = 'block';
        resultDiv.innerHTML = resultText;
    } else {
        alert("你沒有選到選項哦");
    }
}

function restartQuiz() {
    currentPage = 1;
    document.getElementById('result').style.display = 'none';
    document.getElementById('quiz-form').style.display = 'block';

    document.querySelectorAll('input[type="radio"]:checked').forEach(answer => answer.checked = false);
    showPage(currentPage);
}

function aboutUs() {
    const quizContainer = document.getElementById('quiz-container');
    const h2 = document.querySelector('#quiz-container h2');
    const content = document.querySelector('.content');

    document.getElementById('result').style.display = 'none';
    quizContainer.style.display = 'none';
    content.style.display = 'block';
    h2.style.display = 'none';
}


function shareResult(imageUrl, result) {
    if (navigator.share) {
        navigator.share({
            title: '測驗結果',
            text: `我的結果是：${result}`,
            url: imageUrl
        }).then(() => {
            console.log('分享成功');
        }).catch(err => {
            console.error('分享失敗', err);
        });
    } else {
        alert('分享功能不被支持');
    }
}

// 初始顯示第 1 頁
document.addEventListener('DOMContentLoaded', () => {
    showPage(currentPage);
    document.getElementById('submit-button').addEventListener('click', submitQuiz);
});

