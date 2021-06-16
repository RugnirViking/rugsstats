$( document ).ready(function() {
    console.log( "ready!" );
    var endpoint = 'https://api.blaseball-reference.com/v1/currentRoster?teamId=a37f9158-7f82-46bc-908c-c9e2dda7c33b&includeShadows=true';
    $.support.cors = true;
    $.ajax({
        url: endpoint ,
        dataType: 'json',
        crossDomain: true,
        type: "GET",
        success: function(result){
            console.log(result);
            div = document.getElementById( 'teamlist' );
            for (var i=0;i<result.length;i++){
                var player = result[i];
                var playerRow = document.createElement("tr");
                
                var playerNum = document.createElement("th");
                playerNum.textContent = ""+i;
                playerNum.setAttribute("scope","row");

                var playerName = document.createElement("td");
                playerName.textContent = ""+player.player_name;

                var playerBlood = document.createElement("td");
                playerBlood.textContent = ""+player.blood;


                playerRow.append(playerNum);
                playerRow.append(playerName);
                playerRow.append(playerBlood);

                if (player.position_type=="BATTER"){
                    div = document.getElementById( 'lineup' );

                } else if (player.position_type=="PITCHER"){
                    div = document.getElementById( 'rotation' );

                } else if (player.position_type=="SHADOWS"){
                    div = document.getElementById( 'slineup' );

                } else {
                    div = document.getElementById( 'slineup' );

                }
                div.append(playerRow);
            }
        }
    });
});