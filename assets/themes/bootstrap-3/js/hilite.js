// Highlights code lines in multimarkdown-generated HTML files, either
// individual lines, or a range. After linking this JS and associated
// CSS, wrap this markup around a code block...

// <div markdown="1" class="hilite" data-lines="12-17,4">
// </div>

// ...where "data-lines" can encode comma-delimited line ranges or
// discrete line numbers, then process locally with "multimarkdown -b
// FILENAME.mmd"

// still 2DO:
// - validate out-of-range code lines
// - check valid ranges from lesser to greater values

window.addEventListener('load', function(e){
    var divs = document.querySelectorAll('.hilite');
    var div, codeNode, lineString, hiliteObj;
    for (var i = 0, l = divs.length; i < l; i++) {
        div = divs[i];
        if (! div.dataset.lines) continue;
        lineString = div.dataset.lines;
        hiliteObj = lineStrToObj(lineString);
        // Multimarkdown generates <code> within a <pre> wrapper for
        // some reason:
        codeNode = div.querySelector('pre code');
        hiliteCode(codeNode, hiliteObj);
    }
});

function lineStrToObj(s) {
    // INPUT: string with line numbers & ranges, e.g., "2,12-14,18"
    // OUTPUT: object with line numbers to hilight (zero-based)
    var tokens = s.split(/\s*,\s*/);
    var rangeArray;
    var obj = { 
        "lines":       [ ], 
        "startRanges": [ ], 
        "endRanges":   [ ]
    };

    for (var i = 0, l = tokens.length; i < l; i++) {
        // individual lines
        if (tokens[i].match(/^\d+$/)) {
            obj['lines'].push((tokens[i] * 1) - 1);
        }
        // line ranges
        else if (tokens[i].match(/^\d+\s*-\s*\d+$/)) {
            rangeArray = tokens[i].split(/\s*-\s*/);
            obj['startRanges'].push((rangeArray[0] * 1) - 1);
            obj['endRanges'].push((rangeArray[1] * 1) - 1);
        }
        // WTF?
        else {
            console.log("Problem: didn't catch case");
            console.log(tokens[i]);
        }
    }
    return(obj);
}

function hiliteCode(codeNode,obj) {
    var lines, n;
    lines = codeNode.textContent.split("\n");
    for (var i = 0, l = obj.lines.length; i < l; i++) {
        n = obj.lines[i];
        lines[n] = '<span>' + lines[n] + '</span>';        
    }
    for (var i = 0, l = obj.startRanges.length; i < l; i++) {
        n = obj.startRanges[i];
        lines[n] = '<span>' + lines[n];
    }
    for (var i = 0, l = obj.endRanges.length; i < l; i++) {
        n = obj.endRanges[i];
        lines[n] += '</span>';
    }
    codeNode.innerHTML = lines.join("\n");
}
