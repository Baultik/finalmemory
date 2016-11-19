/**
 * Created by baultik on 11/15/16.
 */
var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 9;
var match_counter = 0;
var matches = 0;
var attempts = 0;
var accuracy = 0.0;
var games_played = 0;
var cursor = {
    width:32,
    height:26,
    image:null,
    currentTarget:null,
};
var timer = null;

$(document).ready(function () {
    games_played = 0;
    $(".card").on("click",card_clicked);
    $(".reset").click(resetBoard);

    $("#game-title").on("load",function () {
        initPointer();
    });

    $(window).resize(function () {
        onResize(500,updatePointer);
    });

    shuffle();
    display_stats();
});

function shuffle() {
    var cards = $(".card");
    cards.detach();
    cards.sort(function(){
        var rand = Math.round(Math.random()) - 0.5;
        return rand;
    });

    $("#game-area").prepend(cards);
}

function resetBoard() {
    resetPointer();
    //console.log("Resetting...");

    var cards =$(".card.flip");
    var last = $(".card.flip:last");
    var flipping = false;

    for (var i = 0; i < cards.length; i++) {
        var card = $(cards[i]);
        card.clearQueue();
        flipping = true;

        //console.log("flipping...");

        if (card[0] == last[0]) {
            //do once on last card
            card.removeClass("flip").one("transitionend", function () {
                //console.log("Last card flipped - shuffling...");
                first_card_clicked = null;
                second_card_clicked = null;
                shuffle();
            });
        } else {
            card.removeClass("flip");
        }
    }

    if (!flipping) {
        //console.log("no flipped cards");
        first_card_clicked = null;
        second_card_clicked = null;
        shuffle();
    }

    //reset click handlers since they're removed on matched cards
    $(".card").off("click").on("click",card_clicked);

    //reset stats
    match_counter = 0;
    games_played++;
    reset_stats();
}

function card_clicked(event) {
    //If both cards have been selected - ignore further clicks until the variables have been reset
    if(first_card_clicked !== null && second_card_clicked !== null) return;
    console.log("Valid click");
    var card = $(this);
    pointTo(card);

    card.addClass("flip");
    //remove click handler - so clicks on the 1st and 2nd card are ignored - handler added if mismatch
    card.off("click");

    if (first_card_clicked === null) {
        first_card_clicked = this;//var is the card element
        console.log("First card");
    } else {
        second_card_clicked = this;//var is the card element
        console.log("Second card");
        //compare img src strings
        var firstCard = $(first_card_clicked).find(".front img").attr("src");
        var secondCard = $(second_card_clicked).find(".front img").attr("src");

        if (firstCard === secondCard) {
            //match
            match_counter++;
            matches++;
            //console.log("Match");
            first_card_clicked = null;
            second_card_clicked = null;

            resetPointer();

            //Game won - calling modal to show you won
            if (match_counter === total_possible_matches) {
                $("#modal-win").modal("show");
            }
        } else {
            //mismatch
            //console.log("Mismatch");
            //delay 2 secs - flip back - callback nulls vars and re-enables the handler on transition end
            $(first_card_clicked).delay(2000).queue(function (next) {
                //console.log("Card 1 delay end");
                $(first_card_clicked).removeClass("flip").one("transitionend", function () {
                    first_card_clicked = null;
                    //console.log("Card 1 done flipping");
                });
                next();
            });

            $(first_card_clicked).on("click",card_clicked);

            $(second_card_clicked).delay(2000).queue(function (next) {
                //console.log("Card 2 delay end");
                resetPointer();
                $(second_card_clicked).removeClass("flip").one("transitionend", function () {
                    second_card_clicked = null;
                    //console.log("Card 2 done flipping");
                });
                next();
            });

            $(second_card_clicked).on("click",card_clicked);
        }

        //match attempted - update stats
        attempts++;
        var percentage = Math.round((matches / attempts) * 100);
        accuracy = percentage;

        display_stats();
    }
}

function display_stats() {
    $(".games-played .value").text(games_played);
    $(".attempts .value").text(attempts);
    $(".accuracy .value").text("%"+accuracy);
}

function reset_stats() {
    accuracy = 0;
    matches = 0;
    attempts = 0;
    display_stats();
}

function initPointer () {
    cursor.image = $("<img>",{
        src:"images/match_cursor.png",
        class:"pointer"
    });

    cursor.image.css({
        "position":"absolute",
    });

    $("body").append(cursor.image);

    resetPointer();
}

function pointTo(target) {
    //console.log("Point at:",target);
    cursor.currentTarget = target;
    var position = target.offset();
    var centerY = position.top +(target.height() / 2);
    var y = centerY - (cursor.height / 2);
    var x = position.left - cursor.width;

    cursor.image.css({
        "left":x +"px",
        "top":y + "px",
    });
}

function resetPointer() {
    pointTo($("#game-title"));
}

function updatePointer() {
    //console.log("Pointer updated");
    pointTo(cursor.currentTarget);
}

function onResize(time, callback) {
    //console.log("Resized setting timer");
    if (timer != null) {
        clearTimeout(timer);
    }

    timer = setTimeout(callback,time);
}

