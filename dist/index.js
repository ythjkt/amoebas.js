!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports["amoeba.js"]=e():t["amoeba.js"]=e()}(window,function(){return function(t){var e={};function i(n){if(e[n])return e[n].exports;var o=e[n]={i:n,l:!1,exports:{}};return t[n].call(o.exports,o,o.exports,i),o.l=!0,o.exports}return i.m=t,i.c=e,i.d=function(t,e,n){i.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},i.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},i.t=function(t,e){if(1&e&&(t=i(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var o in t)i.d(n,o,function(e){return t[e]}.bind(null,o));return n},i.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return i.d(e,"a",e),e},i.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},i.p="",i(i.s=0)}([function(t,e,i){"use strict";const n=i(1);t.exports=n},function(t,e,i){"use strict";function n(t,e){this.x=t||0,this.y=e||0}i.r(e),n.prototype.copy=function(){return new n(this.x,this.y)},n.prototype.add=function(t,e){return t instanceof n?(this.x+=t.x,this.y+=t.y):(this.x+=t||0,this.y+=e||0),this},n.prototype.sub=function(t,e){return t instanceof n?(this.x-=t.x,this.y-=t.y):(this.x-=t||0,this.y-=e||0),this},n.prototype.mult=function(t){return"number"==typeof t&&(this.x*=t,this.y*=t),this},n.prototype.mag=function(){return Math.sqrt(this.magSq())},n.prototype.magSq=function(){return this.x*this.x+this.y*this.y},n.prototype.limit=function(t){let e=this.magSq();return e>Math.pow(t,2)?this.mult(t/Math.sqrt(e)):this};var o=n;function s(t,e,i,n){let o=e-t;return(n/=i/2)<1?o/2*n*n*n+t:o/2*((n-=2)*n*n+2)+t}function r(t,e){for(let i in e)e[i]&&e[i].constructor&&e[i].constructor===Object?(t[i]=t[i]||{},r(t[i],e[i])):t[i]=e[i];return t}function a(t,e){return t+Math.random()*(e-t)}function h(t,e,i){this.ctx=t,void 0===e?e=new o(0,0):e.constructor===Array&&(e=new o(e[0],e[1])),this.center=e,this.width=t.canvas.width/2,this.height=t.canvas.height/2,this.options=r({shape:{numOfPoints:100,radius:40,waveLength:20,spikyness:.5,scaleX:1,scaleY:1},style:{fillStyle:"rgba(0,0,0,0.1)",strokeStyle:!1,lineWidth:10},animation:{enabled:!0,span:200,startTime:0,wiggle:!0},move:{enabled:!1,maxSpeed:2,contain:!0,padding:10}},i),this.time=this.options.animation.startTime,this.fromState=this.generateState(),this.toState=this.generateState(),this.coords=this.generateCoords(),this.center=e,this.velocity=new o(0,0)}function c(t,e){this.amoebas=[],this.ctx=t,this.width=t.canvas.width/2,this.height=t.canvas.height/2}h.prototype.updateOptions=function(t){this.options=r(this.options,t)},h.prototype.stopAnimation=function(){this.updateOptions({animation:{enabled:!1}})},h.prototype.stopMove=function(){this.updateOptions({move:{enabled:!1}})},h.prototype.addMirror=function(t){},h.prototype.generateState=function(){const{numOfPoints:t,waveLength:e,spikyness:i}=this.options.shape;let n,o,r,h,c=[];r=a(-.5,.5),h=a(-.5,.5),n=o=r,c[0]=1+o*i;for(let u=1;u<t;u++)u+e===t?(r=h,h=n,o=r):u%e==0?(r=h,h=a(-.5,.5),o=r):o=s(r,h,e,u%e),c[u]=1+o*i;return c},h.prototype.generateCoords=function(){const{fromState:t,toState:e,time:i}=this,{numOfPoints:n,radius:o}=this.options.shape,{span:r,wiggle:a}=this.options.animation;let h=[];for(let n=0;n<t.length;n++)h[n]=s(t[n],e[n],r,i);let c=[],u=2*Math.PI/n;for(let t=0;t<n;t++){let e=u*t;a&&(e+=.2*Math.cos(2*Math.PI*(i/r)+e),e+=.05*Math.cos(2*Math.PI*(i/r)*2+e)),c[2*t]=h[t]*Math.cos(e)*o,c[2*t+1]=h[t]*Math.sin(e)*o}return c},h.prototype.move=function(){let{velocity:t,center:e,ctx:i,width:n,height:o}=this,{radius:s,scaleX:r,scaleY:h}=this.options.shape,{maxSpeed:c,contain:u,padding:p}=this.options.move,l=c/100;if(t.add(a(-.01,.01),a(-.01,.01)).limit(c),u){let i=s*r+p,a=s*h+p;e.x<0+i?t.add(l,0).limit(c):e.x>n-2*i&&t.add(-l,0).limit(c),this.center.y<0+2*a?this.velocity.add(0,l).limit(c):this.center.y>o-a&&this.velocity.add(0,-l).limit(c)}e.add(t)},h.prototype.update=function(){const{animation:t,move:e}=this.options;this.time+=1,t.enabled&&(this.time>=t.span&&(this.fromState=this.toState,this.toState=this.generateState(),this.time=0),this.coords=this.generateCoords()),e.enabled&&this.move()},h.prototype.render=function(){const{ctx:t,coords:e}=this,{strokeStyle:i,lineWidth:n,fillStyle:o,scaleX:s,scaleY:r}=this.options.style;t.save(),t.translate(this.center.x,this.center.y),t.scale(s,r),t.beginPath();for(let i=0;i<e.length/2;i++)t.lineTo(e[2*i],e[2*i+1]);t.lineTo(e[0],e[1]),o&&(t.fillStyle=o,t.fill()),i&&(t.lineWidth=n,t.strokeStyle=i,t.stroke()),t.restore()},c.init=function(t="amoeba-js",e){let i=document.querySelector(`#${t}`);if(i){let t=i.clientWidth||600,n=i.clientHeight||300,o=document.createElement("canvas");o.width=2*t,o.height=2*n,o.style.width=t+"px",o.style.height=n+"px";let s=o.getContext("2d");return s.scale(2,2),i.appendChild(o),new c(s,e)}},c.prototype.addAmoeba=function(t,e){t=t||[this.width/2,this.height/2],this.amoebas.push(new h(this.ctx,t,e))},c.prototype.removeAmoeba=function(t){return t?this.amoebas.splice(num,1)[0]:this.amoebas.pop()},c.prototype.update=function(){const{ctx:t}=this;this.amoebas.forEach(t=>t.update()),t.clearRect(0,0,t.canvas.width,t.canvas.height),this.amoebas.forEach(t=>t.render()),window.requestAnimationFrame(this.update.bind(this))};e.default=c}])});