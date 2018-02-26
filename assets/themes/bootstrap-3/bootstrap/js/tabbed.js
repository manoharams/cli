window.addEventListener('load', function() {
    var group, groupName, tabName, tabDivs;
    var input, label;
    var groups = document.querySelectorAll('.tabs');
    // each set of TABs...
    for (var i = 0; i < groups.length ; i++) {
        group = groups[i];
        // This gets around browsers that don't support the dataset API:
        groupName = group.getAttribute('data-op').toLowerCase();
        // temporarily remove DIVs within the outer "tabs" DIV:
        tabDivs = group.querySelectorAll('div');
        // group.innerHTML = '';
        while (group.hasChildNodes()) {
            group.removeChild(group.firstChild);
        }
        // each TAB...
        for (var t = 0; t < tabDivs.length ; t++ ) {
            input = document.createElement('input');
            label = document.createElement('label');
            tabName = tabDivs[t].className.toLowerCase();
            tabDivs[t].removeAttribute('class');
            input.setAttribute('type', 'radio');
            input.setAttribute('name', groupName);
            input.setAttribute('id', groupName  + '-' + tabName);
            label.setAttribute('for', groupName  + '-' + tabName);
            // Use underscores in classnames for tabs w/>1 word:
            tabName = tabName.replace(/_/, " ");
            label.innerHTML = tabName;
            // labels are classed "tab1", "tab2", etc.
            label.className = 'tab' + (t + 1);
            // proper sequence is input/label/div:
            group.appendChild(input);
            group.appendChild(label);
            group.appendChild(tabDivs[t]);
        }
        // First tab must be selected by default
        group.querySelector('input').setAttribute('checked', 'checked');
    }
});
