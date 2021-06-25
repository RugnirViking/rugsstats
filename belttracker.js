var simInfo={};
var wildhighdivId = "d4cc18de-a136-4271-84f1-32516be91a80";
var leagueInfo={};
var standingsInfo={};
var wildHighTeams={};
var currentHolders = {};
var teamdata = {};
var currentDay=0;
var currentSeason=0;

$( document ).ready(function() {
    console.log( "ready!" );
    var endpoint = 'https://cors-proxy.blaseball-reference.com/database/simulationData';
    $.support.cors = true;
    $.ajax({
        url: endpoint ,
        dataType: 'json',
        crossDomain: true,
        type: "GET",
        success: function(result){
            console.log(result);
            simInfo = result;
            document.getElementById("seasonlbl").value = (simInfo.season+1);
            document.getElementById("daylbl").value = (simInfo.day+1);
            currentSeason = simInfo.season;
            currentDay = simInfo.day;
            $.ajax({
                url: "https://cors-proxy.blaseball-reference.com/database/season?number="+(simInfo.season-1),
                dataType: 'json',
                crossDomain: true,
                type: "GET",
                success: function(result2){
                    console.log(result2);
                    leagueInfo = result2;
                    $.ajax({
                        url: "https://cors-proxy.blaseball-reference.com/database/standings",
                        dataType: 'json',
                        crossDomain: true,
                        type: "GET",
                        data:{"id":leagueInfo.standings},
                        success: function(result3){
                            console.log(result3);
                            standingsInfo = result3;
                            $.ajax({
                                url: "https://cors-proxy.blaseball-reference.com/database/division",
                                dataType: 'json',
                                crossDomain: true,
                                type: "GET",
                                data:{"id":wildhighdivId},
                                success: function(result4){
                                    console.log(result4);
                                    wildHighTeams = result4;
                                    $.ajax({
                                        url: "https://cors-proxy.blaseball-reference.com/database/allTeams" ,
                                        dataType: 'json',
                                        crossDomain: true,
                                        type: "GET",
                                        success: function(result5){
                                            console.log(result5);
                                            teamdata = result5;
                                            document.getElementById('spinner').style.display = 'none';
                                            var highestTeam=wildHighTeams.teams[0];
                                            var mostWins=standingsInfo.wins[highestTeam];
                                            for(var i=0;i<wildHighTeams.teams.length;i++){
                                                var teamid = wildHighTeams.teams[i];
                                                var team = teamdata.find(x => x.id === teamid);
                                                console.log("Team "+team.fullName+" wins: "+standingsInfo.wins[teamid]);
                                                if (standingsInfo.wins[teamid]>mostWins){
                                                    mostWins = standingsInfo.wins[teamid];
                                                    highestTeam = team
                                                }
                                            }
                                            currentHolders = highestTeam;
                                            console.log("Team with belt at start of season "+highestTeam.fullName);
                                            $.ajax({
                                                url: "https://api.sibr.dev/chronicler/v1/games?season="+ simInfo.season,
                                                dataType: 'json',
                                                crossDomain: true,
                                                type: "GET",
                                                success: function(result6){
                                                    console.log(result6);
                                                    document.getElementById("submitButtonBeltDate").onclick = GetBeltOnDate;
                                                    for(var i=0;i<result6.data.length;i++){
                                                        var game = result6.data[i];
                                                        var gamedata = game.data;
                                                        if (gamedata.finalized && (gamedata.day+1)%3==0){
                                                            // the game has finished and is the last game in a series
                                                            if (wildHighTeams.teams.includes(gamedata.homeTeam) && wildHighTeams.teams.includes(gamedata.awayTeam)){
                                                                // two wild high teams play each other
                                                                if (currentHolders.id==gamedata.homeTeam||currentHolders.id==gamedata.awayTeam){
                                                                    console.log("Processing day "+gamedata.day+" belt match between "+teamdata.find(x => x.id === gamedata.homeTeam).fullName+" (home) and "+teamdata.find(x => x.id === gamedata.awayTeam).fullName+" (away)")
                                                                    // one of the teams is the "current" holder of the belt
                                                                    if (gamedata.homeScore>gamedata.awayScore){
                                                                        // home team won
                                                                        console.log(teamdata.find(x => x.id === gamedata.homeTeam).fullName+" won the match and gets the belt");
                                                                        if (currentHolders.id==gamedata.homeTeam){
                                                                            // current holders won, they keep the belt
                                                                        } else {
                                                                            // current holders lost. Home team gets the belt
                                                                            currentHolders = teamdata.find(x => x.id === gamedata.homeTeam);
                                                                        }
                                                                    } else if (gamedata.awayScore>gamedata.homeScore){
                                                                        // away team won
                                                                        console.log(teamdata.find(x => x.id === gamedata.awayTeam).fullName+" won the match and gets the belt");
                                                                        if (currentHolders.id==gamedata.awayTeam){
                                                                            // current holders won, they keep the belt
                                                                        } else {
                                                                            // current holders lost. Away team gets the belt
                                                                            currentHolders = teamdata.find(x => x.id === gamedata.awayTeam);
                                                                        }
                                                                    } else {
                                                                        // something really fishy happened....
                                                                        console.log("Something weird happened in game. Game finished but equal score? "+game.gameId);
                                                                    }
                                                                    
                                                                }
                                                            }
                                                        }
                                                    }
                                                    // we looped through all games. Current holder should be left
                                                    console.log("Current Holder on day "+(simInfo.day+1)+" is "+currentHolders.fullName);
                                                    var currentTeamElement = document.getElementById("currentHoldingTeam");
                                                    try {
                                                        currentTeamElement.innerText = currentHolders.fullName.toUpperCase() + " "+String.fromCodePoint(currentHolders.emoji);
                                                    } catch(err) {
                                                        currentTeamElement.innerText = currentHolders.fullName.toUpperCase() + " "+currentHolders.emoji;
                                                    }
                                                    currentTeamElement.style.color = currentHolders.mainColor;
                                                    
                                                    var currentSeasonElement = document.getElementById("currentSeasonFlip");
                                                    var currentSeasonNumberString = (simInfo.season+1).toString();
                                                    for (var i = 0; i < currentSeasonNumberString.length; i++) {
                                                        var span = document.createElement("span");
                                                        span.classList.add("digit");
                                                        span.innerText=currentSeasonNumberString.charAt(i);
                                                        currentSeasonElement.appendChild(span);
                                                    }
                                                    
                                                    
                                                    var currentDayElement = document.getElementById("currentDayFlip");
                                                    var currentDayNumberString = (simInfo.day+1).toString();
                                                    for (var i = 0; i < currentDayNumberString.length; i++) {
                                                        var span = document.createElement("span");
                                                        span.classList.add("digit");
                                                        span.innerText=currentDayNumberString.charAt(i);
                                                        currentDayElement.appendChild(span);
                                                    }
                                                    document.getElementById("winnersection").style.backgroundColor = LightenDarkenColor(currentHolders.mainColor,40);
                                                    var element2 = document.getElementById("beltAnswerText");
                                                    element2.innerText = "Holder on season "+(currentSeason+1)+", day "+(currentDay+1)+" is "+currentHolders.fullName;
                                                    var wildHighTeamzzz = []
                                                    for (var i = 0; i < wildHighTeams.teams.length; i++) {
                                                        wildHighTeamzzz.push(teamdata.find(x => x.id === wildHighTeams.teams[i]));
                                                    }
                                                    ListWildTeams(shuffle(wildHighTeamzzz));
                                                }
                                            });
                                        }
                                    });
                                    
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});
function DateBeltError(errorText,season=-1,day=-1){
    var element = document.getElementById("dateBeltErrorText");
    element.classList.remove("hide");
    element.innerText = errorText;
    if (season===-1){
        document.getElementById("seasonlbl").value=(currentSeason+1);
    } else {
        document.getElementById("seasonlbl").value=season;
    }
    if (day===-1){
        document.getElementById("daylbl").value=(currentDay+1);
    } else {
        document.getElementById("daylbl").value=day;
    }
}
function GetBeltOnDate(sender,somethingelse){
    
    var selectedSeason = document.getElementById("seasonlbl").value;
    var selectedDay = document.getElementById("daylbl").value;
    if (selectedSeason-1>currentSeason){
        DateBeltError("Cannot select season after current season ("+(currentSeason+1)+")");
        return;
    }
    if (selectedSeason==1){
        DateBeltError("Cannot select first season, no data");
        return;
    }
    
    if (selectedSeason<7){
        DateBeltError("Invalid Season. Valid range is 7-"+(currentSeason+1));
        return;
    }
    if ((selectedSeason-1)==currentSeason && selectedDay-1>currentDay){
        DateBeltError("Cannot select day after current day ("+(currentDay+1)+")");
        return;
    } else if (selectedDay>100){
        DateBeltError("Cannot select day after day 100 in historical seasons ("+(currentDay+1)+")",selectedSeason,100);
        return;
    } 
    if (selectedDay<1){
        DateBeltError("Invalid Day. Valid range is 1-"+(currentDay+1));
        return;
    }
    
    var element = document.getElementById("dateBeltErrorText");
    element.classList.add("hide");
    document.getElementById('spinner').style.display = 'block';
    $.ajax({
        url: "https://cors-proxy.blaseball-reference.com/database/season?number="+(selectedSeason-2),
        dataType: 'json',
        crossDomain: true,
        type: "GET",
        success: function(result2){
            var curleagueInfo = result2;
            $.ajax({
                url: "https://cors-proxy.blaseball-reference.com/database/standings",
                dataType: 'json',
                crossDomain: true,
                type: "GET",
                data:{"id":curleagueInfo.standings},
                success: function(result3){
                    var curstandingsInfo = result3;
                    $.ajax({
                        url: "https://cors-proxy.blaseball-reference.com/database/division",
                        dataType: 'json',
                        crossDomain: true,
                        type: "GET",
                        data:{"id":wildhighdivId},
                        success: function(result4){
                            var curwildHighTeams = result4;
                            var highestTeam=curwildHighTeams.teams[0];
                            var mostWins=curstandingsInfo.wins[highestTeam];
                            for(var i=0;i<curwildHighTeams.teams.length;i++){
                                var teamid = curwildHighTeams.teams[i];
                                var team = teamdata.find(x => x.id === teamid);
                                console.log("Team "+team.fullName+" wins: "+curstandingsInfo.wins[teamid]);
                                if (curstandingsInfo.wins[teamid]>mostWins){
                                    mostWins = curstandingsInfo.wins[teamid];
                                    highestTeam = team
                                }
                            }
                            var dateCurrentHolders = highestTeam;
                            console.log("Team with belt at start of season "+highestTeam.fullName);
                            $.ajax({
                                url: "https://api.sibr.dev/chronicler/v1/games?season="+ (selectedSeason-1),
                                dataType: 'json',
                                crossDomain: true,
                                type: "GET",
                                success: function(result6){
                                    for(var i=0;i<result6.data.length;i++){
                                        var game = result6.data[i];
                                        var gamedata = game.data;
                                        if (gamedata.finalized && (gamedata.day+1)%3==0 && gamedata.day<selectedDay){
                                            // the game has finished and is the last game in a series and is before the supplied day
                                            if (curwildHighTeams.teams.includes(gamedata.homeTeam) && curwildHighTeams.teams.includes(gamedata.awayTeam)){
                                                // two wild high teams play each other
                                                if (dateCurrentHolders.id==gamedata.homeTeam||dateCurrentHolders.id==gamedata.awayTeam){
                                                    console.log("Processing day "+gamedata.day+" belt match between "+teamdata.find(x => x.id === gamedata.homeTeam).fullName+" (home) and "+teamdata.find(x => x.id === gamedata.awayTeam).fullName+" (away)")
                                                    // one of the teams is the "current" holder of the belt
                                                    if (gamedata.homeScore>gamedata.awayScore){
                                                        // home team won
                                                        console.log(teamdata.find(x => x.id === gamedata.homeTeam).fullName+" won the match and gets the belt");
                                                        if (dateCurrentHolders.id==gamedata.homeTeam){
                                                            // current holders won, they keep the belt
                                                        } else {
                                                            // current holders lost. Home team gets the belt
                                                            dateCurrentHolders = teamdata.find(x => x.id === gamedata.homeTeam);
                                                        }
                                                    } else if (gamedata.awayScore>gamedata.homeScore){
                                                        // away team won
                                                        console.log(teamdata.find(x => x.id === gamedata.awayTeam).fullName+" won the match and gets the belt");
                                                        if (dateCurrentHolders.id==gamedata.awayTeam){
                                                            // current holders won, they keep the belt
                                                        } else {
                                                            // current holders lost. Away team gets the belt
                                                            dateCurrentHolders = teamdata.find(x => x.id === gamedata.awayTeam);
                                                        }
                                                    } else {
                                                        // something really fishy happened....
                                                        console.log("Something weird happened in game. Game finished but equal score? "+game.gameId);
                                                    }
                                                    
                                                }
                                            }
                                        }
                                    }
                                    // we looped through all games. Current holder should be left
                                    console.log("Holder on day "+(selectedDay)+" is "+dateCurrentHolders.fullName);
                                    document.getElementById('spinner').style.display = 'none';
                                    
                                    var element = document.getElementById("dateBeltAnswerText");
                                    element.classList.remove("hide");
                                    element.innerText = "Holder on season "+selectedSeason+", day "+(selectedDay)+" is "+dateCurrentHolders.fullName;
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

function LightenDarkenColor(col, amt) {
    var usePound = false;
  
    if (col[0] == '#') {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    var c = (g | (b << 8) | (r << 16)).toString(16);

    while (c.length<6){
        c='0'+c;
    }
    return (usePound?'#':'') + c;
  
}
function ListWildTeams(teams){
    div = document.getElementById( 'wildhighteams' );
    for (var i=0;i<teams.length;i++){
        var team = teams[i];
        var teamcard = document.createElement("div");
        teamcard.classList.add("col-12");
        teamcard.classList.add("col-lg-4");
        var teamcardin = document.createElement("div");
        teamcardin.classList.add("card");
        teamcardin.classList.add("cardGrow");
        teamcardin.classList.add("shadow-sm");

        
        var topsection = document.createElement("div");
        topsection.classList.add("bd-placeholder-img");
        topsection.classList.add("card-img-top");
        topsection.style.backgroundColor = team.mainColor;
        try {
            topsection.textContent = ""+String.fromCodePoint(team.emoji);
        } catch(err) {
            topsection.textContent = team.emoji;
        }
        var midsection = document.createElement("div");
        midsection.classList.add("card-body");
        midsection.style.backgroundColor = LightenDarkenColor(team.mainColor,-100);
        midsection.style.color = team.secondaryColor;

        let textElement = document.createElement("p");
        textElement.textContent = team.fullName;

        midsection.append(textElement);

        teamcardin.append(topsection);
        teamcardin.append(midsection);
        teamcard.append(teamcardin);
        div.append(teamcard);
    }
}
function shuffle(array) {
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
/*$.ajax({
                url: "https://cors-proxy.blaseball-reference.com/database/season?number="+simInfo.season,
                dataType: 'json',
                crossDomain: true,
                type: "GET",
                success: function(result2){
                    console.log(result2);
                    leagueInfo = result;
                    $.ajax({
                        url: "https://cors-proxy.blaseball-reference.com/database/standings",
                        dataType: 'json',
                        crossDomain: true,
                        type: "GET",
                        data:{"id":leagueInfo.standings},
                        success: function(result3){
                            console.log(result3);
                            standingsInfo = result;
                            debugger;
                        }
                    });
                }
            });*/