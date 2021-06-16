var playersJSON={};
$( document ).ready(function() {
    console.log( "ready!" );
    var endpoint = 'https://api.blaseball-reference.com/v2/players?season=current&playerPool=alive';
    $.support.cors = true;
    document.getElementById("submitButton").onclick = queryPlayers
    document.getElementById("submitButtonOutlier").onclick = queryPlayersOutliers
    $.ajax({
        url: endpoint ,
        dataType: 'json',
        crossDomain: true,
        type: "GET",
        success: function(result){
            console.log(result);
            playersJSON = result;
        }
    });
});
// function popHighest(list){
//     var highestDistance = 0;
//     var highestPlayerIndex = 999;
//     for (var j=0;j<list.length;j++){
//         if (list[j].distance>highestDistance){
//             highestPlayerIndex = j;
//             highestDistance = list[j].distance;
//         }
//     }
//     list.splice(highestPlayerIndex, 1);
//     return 
// }

var sortDir = 0;
var statSelectVal = 0;

function compareSort( a, b ) {
    if (sortDir===0){
        if ( a[statSelectVal] < b[statSelectVal] ){
            return -1;
        }
        if ( a[statSelectVal] > b[statSelectVal] ){
            return 1;
        }
        return 0;
    } else {
        if ( a[statSelectVal] < b[statSelectVal] ){
            return 1;
        }
        if ( a[statSelectVal] > b[statSelectVal] ){
            return -1;
        }
        return 0;
    }
}
function queryPlayersOutliers(caller){
    $("#exampleModal").modal();
    var statSelect = document.getElementById("stat2Select").value;
    var statDir = document.getElementById("statDir").value;

    if (statDir==="Highest"){
        sortDir=1;
    } else {
        sortDir=0;
    }
    
    if (statSelect==="Fingers"){
        statSelect = "total_fingers";
    } else if (statSelect==="Ground Friction"){
        statSelect = "ground_friction";
    } else if (statSelect==="Basethirst"){
        statSelect = "base_thirst";
    }

    statSelectVal = statSelect.toLowerCase();
    document.getElementById("statName").innerText = statSelect;
    document.getElementById("modalTable").innerHTML = '';

    const activePlayers = playersJSON.sort( compareSort ).slice(0,10);
    
    div = document.getElementById( 'modalTable' );
    for (var j=0;j<activePlayers.length;j++){
        var playerRow = document.createElement("tr");
        playerRow.classList.add("playerRow");
        playerRow.classList.add("clickable-row");
        playerRow.href = "https://blaseball-reference.com/players/"+activePlayers[j].player_id;
    
        var playerNum = document.createElement("th");
        playerNum.textContent = ""+(j+1);
        playerNum.setAttribute("scope","row");
    
        var playerName = document.createElement("td");
        playerName.textContent = ""+activePlayers[j].player_name;
    
        var playerBlood = document.createElement("td");
        playerBlood.textContent = ""+activePlayers[j][statSelect.toLowerCase()].toFixed(5);
    
        playerRow.append(playerNum);
        playerRow.append(playerName);
        playerRow.append(playerBlood);
    
        div.append(playerRow);
    }
    $("#diffCol").hide();
    $("#matchCol").hide();
    $(".clickable-row").click(function() {
        window.location = $(this)[0].href;
    });
}
function compare( a, b ) {
    if ( a.distance < b.distance ){
      return -1;
    }
    if ( a.distance > b.distance ){
      return 1;
    }
    return 0;
  }
function queryPlayers(caller){
    $("#exampleModal").modal();
    var targetStatVal = document.getElementById("statval").value;
    var statSelect = document.getElementById("statSelect").value;
    document.getElementById("statName").innerText = statSelect;
    document.getElementById("modalTable").innerHTML = '';

    if (statSelect==="Fingers"){
        statSelect = "total_fingers";
    } else if (statSelect==="Ground Friction"){
        statSelect = "ground_friction";
    } else if (statSelect==="Basethirst"){
        statSelect = "base_thirst";
    }

    for (var i=0;i<playersJSON.length;i++){
        var player = playersJSON[i];
        var statVal = player[statSelect.toLowerCase()];
        if (player.current_state === "active"){
            player.distance = Math.abs(targetStatVal-statVal);
        }
    }

    $("#diffCol").show();
    $("#matchCol").show();
    const activePlayers = playersJSON.sort( compare ).slice(0,10);
    
    div = document.getElementById( 'modalTable' );
    for (var j=0;j<activePlayers.length;j++){
        var playerRow = document.createElement("tr");
        playerRow.classList.add("playerRow");
        playerRow.classList.add("clickable-row");
        playerRow.href = "https://blaseball-reference.com/players/"+activePlayers[j].player_id;
    
        var playerNum = document.createElement("th");
        playerNum.textContent = ""+(j+1);
        playerNum.setAttribute("scope","row");
    
        var playerName = document.createElement("td");
        playerName.textContent = ""+activePlayers[j].player_name;
    
        var playerBlood = document.createElement("td");
        playerBlood.textContent = ""+activePlayers[j][statSelect.toLowerCase()].toFixed(5);
    
    
        var playerDiff = document.createElement("td");
        playerDiff.textContent = ""+Math.abs(targetStatVal-activePlayers[j][statSelect.toLowerCase()]).toFixed(5);
        
        
        var playerpct = document.createElement("td");
        playerpct.textContent = ""+((Math.abs(targetStatVal-activePlayers[j][statSelect.toLowerCase()])/targetStatVal)*100).toFixed(5);
    
        playerRow.append(playerNum);
        playerRow.append(playerName);
        playerRow.append(playerBlood);
        playerRow.append(playerDiff);
        playerRow.append(playerpct);
    
        div.append(playerRow);
    }
    
    $(".clickable-row").click(function() {
        window.location = $(this)[0].href;
    });
}