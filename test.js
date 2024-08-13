let currentPage = 1;
const totalPages = 5;

function showPage(pageNumber) {
    for (let i = 1; i <= totalPages; i++) {
        document.getElementById(`page-${i}`).style.display = i === pageNumber ? 'block' : 'none';
    }
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
        if (event) event.preventDefault(); // 阻止表單默認提交行為
        const form = document.getElementById('quiz-form');
        const resultDiv = document.getElementById('result');

        // 簡單的結果判斷
        const answers = document.querySelectorAll('input[type="radio"]:checked');
        let score = {dog: 0, rabbit: 0, cat: 0, salamander: 0};
        
        answers.forEach(answer => {
            score[answer.value]++;
        });

        let maxScore = Math.max(...Object.values(score));
        let result = Object.keys(score).filter(animal => score[animal] === maxScore);

        if (result.length > 1) {
            // 處理同分情況
            if (result.includes('dog') && result.includes('rabbit')) {
                result = answers[2].value === 'rabbit' ? '兔兔' : '狗狗';
            } else if (result.includes('dog') && result.includes('cat')) {
                result = answers[0].value === 'dog' ? '狗狗' : '貓貓';
            } else if (result.includes('dog') && result.includes('salamander')) {
                result = answers[0].value === 'dog' ? '狗狗' : '蠑螈';
            } else if (result.includes('cat') && result.includes('rabbit')) {
                result = answers[4].value === 'cat' ? '貓貓' : '兔兔';
            } else if (result.includes('cat') && result.includes('salamander')) {
                result = answers[3].value === 'cat' ? '貓貓' : '蠑螈';
            } else if (result.includes('rabbit') && result.includes('salamander')) {
                result = answers[1].value === 'rabbit' ? '兔兔' : '蠑螈';
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
            resultText += '<br>兔子：<br>老好人aka宿舍的氣氛調節器，很習慣團體生活，會在你意想不到的時候拿出偷偷藏許久的好貨。';
            imageUrl = 'rabbit.png';
        } else if (result === '蠑螈') {
            resultText += '<br>蠑螈：<br>是一個看起來平時都在睡覺、都活在自己的世界裡的傢伙。要湊單的時候可以直接算進名單的人頭，是一個很隨和的人。只是有的時候天然呆到令人驚訝......';
            imageUrl = 'salamander.png';
        } else if (result === '狗狗') {
            resultText += '<br>狗狗：<br>很開朗熱情的類型，喜歡一些戶外/團體活動，可惜有的時候不太會讀氣氛，可能不會知道自己惹人生氣了';
            imageUrl = 'dog.png';
        } else if (result === '貓貓') {
            resultText += '<br>貓貓：<br>感覺是話很少的人，喜歡獨來獨往（或只跟特定對象一起行動），但意外地知道很多宿舍秘辛';
            imageUrl = 'cat.png';
        }

        if (imageUrl) {
            resultText = `<img src="${imageUrl}" alt="${result}" style="max-width: 100%;"><br>` + resultText;
        }

        // 添加提示文字
        resultText += '<br><small>長按上方結果圖就能儲存囉！</small>';

        // 添加“再測一次”按鈕
        resultText += '<br><button onclick="restartQuiz()">再測一次</button>';

        // 添加“分享結果”按鈕
        resultText += `<br><button onclick="shareResult('${imageUrl}', '${result}')">分享結果</button>`;

        // 隱藏所有頁面，顯示結果
        document.querySelectorAll('.quiz-page').forEach(page => page.style.display = 'none');
        resultDiv.innerHTML = resultText; // 使用 innerHTML 來顯示包含 HTML 的內容
        resultDiv.style.display = 'block';
    } else {
        alert("你沒有選到選項哦");
    }
}

function restartQuiz() {
    currentPage = 1;
    showPage(currentPage);
    document.getElementById('result').style.display = 'none';

    // 清除之前的選擇
    const answers = document.querySelectorAll('input[type="radio"]:checked');
    answers.forEach(answer => answer.checked = false);

    // 重新顯示第一頁
    document.getElementById(`page-${currentPage}`).style.display = 'block';
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
});

