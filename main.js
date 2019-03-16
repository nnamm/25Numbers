const NUMBERS1 = ['01', '02', '03', '04', '05']; // Initial value of Button Row1
const NUMBERS2 = ['06', '07', '08', '09', '10']; // Row2
const NUMBERS3 = ['11', '12', '13', '14', '15']; // Row3
const NUMBERS4 = ['16', '17', '18', '19', '20']; // Row4
const NUMBERS5 = ['21', '22', '23', '24', '25']; // Row5
const BUTTON_COLOR = '#fd9535'; // Button color
const BUTTON_SUCCESS = '#fff'; // Button color (Success)
const CLEAR_MESSAGE = "Congrats!" // Clear message

// Game numbers 1-25
let gameNumbers = () => NUMBERS1.concat(NUMBERS2).concat(NUMBERS3).concat(NUMBERS4).concat(NUMBERS5);

// Vue
let app = new Vue({
  el: '#app',

  data: {
    gameNumbers: gameNumbers(), // Game numbers 1-25
    buttonRow1: NUMBERS1, // 5 numbers of Row1
    buttonRow2: NUMBERS2, // Row2
    buttonRow3: NUMBERS3, // Row3
    buttonRow4: NUMBERS4, // Row4
    buttonRow5: NUMBERS5, // Row5
    colors: setButtonColor(), // 1-25 button color

    checkCounter: 0, // Pushable button number
    message: CLEAR_MESSAGE, // Finish message

    startTime: 0, // Start button was pressed time
    nowTime: 0, // Current time
    diffTime: 0, // Difference time (nowTime - startTime)
    animateFrame: 0, //

    isStart: true, // Starting game flag
    isRunning: false, // Start button visible flag
    isShow: false //  
  },

  methods: {
    // Change the button color when the button is clicked in order
    checkNumber(clickBtnNum) {
      if (clickBtnNum == this.checkCounter) {
        // Clear button color
        this.$set(this.colors, clickBtnNum, BUTTON_SUCCESS);
        this.checkCounter++;
        // Stop the timer when finished
        if (this.checkCounter == 25) {
          this.stopTimer();
          this.isShow = true;
        }
      }
    },

    // Start the game
    startGame() {
      // Set the button randomly
      this.buttonRow1 = randomSort(this.gameNumbers);
      this.buttonRow2 = randomSort(this.gameNumbers);
      this.buttonRow3 = randomSort(this.gameNumbers);
      this.buttonRow4 = randomSort(this.gameNumbers);
      this.buttonRow5 = randomSort(this.gameNumbers);

      // Start the timer
      let vm = this; // loop()内で this の値が変更されるので退避
      vm.isStart = false;
      vm.setSubtractStartTime(vm.diffTime);
      // Loop process
      (function loop() {
        vm.nowTime = Math.floor(performance.now());
        vm.diffTime = vm.nowTime - vm.startTime;
        vm.animateFrame = requestAnimationFrame(loop);
      })();
      vm.isRunning = true;
    },

    // 現在時刻から引数に渡した数値を startTime に代入
    setSubtractStartTime(time) {
      let tmpTime = typeof time !== 'undefined' ? time : 0;
      this.startTime = Math.floor(performance.now() - tmpTime);
    },

    // Stop the timer
    stopTimer() {
      this.isRunning = false;
      this.isStart = false;
      cancelAnimationFrame(this.animateFrame);
    },

    // Clear all game data
    clearAllData() {
      this.startTime = 0;
      this.nowTime = 0;
      this.diffTime = 0;
      this.stopTimer();
      this.animateFrame = 0;
      this.gameNumbers = gameNumbers();
      this.colors = setButtonColor();
      this.checkCounter = 0;
      this.isShow = false;
    }
  },

  computed: {
    // Calc hours
    hours() {
      return Math.floor(this.diffTime / 1000 / 60 / 60);
    },
    // Clac minites (60分になったら0分に戻る)
    minutes() {
      return Math.floor(this.diffTime / 1000 / 60) % 60;
    },
    // Clas seconds (60秒になったら0秒に戻る)
    seconds() {
      return Math.floor(this.diffTime / 1000) % 60;
    },
    // Calc mill sec (1000ミリ秒になったら0ミリ秒に戻る)
    milliSeconds() {
      return Math.floor(this.diffTime % 1000);
    }
  },

  filters: {
    // ゼロ埋めフィルタ 引数に桁数を入力する
    zeroPad(value, num) {
      let tmpNum = typeof num !== 'undefined' ? num : 2;
      return value.toString().padStart(tmpNum, '0');
    }
  }
});

/**
 * randomSort: Set a number between 1 and 25 randomly.
 *
 * @param {Array of NUMBERS} num
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

/**
 * setButtonColor: Set the button color to the initial color.
 *
 * @return {Array}
 */
function setButtonColor() {
  let btnColor = [];
  [...Array(25)].forEach((_, i) => {
    btnColor[i] = BUTTON_COLOR;
  });
  return btnColor;
}