(function () {
    var colors = ['green', 'red', 'yellow', 'blue'];

    var Gameboard = {
        level: 0,
        maxLevel: 20,
        started: false,
        strict: false,
        series: [],
        playingSeries: false,
        userTurn: false,
        on: false,

        sounds: {
            green: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound1.mp3'),
            red: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound2.mp3'),
            yellow: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound3.mp3'),
            blue: new Audio('https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'),
            error: new Audio('src/sounds/error.mp3'),
            victory: new Audio('src/sounds/victory.mp3')
        }
    };

    Gameboard.showLevel = function (number) {
        var level = document.getElementById('level');
        level.innerHTML = number;
    };

    Gameboard.generateColorsLevel = function () {
        Gameboard.series.push(colors[(Math.floor(Math.random() * 4))]);
    };

    Gameboard.start = function () {
        if (!Gameboard.started && Gameboard.on) {
            Gameboard.started = true;
            Gameboard.level = 1;
            Gameboard.generateColorsLevel();
            Gameboard.showLevel(Gameboard.level);
            Gameboard.playGame(Gameboard.series, 0);
            expectedSeriesIndex = 0;
        }
    };

    Gameboard.reset = function () {
        Gameboard.playingSeries = false;
        Gameboard.userTurn = false;
        Gameboard.started = false;
        Gameboard.level = 1;
        Gameboard.showLevel('--');
        Gameboard.series = [];
    };

    Gameboard.playGame = function (series, playingSeriesIndex) {
        Gameboard.playingSeries = true;
        Gameboard.userTurn = false;
        Gameboard.showLevel(Gameboard.level);
        if (Gameboard.started) {
            var color = document.getElementById(series[playingSeriesIndex]);
            color.classList.toggle('lighter');
            Gameboard.sounds[series[playingSeriesIndex]].play();
            setTimeout(function () {
                color.classList.toggle('lighter');
                playingSeriesIndex++;
                if (playingSeriesIndex < series.length) {
                    setTimeout(function () {
                        Gameboard.playGame(series, playingSeriesIndex);
                    }, 180)
                } else {
                    Gameboard.playingSeries = false;
                    Gameboard.userTurn = true;
                    Gameboard.showLevel(Gameboard.level);
                }
            }, 480)
        }
    };

    var expectedSeriesIndex = 0;

    function handleClickOnColor(e) {
        if (Gameboard.userTurn) {
            var clickedColor = e.target.getAttribute('id');
            Gameboard.sounds[clickedColor].play();

            if (wrongClickOnColor(clickedColor, expectedSeriesIndex)) {
                Gameboard.sounds.error.play();

                e.target.classList.toggle('error');
                setTimeout(function () {
                    e.target.classList.toggle('error');
                }, 480);

                if (Gameboard.strict) {
                    Gameboard.reset();
                }

                expectedSeriesIndex = 0;
            } else {
                e.target.classList.toggle('lighter');
                setTimeout(function () {
                    e.target.classList.toggle('lighter');
                }, 480);

                if (expectedSeriesIndex === Gameboard.series.length - 1) {
                    Gameboard.nextLevel();
                    expectedSeriesIndex = 0;
                } else {
                    expectedSeriesIndex += 1;
                }
            }
        }
    }

    Gameboard.nextLevel = function () {
        if (Gameboard.level === Gameboard.maxLevel) {
            Gameboard.sounds.victory.play();
            Gameboard.showLevel("WON");
            Gameboard.reset();
            return;
        }

        Gameboard.showLevel('good');
        Gameboard.level += 1;
        Gameboard.generateColorsLevel();
        setTimeout(function () {
            Gameboard.playGame(Gameboard.series, 0)
        }, 1000)
    };

    function wrongClickOnColor(clickedColor, index) {
        var rightClickedColor = Gameboard.series[index];
        return rightClickedColor !== clickedColor;
    }


    var switchBox = document.getElementsByClassName('box')[0];
    var switcher = document.getElementsByClassName('switch')[0];

    Gameboard.togglePower = function () {
        Gameboard.on = !Gameboard.on;
        switcher.classList.toggle('active');

        if (!Gameboard.on) {
            Gameboard.reset();
        }
    };

    var colorButtons = document.getElementsByClassName('buttons');
    for (var i = 0; i < colorButtons.length; i++) {
        colorButtons[i].addEventListener('click', handleClickOnColor)
    }

    var start = document.getElementById('start');
    var strict = document.getElementById('strict');

    switchBox.addEventListener('click', Gameboard.togglePower);
    start.addEventListener('click', Gameboard.start);
    strict.addEventListener('click', function () {
        if (Gameboard.on) {
            Gameboard.strict = !Gameboard.strict;
            strict.classList.toggle('active');
        }
    });
})();