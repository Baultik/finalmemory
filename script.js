/**
 * Created by baultik on 11/15/16.
 */
var first_card_clicked = null;
var second_card_clicked = null;
var total_possible_matches = 2;
var match_counter = 0;

$(document).ready(function () {
    $(".card").on("click",card_clicked);
    $(".reset").click(resetBoard);
});

function resetBoard() {
    $(".card").off();
    $(".card").clearQueue();
    $(".card").removeClass("flip").one("transitionend", function () {
        $(".card").on("click",card_clicked);
    });
    match_counter = 0;
    first_card_clicked = null;
    second_card_clicked = null;
}

function card_clicked(event) {
    //
    $(this).addClass("flip");
    //remove click handler since the card div triggered the click and can receive additional clicks
    $(this).off();

    if (first_card_clicked === null) {
        first_card_clicked = this;//Save this -  the card element
    } else {
        second_card_clicked = this;//Save this -  the card element

        //compare img src strings
        var firstCard = $(first_card_clicked).find(".front img").attr("src");
        var secondCard = $(second_card_clicked).find(".front img").attr("src");

        if (firstCard === secondCard) {
            match_counter++;
            first_card_clicked = null;
            second_card_clicked = null;

            //Game won - calling modal to show you won
            if (match_counter === total_possible_matches) {
                $("#modal-win").modal();
            }
        } else {
            //disable click handlers
            $(".card").off();

            //Delay 2 secs - show the back again - callback nulls vars and reenables the handler on transition end
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
    }
}