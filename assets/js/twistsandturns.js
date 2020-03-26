let board = [
    'ADWSOTXFRSOKND',
    'SLIOHKAMINSLAF',
    'TCLDEIELWHCOSH',
    'UFITWIESFOSRRR',
    'TLOAFOLXARFUFD',
    'STARRYNODNIKMN',
    'DAUFCNTAELTCDA',
    'DRTOACDTEOCODY',
    'DLOXCANUILTSKC',
    'IIIOLISWOXRNTK',
    'SFOSNTRCIUILOS',
    'DACDKKDOOLRATS',
    'SOSIXTYFORETFW',
    'COTRFALNANIDFA'
]

function populateBoard() {
	$("#board").empty();
	board.forEach(function(row) {
        $("#board").append("<tr><td>"+row.split("").join("</td><td>")+"</td></tr>")
	})
}

populateBoard()