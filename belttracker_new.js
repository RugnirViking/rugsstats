var simInfo={};
var leagueInfo={};
var standingsInfo={};
var wildHighTeams={};
var currentHolders = {};
var teamdata = {};
var currentDay=0;
var currentSeason=0;
var wildhigh_extendeduniverseteams = ["2f90c5e3-21fe-4842-b89a-c00c14bc4d5a", // wings
                                      "537cf346-533e-4f8d-92e6-54a43b285e18", // lovers
                                      "e09e5d91-dd07-4551-abb8-e527f59361a8", // crabs
                                      "4ac1b94f-a3f6-4650-ade9-1fd8ced20e18", // georgias
                                      "db2dee1e-9f7c-4b08-a30d-3d31286122df", // ffs
                                      "7e89ab0c-e63e-44e2-8c9d-689ad30cc5b3", // mills
                                      "af191af8-f0c1-4aac-9fb5-aed18f39a126", // hands
                                      "2036a676-afd7-4693-91e0-d1839f23089a", // tigers
                                      "b9e5f7df-1455-44b0-a659-65fa96bee48e", // lift
                                     ]
var belts = []
for(var i=0, len=wildhigh_extendeduniverseteams.length; i < len; i++){
    team = wildhigh_extendeduniverseteams[i];
    belt = {"starting_team":team,"current_team":team};
    belts.push(belt);
}

var teamsdata = []


function getTeamBelts(team){
    teambelts=[];
    for(var i=0, len=belts.length; i < len; i++){
        belt = belts[i];
        if (belt.current_team === team){
            teambelts.push(belt);
        }
    }
    return teambelts;
}
function getteamdatabyid(teamid){
    for(var i=0, len=teamsdata.length; i < len; i++){
        if (teamsdata[i].id===teamid){
            return teamsdata[i];
        }
    }
}
function updateteamdata(team,teamdata){
    teamsdata.push(teamdata)
}

function drawTeamBox(team){
    result=getteamdatabyid(team);
    div = document.getElementById( 'teamlist' );
    
    var teamcard = document.createElement("a");
    teamcard.classList.add("col");
    teamcard.classList.add("col-lg-4"); 
    teamcard.href = "https://www.blaseball.com/team/"+team;
    var teamcardin = document.createElement("div");
    teamcardin.classList.add("card");
    teamcardin.classList.add("cardGrow");
    teamcardin.classList.add("shadow-sm");

    
    var topsection = document.createElement("div");
    topsection.classList.add("bd-placeholder-img");
    topsection.classList.add("card-img-top");
    topsection.style.backgroundColor = result.mainColor;
    try {
        topsection.textContent = ""+String.fromCodePoint(result.emoji);
    } catch(err) {
        topsection.textContent = ""+result.emoji;
    }
    var midsection = document.createElement("div");
    midsection.classList.add("card-body");
    midsection.style.backgroundColor = LightenDarkenColor(result.mainColor,-100);
    midsection.style.color = result.secondaryColor;
    midsection.style.textAlign = "center";
    midsection.style.fontSize = "1.15em";
    midsection.style.fontWeight = 900;

    let textElement = document.createElement("p");
    textElement.textContent = result.fullName;

    midsection.append(textElement);

    
    var bottomsection = document.createElement("div");
    bottomsection.classList.add("card-body");
    bottomsection.style.backgroundColor = LightenDarkenColor(result.mainColor,100);
    bottomsection.style.color = LightenDarkenColor(result.mainColor,-50);

    let textElement2 = document.createElement("p");
    textElement2.textContent = "Belts as of day "+currentDay+": ";
    teambelts = getTeamBelts(team);
    
    bottomsection.append(textElement2);
    for(var i=0, len=teambelts.length; i < len; i++){
        let textElement_n = document.createElement("p");
        teamdata = getteamdatabyid(teambelts[i].starting_team);
        emoji_pt=""
        try {
            emoji_pt = ""+String.fromCodePoint(teamdata.emoji);
        } catch(err) {
            emoji_pt = ""+teamdata.emoji;
        }
        textElement_n.textContent = " - "+emoji_pt+" "+teamdata.fullName;
        bottomsection.append(textElement_n);
    }




    teamcardin.append(topsection);
    teamcardin.append(midsection);
    teamcardin.append(bottomsection);
    teamcard.append(teamcardin);
    div.append(teamcard);
    
    
}

