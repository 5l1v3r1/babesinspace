(function() {

  window.addEventListener('load', function() {
    var contents = document.getElementById('contents');
    for (var i = 0, len = window.astronauts.length; i < len; ++i) {
      var ast = window.astronauts[i];
      var element = document.createElement('div');
      element.className = 'astronaut';

      var image = document.createElement('div');
      image.className = 'astronaut-image';
      image.style.backgroundImage = 'url("' + ast.biophoto + '")';
      element.appendChild(image);

      var name = document.createElement('h2');
      name.className = 'astronaut-name';
      name.innerText = ast.name;
      element.appendChild(name);

      var days = document.createElement('h3');
      days.className = 'astronaut-days';
      days.innerText = ast.days + ' days in space';
      element.appendChild(days);

      var description = document.createElement('p');
      description.className = 'astronaut-description';
      var bio = ast.bio;
      var idx = bio.indexOf('.');
      if (idx >= 0) {
        bio = bio.substr(0, idx+1);
      }
      if (bio.length > 130) {
        bio = bio.substr(0, 130) + '...';
      }
      description.innerText = bio;
      element.appendChild(description);

      var links = document.createElement('div');
      var bioLink = document.createElement('a');
      bioLink.className = 'astronaut-link bio-link';
      bioLink.href = ast.biolink;
      links.appendChild(bioLink);

      if (ast.twitter) {
        var twitterLink = document.createElement('a');
        twitterLink.className = 'astronaut-link twitter-link';
        twitterLink.href = ast.twitter;
        links.appendChild(twitterLink);
        links.className = 'astronaut-links dual-links';
      } else {
        links.className = 'astronaut-links mono-links';
      }
      element.appendChild(links);

      if (ast.gender === 1) {
        element.className += ' female-astronaut';
      }

      contents.appendChild(element);
    }
  });

})();
