var things = [], width = 10, height = 10, bottom = 200, right = 200;
var grav = 1, gravFps = 30, time = new Date().getTime();
var count = 0;

setup = function() {
  things.push({ id: count++, x: 0, y: 0, color: 'red', dx: 0, dy: 0, time: new Date().getTime() });
  things.push({ id: count++, x: 50, y: 0, color: 'green', dx: 0, dy: 0, time: new Date().getTime() });
};
setup();

setInterval(function() {
  var col = Math.floor(255*Math.random());
  things.push({ id: count++, x: Math.floor((right / width) * Math.random()) * width , y: 0, color: 'rgb('+col+','+(255-col)+','+col+')', dx: 0, dy: 0, time: new Date().getTime() });
}, 1000);

canvas = document.getElementById('main');
context = canvas.getContext('2d');

draw = function() {
  var now = new Date().getTime();
  context.clearRect(0, 0, bottom, right);

  // if(things.length > 20) {
  //   things.shift();
  // }
  
  things.map(function(thing, pos, things) {
  
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
    
    //console.log('thing.color', thing.color);
    context.fillStyle = thing.color;
    context.fillRect(thing.x, thing.y, width, height);
    //context.fill();
    
    return thing;
  });
  //console.log(things);
  requestAnimationFrame(draw);
};
//setInterval(draw, 1000 / 60);
requestAnimationFrame(draw);
