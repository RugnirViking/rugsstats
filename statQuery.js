var playersJSON={};
var items=[];
var statNames=["Tragicness","Buoyancy","Thwackability","Moxie","Divinity","Musclitude","Patheticism","Martyrdom","Cinnamon","baseThirst","Laserlikeness","Continuation","Indulgence","groundFriction","Shakespearianism","Suppression","Unthwackability","Coldness","Overpowerment","Ruthlessness","Pressurization","Omniscience","Tenaciousness","Watchfulness","Anticapitalism","Chasiness"];
$( document ).ready(function() {
    console.log( "ready!" );
    var endpoint = 'https://api.blaseball-reference.com/v2/players?season=current';
    $.support.cors = true;
    document.getElementById("submitButton").onclick = queryPlayers
    document.getElementById("submitButtonOutlier").onclick = queryPlayersOutliers
    document.getElementById("submitButtonItem").onclick = queryItems
    $.ajax({
        url: endpoint ,
        dataType: 'json',
        crossDomain: true,
        type: "GET",
        success: function(result){
            console.log("Loaded playerdata successfully")
            playersJSON = result;
        }
    });
    var itemendpoint = 'https://api.sibr.dev/chronicler/v2/entities?type=item';
    $.ajax({
        url: itemendpoint ,
        dataType: 'json',
        crossDomain: true,
        type: "GET",
        success: function(result){
            console.log("Loaded itemdata successfully")
            items = result.items;
            listitems(items);
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
function listitems(result){
    // this just lists all item mods in the selector
    var modsList=[];
    for (var j=0;j<result.length;j++){
        var item = result[j].data;
        if (item.prefixes!=null){
            for (var i=0;i<item.prefixes.length;i++){
                var prefix = item.prefixes[i];
                for (var a=0;a<prefix.adjustments.length;a++){
                    var adjustment = prefix.adjustments[a];
                    var mod = adjustment.mod;
                    if (mod!=undefined){
                        // check if we've seen it already
                        modsList.indexOf(mod) === -1 ? modsList.push(mod) : 0;
                    }
                }
            }
        }
        if (item.prePrefix!=null){
            var prefix = item.prePrefix;
            for (var a=0;a<prefix.adjustments.length;a++){
                var adjustment = prefix.adjustments[a];
                var mod = adjustment.mod;
                if (mod!=undefined){
                    // check if we've seen it already
                    modsList.indexOf(mod) === -1 ? modsList.push(mod) : 0;
                }
            }
        }
        if (item.postPrefix!=null){
            var prefix = item.postPrefix;
            for (var a=0;a<prefix.adjustments.length;a++){
                var adjustment = prefix.adjustments[a];
                var mod = adjustment.mod;
                if (mod!=undefined){
                    // check if we've seen it already
                    modsList.indexOf(mod) === -1 ? modsList.push(mod) : 0;
                }
            }
        }
        if (item.suffix!=null){
            var prefix = item.suffix;
            for (var a=0;a<prefix.adjustments.length;a++){
                var adjustment = prefix.adjustments[a];
                var mod = adjustment.mod;
                if (mod!=undefined){
                    // check if we've seen it already
                    modsList.indexOf(mod) === -1 ? modsList.push(mod) : 0;
                }
            }
        }
    }
    for (var j=0;j<modsList.length;j++){
        var mod = modsList[j];
        var parent = document.getElementById("modSelect");

        var modEntry = document.createElement("option");
        modEntry.innerText = mod;
        parent.appendChild(modEntry);
    }
}
function playersWithItem(itemName){
    list = [];
    for (var j=0;j<playersJSON.length;j++){
        player = playersJSON[j];
        if (player.items.includes(itemName)){
            list.push(player);
        }
    }
    return list;
}
function itemsWithMod(modToCheck){
    list = [];
    for (var j=0;j<items.length;j++){
        var item = items[j].data;
        if (item.prefixes!=null){
            for (var i=0;i<item.prefixes.length;i++){
                var prefix = item.prefixes[i];
                for (var a=0;a<prefix.adjustments.length;a++){
                    var adjustment = prefix.adjustments[a];
                    var mod = adjustment.mod;
                    if (mod!=undefined){
                        // check if we've seen it already
                        if(mod==modToCheck){
                            list.push(items[j]);
                        }
                    }
                }
            }
        }
        if (item.prePrefix!=null){
            var prefix = item.prePrefix
            for (var a=0;a<prefix.adjustments.length;a++){
                var adjustment = prefix.adjustments[a];
                var mod = adjustment.mod;
                if (mod!=undefined){
                    // check if we've seen it already
                    if(mod==modToCheck){
                        list.push(items[j]);
                    }
                }
            }
        }
        if (item.postPrefix!=null){
            var prefix = item.postPrefix
            for (var a=0;a<prefix.adjustments.length;a++){
                var adjustment = prefix.adjustments[a];
                var mod = adjustment.mod;
                if (mod!=undefined){
                    // check if we've seen it already
                    if(mod==modToCheck){
                        list.push(items[j]);
                    }
                }
            }
        }
        if (item.suffix!=null){
            var prefix = item.suffix
            for (var a=0;a<prefix.adjustments.length;a++){
                var adjustment = prefix.adjustments[a];
                var mod = adjustment.mod;
                if (mod!=undefined){
                    // check if we've seen it already
                    if(mod==modToCheck){
                        list.push(items[j]);
                    }
                }
            }
        }
    }
    return list;
}
var itemSortDir = 0;
var itemStatSelectVal = 0;
function compareSortItems(a, b) {
    if (sortDir===0){
        if ( itemTotalStat(a,itemStatSelectVal) < itemTotalStat(b,itemStatSelectVal)){
            return -1;
        }
        if ( itemTotalStat(a,itemStatSelectVal) > itemTotalStat(b,itemStatSelectVal) ){
            return 1;
        }
        return 0;
    } else {
        if ( itemTotalStat(a,itemStatSelectVal) < itemTotalStat(b,itemStatSelectVal) ){
            return 1;
        }
        if ( itemTotalStat(a,itemStatSelectVal) > itemTotalStat(b,itemStatSelectVal) ){
            return -1;
        }
        return 0;
    }
}
function itemTotalStat(itemR,statName){
    var statVal = 0;
    var item={};
    if (itemR.data!=undefined){
        item = itemR.data;
    } else {
        item = itemR;
    }
    if (item.root!=null){
        var prefix = item.root;
        for (var a=0;a<prefix.adjustments.length;a++){
            var adjustment = prefix.adjustments[a];
            if (adjustment.type==1){
                if (adjustment.stat == statNames.indexOf(statName)){
                    statVal+=adjustment.value;
                }
            }
        }
    }
    if (item.prefixes!=null){
        for (var i=0;i<item.prefixes.length;i++){
            var prefix = item.prefixes[i];
            for (var a=0;a<prefix.adjustments.length;a++){
                var adjustment = prefix.adjustments[a];
                if (adjustment.type==1){
                    if (adjustment.stat == statNames.indexOf(statName)){
                        statVal+=adjustment.value;
                    }
                }
            }
        }
    }
    if (item.prePrefix!=null){
        var prefix = item.prePrefix;
        for (var a=0;a<prefix.adjustments.length;a++){
            var adjustment = prefix.adjustments[a];
            if (adjustment.type==1){
                if (adjustment.stat == statNames.indexOf(statName)){
                    statVal+=adjustment.value;
                }
            }
        }
    }
    if (item.postPrefix!=null){
        var prefix = item.postPrefix;
        for (var a=0;a<prefix.adjustments.length;a++){
            var adjustment = prefix.adjustments[a];
            if (adjustment.type==1){
                if (adjustment.stat == statNames.indexOf(statName)){
                    statVal+=adjustment.value;
                }
            }
        }
    }
    if (item.suffix!=null){
        var prefix = item.suffix;
        for (var a=0;a<prefix.adjustments.length;a++){
            var adjustment = prefix.adjustments[a];
            if (adjustment.type==1){
                if (adjustment.stat == statNames.indexOf(statName)){
                    statVal+=adjustment.value;
                }
            }
        }
    }
    return statVal;
}

function playerHolding(itemName,health,durability){
    for (var j=0;j<playersJSON.length;j++){
        var curPlayer = playersJSON[j];
        for (var i=0;i<curPlayer.items.length;i++){
            var curItemName = curPlayer.items[i];
            if (curItemName==itemName && curPlayer.healths[i]==health){
                return curPlayer;
            }
        }
    }
}
function queryItems(){
    $("#exampleModal").modal();

    var statSelect = document.getElementById("stat2SelectItem").value;
    var statDir = document.getElementById("statDirItem").value;
    var modSelected = document.getElementById("modSelect").value;

    if (statDir==="Highest"){
        sortDir=1;
    } else {
        sortDir=0;
    }
    
    if (statSelect==="Ground Friction"){
        statSelect = "groundFriction";
    } else if (statSelect==="Basethirst"){
        statSelect = "baseThirst";
    }

    itemStatSelectVal = statSelect;
    var itemList = items;
    if (modSelected!="Any"){
        itemList = itemsWithMod(modSelected);
    }
    const activeItems = itemList.sort( compareSortItems ).slice(0,50);
    document.getElementById("modalTable").innerHTML = '';
    div = document.getElementById( 'modalTable' );
    $("#exampleModalLabel").text("Item Search Results");
    document.getElementById("statName").innerText = statSelect.charAt(0).toUpperCase() + statSelect.slice(1).toLowerCase();

    for (var j=0;j<activeItems.length;j++){
        var item = activeItems[j];
        var playerRow = document.createElement("tr");
        playerRow.classList.add("playerRow");
        playerRow.classList.add("clickable-row");
    
        var playerNum = document.createElement("th");
        playerNum.textContent = ""+(j+1);
        playerNum.setAttribute("scope","row");
    
        var itemName = document.createElement("td");
        itemName.textContent = ""+item.data.name;
    
        var playerBlood = document.createElement("td");
        playerBlood.textContent = ""+(itemTotalStat(item.data,statSelect)).toFixed(5);
        var player = playerHolding(item.data.name,item.data.health,item.data.durability);
        var playerName = document.createElement("td");
        var playerNameStr=""
        if (player==undefined){
            playerNameStr="Nobody (Bargain Bin)";
        } else {
            playerRow.href = "https://www.blaseball.com/player/"+player.player_id;
            playerNameStr = player.player_name;
        }
        playerName.textContent = ""+playerNameStr;
        var playerTeam = document.createElement("td");
        var team="";
        if (player)
            team = player.team;
        if (team===null||team===""){
            team="Null Team";
        }
        playerTeam.textContent = ""+team;
    
    
        playerRow.append(playerNum);
        playerRow.append(itemName);
        playerRow.append(playerBlood);
        playerRow.append(playerName);
        playerRow.append(playerTeam);
    
        div.append(playerRow);
    
    }
    $("#diffCol").hide();
    $("#matchCol").hide();
    $("#teamCol").show();
    
    $("#teamCol").text("Player");
    $("#posCol").text("Team");
    $(".clickable-row").click(function() {
        window.location = $(this)[0].href;
    });
}
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
function returnReducedPlayerlist(activeCheck,funkoCheck,position){
    list = [];
    for (var j=0;j<playersJSON.length;j++){
        player = playersJSON[j];
        if (player.current_state == "replica" && !funkoCheck)
            continue;
        
        if (player.current_state == "dust" && !funkoCheck)
            continue;

        if (position == "Lineup" && player.position_type != "BATTER")
            continue;
        if (position == "Rotation" && player.position_type != "PITCHER")
            continue;
        if (position == "Shadows" && player.position_type != "SHADOWS")
            continue;
        if (position == "Deceased" && player.current_state != "deceased")
            continue; 
               
        if (player.current_state == "legendary" && activeCheck)
            continue;
        if (player.current_state == "deceased" && activeCheck)
            continue;
        if (player.current_state == "retired" && activeCheck)
            continue;
        if (player.current_state == "deprecated" && activeCheck)
            continue;
        if (player.current_state == "dust" && activeCheck)
            continue;
        if (player.debut_gameday === null && activeCheck)
            continue;
        if (player.position_type === null && activeCheck)
            continue;

        list.push(player);
    }
    return list;
}
function queryPlayersOutliers(caller){
    $("#exampleModal").modal();
    var statSelect = document.getElementById("stat2Select").value;
    var statDir = document.getElementById("statDir").value;

    var activeCheck = document.getElementById("checkActivePlayersDir").checked;
    var funkoCheck = document.getElementById("checkFunkosDir").checked;
    var position = document.getElementById("posSelectDir").value;

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

    $("#teamCol").show();
    $("#posCol").show();
    $("#posCol").text("Position");
    $("#teamCol").text("Team");
    $("#exampleModalLabel").text("Player Outlier Results");
    statSelectVal = statSelect.toLowerCase();
    document.getElementById("statName").innerText = statSelect;
    document.getElementById("modalTable").innerHTML = '';
    var playersWithSetting = returnReducedPlayerlist(activeCheck,funkoCheck,position);
    const activePlayers = playersWithSetting.sort( compareSort ).slice(0,50);
    
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
        var playerTeam = document.createElement("td");
        
        var team = activePlayers[j].team;
        if (team===null){
            team="Null Team";
        }
        playerTeam.textContent = ""+team;
        var playerPos = document.createElement("td");
        var pos = activePlayers[j].position_type;
        if (pos===null){
            pos="Unknown";
        }
        playerPos.textContent = ""+pos.charAt(0).toUpperCase() + pos.slice(1).toLowerCase();
    
        var playerBlood = document.createElement("td");
        playerBlood.textContent = ""+activePlayers[j][statSelect.toLowerCase()].toFixed(5);
    
        playerRow.append(playerNum);
        playerRow.append(playerName);
        playerRow.append(playerBlood);
        playerRow.append(playerTeam);
        playerRow.append(playerPos);
    
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
    
    var activeCheck = document.getElementById("checkActivePlayers").checked;
    var funkoCheck = document.getElementById("checkFunkos").checked;
    var position = document.getElementById("posSelect").value;

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
            player.distance = Math.abs(targetStatVal-statVal);
    }

    $("#diffCol").show();
    $("#matchCol").show();
    $("#teamCol").show();
    $("#posCol").text("Position");
    $("#teamCol").text("Team");
    $("#posCol").show();
    $("#exampleModalLabel").text("Closest Players");
    var playersWithSetting = returnReducedPlayerlist(activeCheck,funkoCheck,position);
    var activePlayers = playersWithSetting.sort( compare ).slice(0,15);
    
    div = document.getElementById( 'modalTable' );
    for (var j=0;j<activePlayers.length;j++){
        var player = activePlayers[j];
        var playerRow = document.createElement("tr");
        playerRow.classList.add("playerRow");
        playerRow.classList.add("clickable-row");
        playerRow.href = "https://blaseball-reference.com/players/"+player.player_id;
    
        var playerNum = document.createElement("th");
        playerNum.textContent = ""+(j+1);
        playerNum.setAttribute("scope","row");
    
        var playerName = document.createElement("td");
        playerName.textContent = ""+player.player_name;
    
        var playerBlood = document.createElement("td");
        playerBlood.textContent = ""+player[statSelect.toLowerCase()].toFixed(5);
        var playerTeam = document.createElement("td");
        
        var team = activePlayers[j].team;
        if (team===null){
            team="Null Team";
        }
        playerTeam.textContent = ""+team;
        var playerPos = document.createElement("td");
        var pos = activePlayers[j].position_type;
        if (pos===null){
            pos="Unknown";
        }
        playerPos.textContent = ""+pos.charAt(0).toUpperCase() + pos.slice(1).toLowerCase();
    
    
        var playerDiff = document.createElement("td");
        playerDiff.textContent = ""+Math.abs(targetStatVal-player[statSelect.toLowerCase()]).toFixed(5);
        
        
        var playerpct = document.createElement("td");
        playerpct.textContent = ""+((1-Math.abs(targetStatVal-player[statSelect.toLowerCase()])/targetStatVal)*100).toFixed(5);
    
        playerRow.append(playerNum);
        playerRow.append(playerName);
        playerRow.append(playerBlood);
        playerRow.append(playerTeam);
        playerRow.append(playerPos);
        playerRow.append(playerDiff);
        playerRow.append(playerpct);
    
        div.append(playerRow);
    }
    
    $(".clickable-row").click(function() {
        window.location = $(this)[0].href;
    });
}