var simInfo={};
var wildhighdivId = "d4cc18de-a136-4271-84f1-32516be91a80";
var leagueInfo={};
var standingsInfo={};
var wildHighTeams={};
var currentHolders = {};
var teamdata = {};
var currentDay=0;
var currentSeason=19;

var jands=	1;
var bmints=	1;
var mechs=	1;
var lift=	1;
var mills=	1;
var tacos=	1;
var sunbeams=	1;
var steaks=	1;

var tigers=	-1;
var ffs=	-1;
var georgias=	-1;
var wings=	-1;
var worms=	-1;
var flowers=	-1;
var dale=	-1;
var pies=	-1;
var lovers=	-1;
var garages=	-1;
var crabs=	-1;
var magic=	-1;
var moisties=	-1;
var shoes=	-1;

var fridays = 0;
var spies=0;
var lateP = ["b024e975-1c4a-4575-8936-a3754a08806a","f02aeae2-5e6a-4098-9842-02d2273f25c7","878c1bf6-0d21-4659-bfee-916c8314d69c","a37f9158-7f82-46bc-908c-c9e2dda7c33b","adc5b394-8f76-416d-9ce9-813706877b84","46358869-dce9-4a01-bfba-ac24fc56f57e","c73b705c-40ad-4633-a6ed-d357ee2e2bcf","36569151-a2fb-43c1-9df7-2df512424c82"];
var earlyP = ["bfd38797-8404-4b38-8b82-341da28b1f83","eb67ae5e-c4bf-46ca-bbbc-425cd34182ff","7966eb04-efcc-499b-8f03-d13916330531","8d87c468-699a-47a8-b40d-cfb73a5660ad","105bc3ff-1320-4e37-8ef0-8d595cb95dd0","b72f3061-f573-40d7-832a-5ad475bd7909","23e4cbc1-e9cd-47fa-a35b-bfa06f726cb7","b63be8c2-576a-4d6e-8daf-814f8bcea96f","3f8bbb15-61c0-4e3f-8e4a-907a5fb1565e","bb4a9de5-c924-4923-a0cb-9d1445f1ee5d","57ec08cc-0411-4643-b304-0e80dbc15ac7","d9f89a8a-c563-493e-9d64-78e4f9a55d4a","ca3f1c8c-c025-4d8e-8eef-5be6accbeb16","747b8e4a-7e50-4638-a973-ea7950a3e739"];
var noP = ["979aee4a-6d80-4863-bf1c-ee1a78e06024","9debc64f-74b7-4ae1-a4d6-fce0144b6ea5"];

var lateWins=0;
var earlyWins=0;
var noneWins=0;

var totalPreseasonGames=0;
var totalPostseasonGames=0;

var totallatePostseasonGames=0;
var totalearlyPostseasonGames=0;
var totalnonePostseasonGames=0;

// games
var totallateVSearlyGames = 0;
var totallateVSnoneGames = 0;
var totalnoneVSearlyGames = 0;

var totallateVSlateGames = 0;
var totalearlyVSearlyGames = 0;
var totalnoneVSnoneGames = 0;
//

// wins
var totallateVSearlyWins = 0;
var totallateVSnoneWins = 0;
var totalnoneVSearlyWins = 0;

var totallateVSlateWins = 0;
var totalearlyVSearlyWins = 0;
var totalnoneVSnoneWins = 0;
//

var lateTeamCount = lateP.length;
var earlyTeamCount = earlyP.length;
var noneTeamCount = noP.length;


