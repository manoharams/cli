(function(){
  // Append an invisible 'No matches were found.' element to each filtertable.
  var $noResults = $('<div class="no-results"><h3>No results found</h3><p>Your search <span id="filter-value">for that term</span> did not match any <span id="status-value">of our</span> APIs.</p></div>').hide();
  $('.filtertable').after($noResults);

  function showNoMatchMsg(numResults, filterValue, statusValue) {
    var $noResults = $('.no-results');
    if (numResults === 0) {
      // Update the text in the "not found" div in case no results are found
      var statusValue = statusValue || $('#filter-select option:selected').val();
      var filterValue = filterValue || $('input[name=filter-input]').val();
      // Special case text for default/blank inputs
      statusValue === 'All' ? $('#status-value').text('of our') : $('#status-value').html('<strong>' + statusValue + '</strong>');
      filterValue === '' ? $('#filter-value').html('') : $('#filter-value').html('for <strong>"' + filterValue + '"</strong>');
      $noResults.show();
    }
    else {
      $noResults.hide();
    }
  }

  // Move our filter into the nav
  $('.filtertable').filterTable({
      callback: function(term, table) {
        table.find('tr').removeClass('striped').filter(':visible:even').addClass('striped');
        var numResults = table.first().find('tr.visible').length;
        showNoMatchMsg(numResults, term, '');
      },
      label: '',
      placeholder: 'Filter',
      containerTag: 'div',
      containerClass: 'filter-control inline-block',
      inputName: 'filter-input',
      minChars: 3
  });
  $('.filter-control').insertAfter('#filter-spacer');

  // Override the filtertable plugin's pseudoselector so it also accounts for API status filter
  // and the selected tag in the accordion nav
  $.expr[':'].filterTableFind = jQuery.expr.createPseudo(function(arg) {
    return function(el) {
      var $el = $(el);
      // The selected API status
      var filterStatus = $('#filter-select').find('option:selected').text();
      // The name of the selected accordion nav filter (the tag)
      var selectedTag = $('.panel-selected > li').text();
      // The API tags of this API match the selected tag if this TD elements first child has
      // a 'data-tags' attribute that contains the selected tag as a substring
      var apiTags = $el.parent().find(':first-child').attr('data-tags');
      // Deprecated APIs won't have tags so we need to catch for whether apiTags returns undefined
      var doApiTagsMatch = apiTags ? apiTags.indexOf(selectedTag) > -1 : false;
      // the status of this particular API
      var elStatus = $el.parent().find('.api-status').text();
      return $el.text().toUpperCase().indexOf(arg.toUpperCase())>=0 && 
             (elStatus === filterStatus || filterStatus === 'All') &&
             doApiTagsMatch;
    };
  });

  // Make a pseudoselector for table elements based on matches to their data-tags attribute
  // also accounting for the state of the text filter and status filter
  $.expr[':'].apiFind = jQuery.expr.createPseudo(function(tagName) {
    return function(el) {
      var $el = $(el); 
      // The status of this particular API
      var statusText = $el.parent().find('.api-status').text();
      // The selected API status
      var filterStatus = $('#filter-select').find('option:selected').text();
      // The text in the filter box
      var filterText = $('input[name=filter-input]').val();
      var doesFilterMatch = $el.text().toUpperCase().indexOf(filterText.toUpperCase()) >= 0 || filterText.length < 3;
      var apiTags = $el.parent().find(':first-child').attr('data-tags');
      return (apiTags ? apiTags.toUpperCase().indexOf(tagName.toUpperCase())>=0 : false ) &&
             (statusText == filterStatus || filterStatus === 'All') &&
             doesFilterMatch;
    };
  });

  // Make a pseudoselector for table status elements based on matching the innerText with status filter,
  // and also accounting for state of the text filter and the accordion nav
  $.expr[':'].apiStatusFind = jQuery.expr.createPseudo(function(findStatus) {
    return function(el) {
      var $el = $(el);
      // The status of this particular API
      var statusText = $el.parent().find('.api-status').text();
      // The text in the filter box
      var filterText = $('input[name=filter-input]').val();
      // The name of the selected accordion nav filter (the tag)
      var selectedTag = $('.panel-selected > li').text();
      // The filter text matches if the filter text matches a case-insensitive substring
      // of any of the text in this element
      var doesFilterMatch = $el.text().toUpperCase().indexOf(filterText.toUpperCase()) >= 0 || filterText.length < 3;
      // The API tags of this API match the selected tag if this TD elements first child has
      // a 'data-tags' attribute that contains the selected tag as a substring
      var apiTags = $el.parent().find(':first-child').attr('data-tags');
      // Deprecated APIs won't have tags so we need to catch for whether apiTags returns undefined
      var doApiTagsMatch = apiTags ? apiTags.indexOf(selectedTag) > -1 : false;
      // if "All" is passed, just match everything that matches the text filter and ignore status
      // but do account for the accordion nav state
      if (findStatus === "All") {
        return doesFilterMatch && doApiTagsMatch;
      }
      // Otherwise it's a match if the filter text matches, if the data-tags on this api row match
      // our selected accordion nav,  and also the status of this API matches the passed status
      else {
        return statusText === findStatus && doesFilterMatch && doApiTagsMatch;
      }
    };
  });

  // Accordion nav input hooks
  var $tbody = $('table.filtertable').find('tbody');
  // Bind a click event that fires off a filter action on the table
  $('.nav-filter').click(function() {
    var tagSearchTerm = $(this).attr('data-tag');
    if ($tbody && tagSearchTerm) {
      $tbody.find('tr').hide().removeClass('visible');
      var $found = $tbody.find('td').filter(':apiFind("' + tagSearchTerm + '")').closest('tr').show().addClass('visible');
      showNoMatchMsg($found.length, '');
      // Just hide the "no results" panel if we're searching from the accordion
      $noResults.hide();
      // Change the selected accordion panel to reflect the newly clicked one
      $('.panel-selected').removeClass('panel-selected');
      $(this).children().first().addClass('panel-selected');
      // Change the filter value to 'All' but DO NOT fire its change event, as this would override the
      // accordion nav filter
      //$('#filter-select').val('All');
      //$('input[name=filter-input]').val('');
    }
  });

  // Filter status selector input hooks
  $('#filter-select').change(function() {
    var $selected = $(this).find('option:selected');
    var statusSearchTerm = $selected.text();
    if ($tbody && statusSearchTerm) {
      // Perform the filter/search
      $tbody.find('tr').hide().removeClass('visible');
      var $found = $tbody.find('td').filter(':apiStatusFind("' + statusSearchTerm + '")').closest('tr').show().addClass('visible');
      showNoMatchMsg($found.length, '', statusSearchTerm);
    }
  });

  // Bootswatch accordion: apply glyphicon +/- icons
  $('.collapse').on('shown.bs.collapse', function(){
    $(this).parent().find(".glyphicon-chevron-down").removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
  })
  .on('hidden.bs.collapse', function(){
    $(this).parent().find(".glyphicon-chevron-up").removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
  });

  // If we have a search query, include it in the search bar
  var searchQueryParam = window.location.search.match(/(|&)q=(.*)(&|$)/)
  if (searchQueryParam) {
    $('input[name=q]').val(decodeURIComponent(searchQueryParam[2].replace(/\+/g,' ')));
  }
}());
