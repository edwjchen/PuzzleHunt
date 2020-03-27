let board = [
    'AWASOTXFRSOKND',
    'SLOOHKAMINSFAF',
    'TLDLEIELWHCOSH',
    'FKITWIESFOSRRR',
    'TLOAFOLXARFUFD',
    'STARRYNODNIKMN',
    'DAUFCNTAELTCDA',
    'DRTOACDTEOCODY',
    'DLOXCANUILTSKC',
    'FIIOLISWOXRNTK',
    'AFOSNTRCIUISOS',
    'LACDKKDOOLRATS',
    'SCSIXTYFORETFW',
    'CAORFALNANIDFA'
]

function populateBoard() {
    $("#board").empty();
    let count = 0;
    let res = ""
    for (var row = 0; row < board.length; row++) {
        let string_row = "<tr>"
        let characters = board[row].split("")
        for (var col = 0; col < characters.length; col++) {
            string_row += "<td id='"+count+"' onclick='toggleColor("+count+")' style='text-align: center;'>" + characters[col] + "</td>"
            count++;
        }
        res += string_row + "</tr>"
    }
    $("#board").append(res)
	// board.forEach(function(row) {
    //     $("#board").append("<tr><td id='"+count+"' onclick='toggleColor()'>"+row.split("").join("</td><td onclick='toggleColor()'>")+"</td></tr>")
	// })
}

function toggleColor(count) {
    if ($("#"+count).css('color') == "rgb(255, 255, 255)") {
        $("#"+count).css('color', '#f2849e')
    } else {
        $("#"+count).css('color', "rgb(255, 255, 255)")
    }
}

populateBoard()