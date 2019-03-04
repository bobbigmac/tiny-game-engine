
var width = 10, height = 10, bottom = 200, right = 200;
var grav = 1, gravFps = 30, time = new Date().getTime();
var count = 0, stopped = false;

canvas = document.getElementById('main');
context = canvas.getContext('2d');
toggle = document.getElementById('toggle-movement');

toggle.addEventListener('click', function(event) {
  stopped = !stopped;
  event.target.innerText = stopped ? 'Resume' : 'Stop';
});


// Render funcs
var renderTimeout = false;
var render = function() {
  console.log('rendering');
  context.clearRect(0, 0, bottom, right);
  things.map(function(thing, pos, things) {
    context.fillStyle = thing.color;
    context.fillRect(thing.x, thing.y, width, height);
  });
  renderTimeout = false;
}

// Rerender trap
var rerenderTrap = {
  set: function(target, key, value) {
    // console.log(target, key, value);
    if(target[key] !== value) {
      target[key] = value;

      if(!renderTimeout) {
        renderTimeout = requestAnimationFrame(render);
      }
    }
    return true;
  }
};

var things = new Proxy([], rerenderTrap);

//Add a thing every second
var addAThing = function() {
  var col = Math.floor(255*Math.random());
  !stopped && things.push(new Proxy({ id: count++, x: Math.floor((right / width) * Math.random()) * width , y: 0, color: 'rgb('+col+','+(255-col)+','+col+')', dx: 0, dy: 0, time: new Date().getTime() }, rerenderTrap));
}
setInterval(addAThing, 1000);

//Move all things (crap gravity)
var moveAllThings = function() {
  var now = new Date().getTime();
  
  !stopped && things.map(function(thing, pos, things) {
    if(!thing.stop && things[pos].y < (bottom - height)) {
      var seconds = (now - thing.time) / 1000;
      var move = (grav * seconds);

      things[pos].dy = thing.dy && thing.dy * move || move;
      
      //console.log(grav, (grav * seconds), things[pos].y);
      things[pos].y += Math.ceil(things[pos].dy);
      if(things[pos].y > (bottom - height)) {
        things[pos].y = (bottom - height);
        things[pos].stop = true;
      }
      
      // Check collisions
      things[pos].collisions = things.filter(other => other.id != thing.id && other.y >= thing.y && other.x >= thing.x && other.y < thing.y + height && other.x < thing.x + width)
      if(things[pos].collisions.length) {
        things[pos].collisions.forEach(collider => things[pos].y = collider.y - height);
        things[pos].stop = true;
      }
    }
  });
}
setInterval(moveAllThings, 1000 / 60);