var latePs21 = ["b024e975-1c4a-4575-8936-a3754a08806a","f02aeae2-5e6a-4098-9842-02d2273f25c7","878c1bf6-0d21-4659-bfee-916c8314d69c","a37f9158-7f82-46bc-908c-c9e2dda7c33b","adc5b394-8f76-416d-9ce9-813706877b84","46358869-dce9-4a01-bfba-ac24fc56f57e","c73b705c-40ad-4633-a6ed-d357ee2e2bcf","36569151-a2fb-43c1-9df7-2df512424c82"];
var earlyPs21 = ["bfd38797-8404-4b38-8b82-341da28b1f83","eb67ae5e-c4bf-46ca-bbbc-425cd34182ff","7966eb04-efcc-499b-8f03-d13916330531","8d87c468-699a-47a8-b40d-cfb73a5660ad","105bc3ff-1320-4e37-8ef0-8d595cb95dd0","b72f3061-f573-40d7-832a-5ad475bd7909","23e4cbc1-e9cd-47fa-a35b-bfa06f726cb7","b63be8c2-576a-4d6e-8daf-814f8bcea96f","3f8bbb15-61c0-4e3f-8e4a-907a5fb1565e","bb4a9de5-c924-4923-a0cb-9d1445f1ee5d","57ec08cc-0411-4643-b304-0e80dbc15ac7","d9f89a8a-c563-493e-9d64-78e4f9a55d4a","ca3f1c8c-c025-4d8e-8eef-5be6accbeb16","747b8e4a-7e50-4638-a973-ea7950a3e739"];
var noPs21 = ["979aee4a-6d80-4863-bf1c-ee1a78e06024","9debc64f-74b7-4ae1-a4d6-fce0144b6ea5"];





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
            $.ajax({
                url: "https://cors-proxy.blaseball-reference.com/database/season?number="+(currentSeason),
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
                                        url: "https://cors-proxy.blaseball-reference.com/database/allTeams" ,
                                        dataType: 'json',
                                        crossDomain: true,
                                        type: "GET",
                                        success: function(result5){
                                            console.log(result5);
                                            teamdata = result5;
                                            
                                            for(var i=0;i<teamdata.length;i++){
                                                team = teamdata[i];
                                                teamname = team.nickname;
                                                console.log(team.nickname+":"+team.id);
                                            }
                                            $.ajax({
                                                url: "https://api.sibr.dev/chronicler/v1/games?season="+ currentSeason,
                                                dataType: 'json',
                                                crossDomain: true,
                                                type: "GET",
                                                success: function(result6){
                                                    console.log(result6);
                                                    for(var i=0;i<result6.data.length;i++){
                                                        var game = result6.data[i];
                                                        var gamedata = game.data;
                                                        if (gamedata.day<72){
                                                            /// pre lateseason
                                                            totalPreseasonGames++;
                                                            totalPreseasonGames++;
                                                        } else {
                                                            /// post lateseason
                                                            totalPostseasonGames++;
                                                            var winningTeam = {};
                                                            var losingTeam = {};
                                                            if (gamedata.homeScore>gamedata.awayScore){
                                                                winningTeam = gamedata.homeTeam;
                                                                losingTeam = gamedata.awayTeam;
                                                            } else {
                                                                winningTeam = gamedata.awayTeam;
                                                                losingTeam = gamedata.homeTeam;
                                                            }
                                                            if (lateP.includes(winningTeam)){
                                                                lateWins++;
                                                                totallatePostseasonGames++;
                                                            } else if (earlyP.includes(winningTeam)){
                                                                earlyWins++;
                                                                totalearlyPostseasonGames++;
                                                            } else if (noP.includes(winningTeam)){
                                                                noneWins++;
                                                                totalnonePostseasonGames++;
                                                            } else {
                                                                // something went badly wrong
                                                                debugger;
                                                            }

                                                            if (lateP.includes(losingTeam)){
                                                                totallatePostseasonGames++;
                                                            } else if (earlyP.includes(losingTeam)){
                                                                totalearlyPostseasonGames++;
                                                            } else if (noP.includes(losingTeam)){
                                                                totalnonePostseasonGames++;
                                                            } else {
                                                                // something went badly wrong
                                                                debugger;
                                                            }

                                                            if (lateP.includes(winningTeam) && lateP.includes(losingTeam)){
                                                                totallateVSlateGames++;
                                                            }
                                                            if (earlyP.includes(winningTeam) && earlyP.includes(losingTeam)){
                                                                totalearlyVSearlyGames++;
                                                            }
                                                            if (noP.includes(winningTeam) && noP.includes(losingTeam)){
                                                                totalnoneVSnoneGames++;
                                                            }

                                                            // late vs early
                                                            if (lateP.includes(winningTeam) && earlyP.includes(losingTeam)){
                                                                totallateVSearlyWins++;
                                                                totallateVSearlyGames++;
                                                            } else if (lateP.includes(losingTeam) && earlyP.includes(winningTeam)){
                                                                totallateVSearlyGames++;
                                                            }

                                                            // late v none
                                                            if (lateP.includes(winningTeam) && noP.includes(losingTeam)){
                                                                totallateVSnoneWins++;
                                                                totallateVSnoneGames++;
                                                            } else if (lateP.includes(losingTeam) && noP.includes(winningTeam)){
                                                                totallateVSnoneGames++;
                                                            }
                                                            
                                                            // none v early
                                                            if (noP.includes(winningTeam) && earlyP.includes(losingTeam)){
                                                                totalnoneVSearlyWins++;
                                                                totalnoneVSearlyGames++;
                                                            } else if (noP.includes(losingTeam) && earlyP.includes(winningTeam)){
                                                                totalnoneVSearlyGames++;
                                                            }
                                                        }
                                                    }
                                                    console.log("Total games played by teams with late to the party: "+totallatePostseasonGames);
                                                    console.log("Total games won by teams with late to the party: "+lateWins);
                                                    var latewr = (lateWins/totallatePostseasonGames)*100;
                                                    console.log("Winrate of teams with late to the party: "+latewr);

                                                    console.log("------------------------------------------------------------------------");
                                                    
                                                    console.log("Total games played by teams with early to the party: "+totalearlyPostseasonGames);
                                                    console.log("Total games won by teams with early to the party: "+earlyWins);
                                                    var earlywr = (earlyWins/totalearlyPostseasonGames)*100;
                                                    console.log("Winrate of teams with early to the party: "+earlywr);

                                                    console.log("------------------------------------------------------------------------");
                                                    
                                                    console.log("Total games played by teams with no mod: "+totalnonePostseasonGames);
                                                    console.log("Total games won by teams with no mod: "+noneWins);
                                                    var nonewr = (noneWins/totalnonePostseasonGames)*100;
                                                    console.log("Winrate of teams with no mod: "+nonewr);
                                                    console.log("------------------------------------------------------------------------");
                                                    console.log("Total games played by teams with late to the party vs teams with early to the party: "+totallateVSearlyGames);
                                                    console.log("Total games won by teams with late to the party vs teams with early to the party: "+totallateVSearlyWins);
                                                    var latevearlywr = (totallateVSearlyWins/totallateVSearlyGames)*100;
                                                    console.log("Winrate:: "+latevearlywr);
                                                    console.log("------------------------------------------------------------------------");
                                                    console.log("Total games played by teams with late to the party vs teams with no mod: "+totallateVSnoneGames);
                                                    console.log("Total games won by teams with late to the party vs teams with no mod: "+totallateVSnoneWins);
                                                    var latevnonewr = (totallateVSnoneWins/totallateVSnoneGames)*100;
                                                    console.log("Winrate:: "+latevnonewr);
                                                    console.log("------------------------------------------------------------------------");
                                                    console.log("Total games played by teams with no mod vs teams with early to the party: "+totalnoneVSearlyGames);
                                                    console.log("Total games won by teams with no mod vs teams with early to the party: "+totallateVSnoneWins);
                                                    var nonevearlywr = (totalnoneVSearlyWins/totalnoneVSearlyGames)*100;
                                                    console.log("Winrate:: "+nonevearlywr);
                                                    console.log("------------------------------------------------------------------------");
                                                    var lategames = totallatePostseasonGames/lateTeamCount;
                                                    var earlygames = totalearlyPostseasonGames/earlyTeamCount;
                                                    var nonegames = totalnonePostseasonGames/noneTeamCount;
                                                    console.log("Sanity checks");
                                                    console.log("sum of matchup games: "+((totallateVSearlyGames+totallateVSnoneGames+totalnoneVSearlyGames    +    totallateVSlateGames+totalearlyVSearlyGames+totalnoneVSnoneGames)));
                                                    console.log("total games = sum of all matchup games: "+((totallateVSearlyGames+totallateVSnoneGames+totalnoneVSearlyGames    +    totallateVSlateGames+totalearlyVSearlyGames+totalnoneVSnoneGames)==totalPostseasonGames));
                                                    console.log("total games: "+totalPostseasonGames);
                                                    console.log("Total games played = sum of games played by teams with all mods: "+((totallatePostseasonGames+totalearlyPostseasonGames+totalnonePostseasonGames)==(totalPostseasonGames*2)));

                                                    console.log("late games/late teams (should =27): "+lategames);
                                                    console.log("early games/early teams (should =27): "+earlygames);
                                                    console.log("none games/none teams (should =27): "+nonegames);
                                                    
                                                    // sanity checks
                                                    debugger;
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