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

$(document).ready(function () {
    games_played = 0;
    $(".card").on("click",card_clicked);
    $(".reset").click(resetBoard);
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
    //clear queue if yet to flip - flip if necessary
    if ($(".card").hasClass("flip")) {
        $(".card").clearQueue();
        $(".card").removeClass("flip").one("transitionend", function () {
            //$(".card").on("click",card_clicked);

        });
    }
    shuffle();

    //reset click handlers since I'm removing it on matched cards
    $(".card").off("click").on("click",card_clicked);

    //Reset vars
    match_counter = 0;
    first_card_clicked = null;
    second_card_clicked = null;

    games_played++;
    reset_stats();
}

function card_clicked(event) {
    //
    $(this).addClass("flip");
    //remove click handler since the card div triggered the click and can receive additional clicks
    $(this).off("click");

    if (first_card_clicked === null) {
        first_card_clicked = this;//Save this -  the card element
    } else {
        second_card_clicked = this;//Save this -  the card element
        attempts++;

        //compare img src strings
        var firstCard = $(first_card_clicked).find(".front img").attr("src");
        var secondCard = $(second_card_clicked).find(".front img").attr("src");

        if (firstCard === secondCard) {
            match_counter++;
            matches++;
            first_card_clicked = null;
            second_card_clicked = null;

            //Game won - calling modal to show you won
            if (match_counter === total_possible_matches) {
                $("#modal-win").modal();
            }
        } else {
            //disable click handlers
            $(".card").off("click");

            //Delay 2 secs - flip back - callback nulls vars and re-enables the handler on transition end
            $(first_card_clicked).delay(2000).queue(function (next) {
                $(first_card_clicked).removeClass("flip");
                first_card_clicked = null;
                next();
            });

            $(second_card_clicked).delay(2000).queue(function (next) {
                $(second_card_clicked).removeClass("flip").one("transitionend", function () {
                    $(".card").on("click",card_clicked);
                });
                second_card_clicked = null;
                next();
            });
        }

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