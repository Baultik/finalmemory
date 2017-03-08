/**
 * Created by baultik on 11/15/16.
 */
(function () {
    var firstCardClicked = null;
    var secondCardClicked = null;
    var totalPossibleMatches = 9;
    var matchCounter = 0;
    var matches = 0;
    var attempts = 0;
    var accuracy = 0.0;
    var gamesPlayed = 0;
    var cursor = {
        width: 32,
        height: 26,
        image: null,
        currentTarget: null
    };
    var timer = null;

    $(document).ready(function () {
        gamesPlayed = 0;
        $(".card").on("click", cardClicked);
        $(".reset").click(resetBoard);

        $("#game-title").on("load", function () {
            initPointer();
        });

        $(window).resize(function () {
            onResize(500, updatePointer);
        });

        shuffle();
        displayStats();
    });

    function shuffle() {
        var cards = $(".card");
        cards.detach();
        cards.sort(function () {
            return Math.round(Math.random()) - 0.5;
        });

        $("#game-area").prepend(cards);
    }

    function resetBoard() {
        resetPointer();

        var cards = $(".card.flip");
        var last = $(".card.flip:last");
        var flipping = false;

        for (var i = 0; i < cards.length; i++) {
            var card = $(cards[i]);
            card.clearQueue();
            flipping = true;

            //flipping
            if (card[0] == last[0]) {
                //do once on last card
                card.removeClass("flip").one("transitionend", function () {
                    //Last card flipped - shuffling
                    firstCardClicked = null;
                    secondCardClicked = null;
                    shuffle();
                });
            } else {
                card.removeClass("flip");
            }
        }

        if (!flipping) {
            //no flipped cards
            firstCardClicked = null;
            secondCardClicked = null;
            shuffle();
        }

        //reset click handlers since they're removed on matched cards
        $(".card").off("click").on("click", cardClicked);

        //reset stats
        matchCounter = 0;
        gamesPlayed++;
        resetStats();
    }

    function cardClicked() {
        //If both cards have been selected - ignore further clicks until the variables have been reset
        if (firstCardClicked !== null && secondCardClicked !== null) return;

        var card = $(this);
        pointTo(card);

        card.addClass("flip");
        //remove click handler - so clicks on the 1st and 2nd card are ignored - handler added if mismatch
        card.off("click");

        if (firstCardClicked === null) {
            firstCardClicked = this;
        } else {
            secondCardClicked = this;

            //compare img src strings
            var firstCard = $(firstCardClicked).find(".front img").attr("src");
            var secondCard = $(secondCardClicked).find(".front img").attr("src");

            if (firstCard === secondCard) {
                //match
                matchCounter++;
                matches++;
                firstCardClicked = null;
                secondCardClicked = null;

                resetPointer();

                //Game won - calling modal to show you won
                if (matchCounter === totalPossibleMatches) {
                    $("#modal-win").modal("show");
                }
            } else {
                //mismatch
                //delay 2 secs - flip back - callback nulls vars and re-enables the handler on transition end
                $(firstCardClicked).delay(2000).queue(function (next) {
                    //Card 1 delay end
                    $(firstCardClicked).removeClass("flip").one("transitionend", function () {
                        firstCardClicked = null;
                        //Card 1 done flipping
                    });
                    next();
                });

                $(firstCardClicked).on("click", cardClicked);

                $(secondCardClicked).delay(2000).queue(function (next) {
                    //Card 2 delay end
                    resetPointer();
                    $(secondCardClicked).removeClass("flip").one("transitionend", function () {
                        secondCardClicked = null;
                        //Card 2 done flipping
                    });
                    next();
                });

                $(secondCardClicked).on("click", cardClicked);
            }

            //match attempted - update stats
            attempts++;
            accuracy = Math.round((matches / attempts) * 100);

            displayStats();
        }
    }

    function displayStats() {
        $(".games-played .value").text(gamesPlayed);
        $(".attempts .value").text(attempts);
        $(".accuracy .value").text("%" + accuracy);
    }

    function resetStats() {
        accuracy = 0;
        matches = 0;
        attempts = 0;
        displayStats();
    }

    function initPointer() {
        cursor.image = $("<img>", {
            src: "images/match_cursor.png",
            class: "pointer"
        });

        cursor.image.css({
            "position": "absolute"
        });

        $("body").append(cursor.image);

        resetPointer();
    }

    function pointTo(target) {
        //Point cursor at target element
        cursor.currentTarget = target;
        var position = target.offset();
        var centerY = position.top + (target.height() / 2);
        var y = centerY - (cursor.height / 2);
        var x = position.left - cursor.width;

        cursor.image.css({
            "left": x + "px",
            "top": y + "px"
        });
    }

    function resetPointer() {
        pointTo($("#game-title"));
    }

    function updatePointer() {
        //Pointer updated
        pointTo(cursor.currentTarget);
    }

    function onResize(time, callback) {
        //Re-sized setting timer
        if (timer != null) {
            clearTimeout(timer);
        }

        timer = setTimeout(callback, time);
    }
})();

