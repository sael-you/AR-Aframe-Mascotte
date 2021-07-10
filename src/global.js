// Mandatory A-Frame import
require('aframe');
const wonSound = require("./assets/won.mp3");
const wonModel = require("./assets/won.glb");
const defeatedSound = require("./assets/Defeated.mp3");
const defeatedModel = require("./assets/Defeated.glb");

// Additional optional components
require('aframe-animation-component');
require('aframe-event-set-component');
require('aframe-layout-component');
require('aframe-template-component');
require('aframe-ar')
require('aframe-extras')
require('aframe-gltf-part-component')
require('aframe-look-at-component')
require('aframe-particle-system-component')
require('assert')
require('aframe-xr')


// Custom components in components/
// require('./components/foo');
import { tapPlaceCursorComponent } from './tap-place-cursor'

AFRAME.registerComponent('tap-place-cursor', tapPlaceCursorComponent)

// runs when user clicks button
AFRAME.registerComponent('start', {
    init() {
        // block pointer events until buttonEnter is clicked
        const uiDiv = document.getElementById('uiDiv')
        uiDiv.style['pointer-events'] = 'auto'

        // set up background blocker
        uiDiv.style['background-color'] = 'rgba(0, 0, 0, 0.75)'

        // indicate clickable with hand cursor (desktop)
        const buttonEnter = document.getElementById('buttonEnter')
        buttonEnter.style.cursor = 'pointer'

        // fade-in functionality
        const fadeIn = function() {
            // allow point events again
            uiDiv.style['pointer-events'] = 'none'

            // remove startButton
            buttonEnter.parentNode.remove(buttonEnter)

            // fade out uiDiv background
            uiDiv.style['background-color'] = 'rgba(0, 0, 0, 0.0)'
            uiDiv.style.transition = 'background-color 1000ms linear'

            // activate the spawner
            const camera = document.querySelector('#camera')
            camera.setAttribute('spawner', '')
        }

        // activate for desktop/touchscreen
        buttonEnter.addEventListener('click', fadeIn)
    },
})