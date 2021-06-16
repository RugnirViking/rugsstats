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
                var teamcard = document.createElement("div");
                teamcard.classList.add("col");
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
    });
});
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