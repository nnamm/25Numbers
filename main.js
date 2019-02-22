const gameNumbers = [
    1, 2, 3, 4, 5,
    6, 7, 8, 9, 10,
    11, 12, 13, 14, 15,
    16, 17, 18, 19, 20,
    21, 22, 23, 24, 25
];
const bColor = "#fd9535"; // Button color
const bColorSuccess = "#fff"; // Button color (Success)
let btnColor = []; // Array of Button color data
let checkCounter = 0; // Pushable button number

let app = new Vue({
    el: '#app',

    created: function () {
        setButtonColor();
    },

    data: {
        buttons1: randomSort(gameNumbers), // 5 numbers of Row1
        buttons2: randomSort(gameNumbers), // Row2
        buttons3: randomSort(gameNumbers), // Row3
        buttons4: randomSort(gameNumbers), // Row4
        buttons5: randomSort(gameNumbers), // Row5
        colors: btnColor, // 1-25 button color
        startTime: 0, // Start button was pressed time
        nowTime: 0, // Current time
        diffTime: 0, // Difference time (nowTime - startTime)
        animateFrame: 0, //
        isRunning: false, // Start button flag
        isStart: true // Game flag
    },

    methods: {
        // Check clicked number
        checkNumber(btnId) {
            if (btnId == checkCounter) {
                // Clear button color
                this.$set(this.colors, btnId, bColorSuccess);
                checkCounter++;
                // Stop the timer when finished
                if (checkCounter == 25) {
                    this.stopTimer();
                }
            }
        },
        // 現在時刻から引数に渡した数値を startTime に代入
        setSubtractStartTime(time) {
            let tmpTime = typeof time !== 'undefined' ? time : 0;
            this.startTime = Math.floor(performance.now() - tmpTime);
        },
        // Start the timer
        startTimer() {
            // loop()内で this の値が変更されるので退避
            let vm = this;
            vm.isStart = false;
            vm.setSubtractStartTime(vm.diffTime);
            // Loop process
            (function loop() {
                vm.nowTime = Math.floor(performance.now())
                vm.diffTime = vm.nowTime - vm.startTime
                vm.animateFrame = requestAnimationFrame(loop)
            }());
            vm.isRtunning = true
        },
        // Stop the timer
        stopTimer() {
            this.isRunning = false;
            this.isStart = false;
            cancelAnimationFrame(this.animateFrame);
        },
        // Todo: ボタンデータを初期化する
        // Clear timer & button data
        clearAllData() {
            // Clear timer
            this.startTime = 0;
            this.nowTime = 0;
            this.diffTime = 0;
            this.stopTimer();
            this.animateFrame = 0;
            // Clear button data
            setButtonColor();
            checkCounter = 0;
        }
    },

    computed: {
        // Calc hours
        hours() {
            return Math.floor(this.diffTime / 1000 / 60 / 60)
        },
        // Clac minites (60分になったら0分に戻る)
        minutes() {
            return Math.floor(this.diffTime / 1000 / 60) % 60
        },
        // Clas seconds (60秒になったら0秒に戻る)
        seconds() {
            return Math.floor(this.diffTime / 1000) % 60
        },
        // Calc mill sec (1000ミリ秒になったら0ミリ秒に戻る)
        milliSeconds() {
            return Math.floor(this.diffTime % 1000)
        }
    },

    filters: {
        // ゼロ埋めフィルタ 引数に桁数を入力する
        zeroPad(value, num) {
            let tmpNum = typeof num !== 'undefined' ? num : 2
            return value.toString().padStart(tmpNum, "0")
        }
    }
});

/**
 * setButtonColor: ボタンカラーを初期カラーに設定する。
 * 
 * @return {void}
 */
function setButtonColor() {
    [...Array(25)].forEach((_, i) => {
        btnColor[i] = bColor;
    })
}

/**
 * randomSort: 1〜25の数字を配列にランダム設定する。
 * 1行5列のボタンを5回に分けて作る想定。
 * 
 * @param {Array of gameNumbers} num
 *  
 * @return {Array} 
 */
function randomSort(num) {
    let arrayData = num;
    let resultArray = [];
    for (let i = 0; i < 5; i++) {
        let arrayIndex = Math.floor(Math.random() * arrayData.length);
        resultArray[i] = arrayData[arrayIndex];
        arrayData.splice(arrayIndex, 1);
    }
    return resultArray;
}