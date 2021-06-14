//
// ball brearing demo
// using three.js
// Craig Fitzgerald

import $ from "jquery";
import * as THREE from 'three';
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { CSS3DRenderer, CSS3DSprite } from 'three/examples/jsm/renderers/CSS3DRenderer.js';


class PageHandler {
   constructor() {
      $(window).on("resize", () => this.DoResize());
      this.SetupThree();
   }

   SetupThree() {
      this.particlesTotal = 512;
      this.positions = [];
      this.objects = [];
      this.current = 0;

      this.renderer = new CSS3DRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(this.renderer.domElement);

      this.scene = new THREE.Scene();

      this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
      this.camera.position.set(800, 900, 2200);
      this.camera.lookAt(0, 0, 0);

      this.AddPlane     (0);
      this.AddPlane     (1);
      //this.AddCenter  ();
      this.AddDonut     ();
      this.AddCube      ();
      this.AddHollowCube();
      this.AddPyramid   ();
      this.AddSphere    ();
      this.AddCylinder  ();
      this.AddCross     ();
      this.AddRandom    ();

      let image = document.createElement('img');
      image.addEventListener('load', () => {
         for (let i = 0; i < this.particlesTotal; i ++) {
            let object = new CSS3DSprite(image.cloneNode());
            object.position.x = Math.random() * 4000 - 2000,
            object.position.y = Math.random() * 4000 - 2000,
            object.position.z = Math.random() * 4000 - 2000;
            this.scene.add(object);
         
            this.objects.push(object);
         }
         this.Transition();
      });
      image.src = 'textures/sprite.png';

      this.controls = new TrackballControls(this.camera, this.renderer.domElement);

      window.addEventListener('resize', () => this.DoResize());
   }


   DoResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
   }


   Transition() {
      let duration = 2000;
      let position = this.positions[this.current];

      for (let i=0, j=0; i < this.particlesTotal; i++, j += 3) {
         let object = this.objects[ i ];

         new TWEEN.Tween(object.position)
            .to({
               x: position[ j ],
               y: position[ j + 1 ],
               z: position[ j + 2 ]
            }, Math.random() * duration + duration)
            .easing(TWEEN.Easing.Exponential.InOut)
            .start();
      }
      new TWEEN.Tween()     // ??
         .to({}, duration * 3)
         .onComplete(() => this.Transition())
         .start();

      this.current = (this.current + 1) % this.positions.length;
   }


   Animate() {
      requestAnimationFrame(() => this.Animate());
      TWEEN.update();
      this.controls.update();

      let time = performance.now();

      //use this: this.scene.traverse(function (object) {
      for (let i = 0, l = this.objects.length; i < l; i ++) {
         let object = this.objects[ i ];
         let scale = Math.sin((Math.floor(object.position.x) + time) * 0.003) * 0.2 + 1;
         object.scale.set(scale, scale, scale);
      }
      this.renderer.render(this.scene, this.camera);
   }


   AddPlane(undulate) {
      let position = [];
      let amountX = 16;
      let amountZ = 32;
      let separationPlane = 150;
      let offsetX = ((amountX - 1) * separationPlane) / 2;
      let offsetZ = ((amountZ - 1) * separationPlane) / 2;
      let x,y,z;

      for (let i = 0; i < this.particlesTotal; i ++) {
         x = (i % amountX) * separationPlane;
         z = Math.floor(i / amountX) * separationPlane;
         y = undulate ? (Math.sin(x * 0.5) + Math.sin(z * 0.5)) * 200 : 0;
         position.push(x - offsetX, y, z - offsetZ);
      }
      this.positions.push(position);
   }


   AddCube() {
      let position = [];
      let amount = 8;
      let separationCube = 150;
      let offset = ((amount - 1) * separationCube) / 2;
      let x,y,z;

      for (let i = 0; i < this.particlesTotal; i ++) {
         x = (i % amount) * separationCube;
         y = Math.floor((i / amount) % amount) * separationCube;
         z = Math.floor(i / (amount * amount)) * separationCube;
         position.push(x - offset, y - offset, z - offset);
      }
      this.positions.push(position);
   }


   AddSphere() {
      let position = [];
      let radius = 800;

      for (let i = 0; i < this.particlesTotal; i ++) {
         let phi = Math.acos(- 1 + (2 * i) / this.particlesTotal);
         let theta = Math.sqrt(this.particlesTotal * Math.PI) * phi;

         position.push(
            radius * Math.cos(theta) * Math.sin(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(phi)
        );
      }
      this.positions.push(position);
   }


   AddHollowCube() {
      let position = [];
      let amount = 10;
      let gap = 140;
      let offset = ((amount - 1) * gap) / 2;
      let x,y,z;

      for (let dx=0; dx<amount; dx++) {
         for (let dy=0; dy<amount; dy++) {
            x = dx * gap;
            y = dy * gap;
            z = 0;
            position.push(x - offset, y - offset, z - offset);

            z = (amount - 1)  * gap;;
            position.push(x - offset, y - offset, z - offset);
         }
      }
      for (let dz=1; dz<amount - 1; dz++) {
         for (let di=0; di<amount - 1; di++) {
            x = di * gap;
            y = 0;
            z = dz * gap;
            position.push(x - offset, y - offset, z - offset);

            y = (amount - 1) * gap;
            x = (amount - di - 1) * gap;
            position.push(x - offset, y - offset, z - offset);

            x = 0;
            y = (di + 1) * gap;
            position.push(x - offset, y - offset, z - offset);

            x = (amount - 1) * gap;
            y = di * gap;
            position.push(x - offset, y - offset, z - offset);
         }
      }
      let count = amount * amount * 2 + (amount - 2) * (amount - 1) * 4;
      this.HandleRemainders(position, count, -offset, -offset, -offset);
      this.positions.push(position);
   }


   AddLine() {
      let position = [];
      let gap = 120;
      let offset = 2500;

      for (let i = 0; i < this.particlesTotal / 4; i ++) {
         for (let j = 0; j < 2; j ++) {
            for (let k = 0; k < 2; k ++) {
               let x =  k * gap;
               let y =  j * gap;
               let z =  - i * gap;
               position.push(x, y, z + offset);
            }
         }
      }
      this.positions.push(position);
   }


   AddCross() {
      let position = [];
      let gap = 120;

      this.BoxAt(position, 0,  0, 0);
      for (let i=0; i<10; i++) {
         let ctr = i * gap * 2;
         this.BoxAt(position, ctr ,  0, 0   );
         this.BoxAt(position, -ctr,  0, 0   );
         this.BoxAt(position, 0 , ctr , 0   );
         this.BoxAt(position, 0 , -ctr, 0   );
         this.BoxAt(position, 0 , 0   , ctr );
         this.BoxAt(position, 0 , 0   , -ctr);
      }
      this.HandleRemainders(position, 8*6*10+1, 0, 0, 0);
      this.positions.push(position);
   }


   BoxAt(position, xoff, yoff, zoff) {
      let x,y,z;
      let gap = 120;

      for (let xi=0; xi<2; xi++) {
         for (let yi=0; yi<2; yi++) {
            for (let zi=0; zi<2; zi++) {
              x = (xi-.5)*gap + xoff;
              y = (yi-.5)*gap + yoff;
              z = (zi-.5)*gap + zoff;
              position.push(x, y, z);
            }
         }
      }
   }


   AddCylinder() {
      let position = [];
      let gap = 100;
      let offset = 1000;
      let radius = 700;
      let rows = 16;
      let pi = Math.PI;
      let a,x,y,z;
      let cols = Math.floor(this.particlesTotal / rows);

      for(let r = 0; r < rows; r++) {
         for(let c = 0; c < cols; c++) {
            a = (c/cols) * 2 * pi + (r % 2) * (1/cols) * pi;
            x = Math.cos(a) * radius;
            z = Math.sin(a) * radius;
            y = r * gap;
            position.push(x, y - offset, z);
         }
      }
      this.positions.push(position);
   }


   AddDonut() {
      let position = [];
      let offset = 200;
      let iRad = 160;
      let oRad = 1200;
      let gap = 100;
      let innerCt = 8;
      let outerCt = this.particlesTotal / innerCt;
      let pi = Math.PI;
      let a,b,x,y,z;

      for (let j=0; j<outerCt; j++) {
         a = (j/outerCt) * 2 * pi;
         for (let i=0; i<innerCt; i++) {
            b = (i/innerCt) * 2 * pi + (j % 2) * (1/innerCt) * pi;
            x = Math.cos(a) * oRad + Math.cos(b) * iRad ;
            y =                      Math.sin(b) * iRad ;
            z = Math.sin(a) * oRad                      ;
            position.push(x, y, z - offset);
         }
      }
      this.positions.push(position);
   }


   AddPyramid() {
      let position = [];
      let gap = 120;
      let offset = 500;
      let off, x, y, z;

      for (let i = 11; i > 0; i--) {
         for (let j = 0; j<i; j++) {
            for (let k = 0; k<i; k++) {
               off = - ((i - 1) * gap) / 2
               x = k * gap + off;
               y = - i * gap * .75 + offset;
               z = j * gap + off;
               position.push(x,y,z);
            }
         }
      }
      this.HandleRemainders(position, 506, 0, 0, 0);
      this.positions.push(position);
   }


   AddCenter() {
      let position = [];
      for (let i = 0; i < this.particlesTotal; i ++) {
         position.push(0, 0, 0);
      }
      this.positions.push(position);
   }


   AddRandom() {
      let position = [];
      for (let i = 0; i < this.particlesTotal; i ++) {
         position.push(
            Math.random() * 4000 - 2000,
            Math.random() * 4000 - 2000,
            Math.random() * 4000 - 2000
        );
      
      }
      this.positions.push(position);
   }

   HandleRemainders(position, count, x, y, z) {
      let remain = this.particlesTotal - count;
      for (let i = 0; i < remain; i ++) {
         position.push(x, y, z);
      }
   }
}


$(function() {
   let p = new PageHandler();
   p.Animate();
});
