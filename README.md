# amoeba.js

### `Installation`
```bash
npm install amoebas.js
```

### `Usage`

**index.html**
```html
<div id="amoeba-js"></div>

<script src="amoebas.js"></script>
```

**app.js**
```javascript
var biotope = Biotope.init()

var x = 100, y = 100
var options = {
  style: {
    fillStyle: 'green'
  },
  shape: {
    radius: 100
  }
}

// Add an amoeba located at [x, y]
biotope.addAmoeba([x, y], options)

// Start animation
biotope.update() 
```

### `Options`
#### Default
```javascript
{
  shape: {
    numOfPoints: 100,
    radius: 40,
    waveLength: 20, // numOfPoints % waveLength must be 0
    spikyness: 0.5,
    scaleX: 1,
    scaleY: 1
  },
  style: {
    fillStyle: 'rgba(0,0,0,0.1)', // false == nofill
    strokeStyle: false,
    lineWidth: 10
  },
  animation: {
    enabled: true,
    span: 200,
    startTime: 0,
    wiggle: true
  },
  move: {
    enabled: false,
    maxSpeed: 2,
    contain: true,
    padding: 10
  }
}
```
