$(document).ready(function(){
    
    /*
        Heikki Heiskanen
        5.5.2017
        Wow Gold Calculator 
    */

    // TODO: needs refactoring.

    var startTime = null;
    var endTime = null;
    var duration = 0;

    var innerStartTime = null;
    var innerEndTime = null; 

    var startGold = 0;
    var startSilver = 0;
    var startCopper = 0;

    var endGold = 0;
    var endSilver = 0;
    var endCopper = 0;

    var goldPerHour = 0;
    var goldGained = 0;

    // hide calculate button
    $(".calc_button").hide();

    // clicking start timer
    $(".start_timer_button").on("click", function(event) {

        event.preventDefault();

         // read inputs
        startGold = $("#gold").val();
        startSilver = $("#silver").val();
        startCopper = $("#copper").val();

        // test inputs.
        if(startSilver > 99 || startSilver < 0 || startCopper > 99 || startCopper < 0 || startGold < 0) {
            alert("Amounts must be at range from 0 to 99.");

            // zero input fields
            $("#gold").val('');
            $("#silver").val('');
            $("#copper").val('');

            return;
        }

        // show/hide buttons
        $(this).hide();
        $(".calc_button").show();

        // get the date,
        var d = new Date();

        // cache time
        startTime = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        innerStartTime = d;

        // zero input fields
        $("#gold").val('');
        $("#silver").val('');
        $("#copper").val('');

    });

    // clicking end timer (calculate)
     $(".calc_button").on("click", function(event) {

        event.preventDefault();

        // read inputs
        endGold = $("#gold").val();
        endSilver = $("#silver").val();
        endCopper = $("#copper").val();

        // test the inputs
        if(endGold < 0 || endGold < startGold || endSilver < 0 || endSilver > 99 || endCopper < 0 || endCopper > 99) {
            alert("Remember to give the amount of money you currently have. You can't have less money in the end than in the start.");

            // zero input fields
            $("#gold").val('');
            $("#silver").val('');
            $("#copper").val('');

            return;
        }

        // show/hide buttons
        $(this).hide();
        $(".start_timer_button").show();

        // get the date.
        var d = new Date();

        // cache time
        endTime = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
        innerEndTime = d;

        // zero input fields
        $("#gold").val('');
        $("#silver").val('');
        $("#copper").val('');

        // --------------------------------------------------------------
        // calculate duration, gold gained and gold per hour
        // after that create an entry and add it to our table.
        
        // transform all to copper coins
        var s_copper = startGold * 10000 + startSilver * 100 + startCopper * 1;
        var e_copper = endGold * 10000 + endSilver * 100 + endCopper * 1;

        // get the difference
        var copper_dif_temp = e_copper - s_copper;
        var copper_difference_cache = copper_dif_temp;

        var gained_gold = 0;
        var gained_silver = 0;
        var gained_copper = 0;

        // transform copper to gp, sp, cp.
        if(copper_dif_temp / 10000 >= 1) {
            gained_gold = Math.floor(copper_dif_temp / 10000);
            copper_dif_temp -= gained_gold * 10000;
        } 
        
        if(copper_dif_temp / 100 >= 1) {
             gained_silver = Math.floor(copper_dif_temp / 100);
             copper_dif_temp -= gained_silver * 100;
        }

        gained_copper = copper_dif_temp;

        // this is a string of all information about moneys.
        goldGained = gained_gold + "g " + gained_silver + "s " + gained_copper + "c";

        // calculate duration
        var duration_seconds_temp = (Date.parse(innerEndTime) - Date.parse(innerStartTime)) / 1000;
        var duration_seconds_cache = duration_seconds_temp;

        var durationInSeconds = 0;
        var durationInMinutes = 0;
        var durationInHours = 0;

        if(duration_seconds_temp / 3600 >= 1) {
            durationInHours = Math.floor(duration_seconds_temp / 3600);
            duration_seconds_temp -= durationInHours * 3600;
        }

        if(duration_seconds_temp / 60 >= 1){
            durationInMinutes = Math.floor(duration_seconds_temp / 60);
            duration_seconds_temp -= durationInMinutes * 60;
        }

        durationInSeconds = duration_seconds_temp;

        duration = durationInHours + "h " + durationInMinutes + "min " + durationInSeconds + "s";

        // calculate gold per hour
        // 1. calculate multiplier 1 hour in seconds divided by duration in seconds.
        // 2. multiply the gained copper by percentage.
        var multiplier = (60 * 60) / duration_seconds_cache;
        var goldPerHourInCopper = copper_difference_cache * multiplier;

        var perHourGold = 0;
        var perHourSilver = 0;
        var perHourCopper = 0;

        // transform copper to gp, sp, cp.
        if(goldPerHourInCopper / 10000 >= 1) {
            perHourGold = Math.floor(goldPerHourInCopper / 10000);
            goldPerHourInCopper -= perHourGold * 10000;
        } 
        
        if(goldPerHourInCopper / 100 >= 1) {
             perHourSilver = Math.floor(goldPerHourInCopper / 100);
             goldPerHourInCopper -= perHourSilver * 100;
        }

        perHourCopper = Math.floor(goldPerHourInCopper);

        goldPerHour = perHourGold + "g " + perHourSilver + "s " + perHourCopper + "c";

        // create table entity
        var table_data =
         "<tr class=\"table_row\"> \
         <td>"+ startTime +"</td> \
         <td>"+ endTime +"</td> \
         <td>"+ duration +"</td> \
         <td>"+ goldGained +"</td> \
         <td>"+ goldPerHour +"</td> \
         </tr>"; 

        // append data
        $(".result_table_elements").append(table_data);

        // reset everything
        startGold = 0;
        startSilver = 0;
        startCopper = 0;

        endGold = 0;
        endSilver = 0;
        endCopper = 0;

        goldPerHour = 0;
        goldGained = 0;
    });

    // catch page refresh
    $(window).bind('beforeunload',function(){
        return 'are you sure you want to leave?';
    });

});