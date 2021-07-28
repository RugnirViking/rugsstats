$( document ).ready(function() {
    console.log( "ready!" );
    var endpoint = 'https://cors-proxy.blaseball-reference.com/database/allTeams';
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
                var team = result[i];
                if (team.eDensity>0){
                    var x = team.imPosition[0];
                    var y = team.imPosition[1];
                    var teamTable = document.createElement("table");
                    teamTable.id=team.id;

                    var toprow = document.createElement("tr");
                    toprow.innerText=team.fullName;

                    var headerRow = document.createElement("tr");
                    var dayHeader = document.createElement("th");
                    dayHeader.innerText = "Day"
                    var xheader = document.createElement("th");
                    xheader.innerText = "X Position"
                    var yheader = document.createElement("th");
                    yheader.innerText = "Y Position"
                    headerRow.append(dayHeader)
                    headerRow.append(xheader)
                    headerRow.append(yheader)


                    teamTable.append(toprow)
                    teamTable.append(headerRow)
                    div.append(teamTable)
                }
            }
        }
    });
});
currentDay=0;
function getPositions(){
    var endpoint = 'https://cors-proxy.blaseball-reference.com/database/simulationData';
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
            if (simInfo.day>currentDay){
                currentDay = simInfo.day
                var endpoint = 'https://cors-proxy.blaseball-reference.com/database/allTeams';
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
                            var team = result[i];
                            if (team.eDensity>0){
                                var x = team.imPosition[0];
                                var y = team.imPosition[1];
                                var teamTable = document.getElementById(team.id);
                                
                                var headerRow = document.createElement("tr");
                                var dayHeader = document.createElement("td");
                                dayHeader.innerText = currentDay+1;
                                var xheader = document.createElement("td");
                                xheader.innerText = x.toFixed(3);
                                var yheader = document.createElement("td");
                                yheader.innerText = y.toFixed(3);
                                headerRow.append(dayHeader)
                                headerRow.append(xheader)
                                headerRow.append(yheader)

                                teamTable.append(headerRow)
                            }
                        }
                    }
                });
            }
        }
    });
}
function addMinutes(date, minutes) {
    var newdate=new Date(date + minutes*60000);
    return newdate;
}
var countDownDate = new Date().getTime();
countDownDate = addMinutes(countDownDate,10);
getPositions();
// Update the count down every 1 second
var x = setInterval(function() {

  // Get today's date and time
  var now = new Date().getTime();

  // Find the distance between now and the count down date
  var distance = countDownDate - now;

  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  document.getElementById("demo").innerHTML = days + "d " + hours + "h "
  + minutes + "m " + seconds + "s ";

  // If the count down is finished, write some text
  if (distance < 0) {
    getPositions()
    countDownDate = addMinutes(countDownDate.getTime(),10);
  }
}, 1000);