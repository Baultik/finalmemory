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
    $(".card").find(".back").show();
    match_counter = 0;
    first_card_clicked = null;
    second_card_clicked = null;
}

function card_clicked(event) {
    //Toggle the back image since it's in front of the front one
    $(this).find(".back").toggle("fast");

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

            //Delay 2 secs - Show the back again - callback nulls vars and last reenables the handler
            $(first_card_clicked).find(".back").delay(2000).toggle("fast","linear",function () {
                first_card_clicked = null;
            });
            $(second_card_clicked).find(".back").delay(2000).toggle("fast","linear",function () {
                second_card_clicked = null;
                $(".card").on("click",card_clicked);
            });
        }
    }
}