$( document ).ready(function() {
    console.log( "ready!" );
    var endpoint = 'https://api.sibr.dev/corsmechanics/api.blaseball.com/database/simulationData';
    $.support.cors = true;
    $.ajax({
        url: endpoint ,
        dataType: 'json',
        crossDomain: true,
        type: "GET",
		error: function(result, type){
			debugger;
		},
        success: function(result){
            console.log(result);
            simInfo = result;
            currentDay = simInfo.day; // remember its 0 indexed so add 1
            season = simInfo.seasonId;
            simStart = simInfo.simStart;
            simEnd = simInfo.simEnd;
            $.ajax({
                url: "https://api.sibr.dev/eventually/time/gamma10/0", // note: this should be kept updated to current season, potentially look into automating it.
                dataType: 'json',
                crossDomain: true,
                type: "GET",
                data:{"after":simStart,
                      "before":simEnd,
                      "finished":true,
                    },
				error: function(result, type){
					debugger;
				},
                success: function(result2){
                    standings=result2;
                    $.ajax({
                        url: "https://api.sibr.dev/chronicler/v1/games",
                        dataType: 'json',
                        crossDomain: true,
                        type: "GET",
                        data:{"after":result2.start,
                              "before":result2.end,
                              //"finished":true,      // don't want this so we can show next belt match time
                            },
                        error: function(result, type){
                            debugger;
                        },
                        success: function(result3){
                            games=result3;
                            for(var i=0, len=games.data.length; i < len; i++){
                                game = games.data[i];
                                gamedata = game.data;
                                if (gamedata.gameComplete){
                                    if (wildhigh_extendeduniverseteams.includes(gamedata.awayTeam) && wildhigh_extendeduniverseteams.includes(gamedata.homeTeam)){
                                        // potential belt match
                                        homebelts = getTeamBelts(gamedata.homeTeam);
                                        awaybelts = getTeamBelts(gamedata.awayTeam);
                                        if (homebelts.length>0 || awaybelts.length>0){
                                            // belt match
                                            if (homebelts.length>0 && awaybelts.length>0){
                                                // DOUBLE BELT MATCH
                                                // dont think anything special happens here but its neat
                                            }
                                            
                                            for(var j=0, len2=homebelts.length; j < len2; j++){
                                                homebelts[j].current_team=gamedata.winner;
                                            }
                                            for(var j=0, len2=awaybelts.length; j < len2; j++){
                                                awaybelts[j].current_team=gamedata.winner;
                                            }
                                        }
                                    }
                                }
                            }
                            // finished processing up to current day
                            
                            document.getElementById('spinner').style.display = 'none';
                            $.ajax({
                                url: "https://api.sibr.dev/corsmechanics/api.blaseball.com/database/teams",
                                dataType: 'json',
                                crossDomain: true,
                                type: "GET",
                                error: function(result, type){
                                    debugger;
                                },
                                success: function(result4){
                                    for (var i=0;i<result4.length;i++){
                                        if (wildhigh_extendeduniverseteams.includes(result4[i].id)){
                                            updateteamdata(team,result4[i]);
                                        }
                                    }
                                    for (var i=0;i<wildhigh_extendeduniverseteams.length;i++){
                                        drawTeamBox(wildhigh_extendeduniverseteams[i]);
                                        
                                    }
                                }
                            });
                        }
                    });
                }
            });
            
        }
    });
});
function GetBeltOnDate(sender,somethingelse){
    
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