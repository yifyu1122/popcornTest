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

document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        audioPlayer.pause();
    } else {
        audioPlayer.play();
    }
});

window.addEventListener('pagehide', function() {
    audioPlayer.pause();
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


function adjustFooterPosition() {
    const footer = document.querySelector('footer');
    const contentHeight = document.body.scrollHeight; 
    const windowHeight = window.innerHeight; 

    if (contentHeight < windowHeight) {
        footer.style.position = 'fixed';
        footer.style.bottom = '0';
        footer.style.width = '100%';
    } else {
        footer.style.position = 'relative';
        document.body.style.paddingBottom = '0'; 
    }
}

window.addEventListener('load', adjustFooterPosition);
window.addEventListener('resize', adjustFooterPosition);

// 在顯示或隱藏 start-page 時調用這個函數
document.getElementById('start-quiz').addEventListener('click', () => {
    document.getElementById('start-page').style.display = 'none';
    document.getElementById('quiz-form').style.display = 'block';
    document.getElementById('foot').style.display = 'none';
});

function goToStart() {
    document.getElementById('quiz-form').style.display = 'none';
    document.getElementById('start-page').style.display = 'block';
    document.getElementById('foot').style.display = 'block';
}

function nextPage() {
    if (isPageValid(currentPage)) {
        if (currentPage < totalPages) {
            currentPage++;
            showPage(currentPage);
            window.scrollTo(0, 0);
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
    window.scrollTo(0, 0);
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
                result = answers[0]?.value === 'dog' ? '狗狗' : '米米';
            } else if (result.includes('dog') && result.includes('salamander')) {
                result = answers[0]?.value === 'dog' ? '狗狗' : '蠑螈';
            } else if (result.includes('cat') && result.includes('rabbit')) {
                result = answers[5]?.value === 'cat' ? '米米' : '兔兔';
            } else if (result.includes('cat') && result.includes('salamander')) {
                result = answers[3]?.value === 'cat' ? '米米' : '蠑螈';
            } else if (result.includes('rabbit') && result.includes('salamander')) {
                result = answers[1]?.value === 'rabbit' ? '兔兔' : '蠑螈';
            }
        } else {
            result = result[0] === 'dog' ? '狗狗' :
                    result[0] === 'rabbit' ? '兔兔' :
                    result[0] === 'cat' ? '米米' : '蠑螈';
        }

        // 定義結果文字
        let imageUrl = '';

        // 添加額外描述
        if (result === '兔兔') {
            imageUrl = 'image/rabbit.png';
        } else if (result === '蠑螈') {
            imageUrl = 'image/salamander.png';
        } else if (result === '狗狗') {
            imageUrl = 'image/dog.png';
        } else if (result === '米米') {
            imageUrl = 'image/cat.png';
        }

        if (imageUrl) {
            resultText = `<img src="${imageUrl}" alt="${result}" style="max-width: 100%;"><br>`;
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
    const back = document.querySelector('.return');
    const foot = document.getElementById('foot');

    document.getElementById('result').style.display = 'none';
    quizContainer.style.display = 'none';
    content.style.display = 'block';
    h2.style.display = 'none';
    back.style.display = 'block';
    foot.style.display = 'block';

    window.scrollTo(0, 0);

    back.addEventListener('click', () => {
        document.getElementById('result').style.display = 'block';
        quizContainer.style.display = 'block';
        content.style.display = 'none';
        h2.style.display = 'block';
        back.style.display = 'none';
        foot.style.display = 'none';
        window.scrollTo(0, 0);
    });
}


function shareResult(imageUrl, result) {
    if (navigator.share) {
        navigator.share({
            title: '測驗結果',
            text: `我的室友類型是：${result}`,
            url: imageUrl
        }).then(() => {
            console.log('分享成功');
        }).catch(err => {
            console.error('分享失敗', err);
        });
    } else {
        alert('您的瀏覽器不支持分享功能');
    }
}

// 初始顯示第 1 頁
document.addEventListener('DOMContentLoaded', () => {
    showPage(currentPage);
    document.getElementById('submit-button').addEventListener('click', submitQuiz);
});
