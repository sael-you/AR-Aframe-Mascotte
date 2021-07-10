// Component that places trees at cursor location when screen is tapped
const tapPlaceCursorComponent = {
    init() {
        this.raycaster = new THREE.Raycaster()
        this.camera = document.getElementById('camera')
        this.threeCamera = this.camera.getObject3D('camera')
        this.ground = document.getElementById('ground')
        this.button = document.getElementById('btn')
        this.isPlaying = false
            // this.sound = document.getElementById('sound')
        this.soundPlaying = false

        // Extract data from URL
        const url = new URL(window.location.href)
        this.state = url.searchParams.get('state')
        const callToActionTxtBtn = url.searchParams.get('call_to_action_txt_btn')
        const callToActionUrl = url.searchParams.get('call_to_action_url')
        this.button.setAttribute('href', callToActionUrl)
        this.button.innerHTML = callToActionTxtBtn

        this.palette = ['#08FF00', '#F7FF00', '#FF0000', '#00FFF3', '#000FFF', '#A200FF', '#FF0093']

        // 2D coordinates of the raycast origin, in normalized device coordinates (NDC)---X and Y
        // components should be between -1 and 1.  Here we want the cursor in the center of the screen.
        this.rayOrigin = new THREE.Vector2(0, 0)

        this.cursorLocation = new THREE.Vector3(0, 0, 0)
        this.placed = false
        this.el.sceneEl.addEventListener('click', (event) => {
            console.log('here')
                // Create new entity for the new object
                // Spawn model at location of the cursor
            if (!this.placed) {
                this.newElement = document.createElement('a-entity')
                this.newElement.setAttribute('visible', 'false')
                this.newElement.setAttribute('scale', '5 5 5')
                if (this.state == 'lost') {
                    // this.sound = new Howl({
                    //   src: ['Defeated.mp3'],
                    // })
                    // this.sound.setAttribute('sound', 'src = #defeatedSound')
                    this.sound = document.querySelector('#defeatedSound')
                    document.getElementById('text').innerHTML += 'Voud avez perdu :('
                    this.newElement.setAttribute('gltf-model', '#defeated')
                } else if (this.state == 'won') {
                    // this.sound = new Howl({
                    //   src: ['won.mp3'],
                    // })
                    // this.sound.setAttribute('sound', 'src = #wonSound')
                    this.sound = document.querySelector('#wonSound')
                    console.log(this.sound)
                    document.getElementById('text').innerHTML += 'Félicitation !!!'
                    this.newElement.setAttribute('gltf-model', '#won')
                }

                this.newElement.setAttribute('shadow', { receive: false })
                this.newElement.addEventListener('model-loaded', () => {
                    // Once the model is loaded, we are ready to show it popping in using an animation
                    this.newElement.setAttribute('visible', 'true')
                    this.newElement.setAttribute('animation-mixer', {
                        clip: 'Armature|mixamo.com|Layer0',
                        loop: 'repeat',
                        crossFadeDuration: 0.4,
                    })
                    this.loaded = true
                })
                this.placed = true
                this.el.sceneEl.appendChild(this.newElement)
                    // Create new entity for the new object
                if (this.state == 'won') {
                    for (let i = 0; i < 3; i++) {
                        const angle = 0.4 * Math.PI * 2
                        const radius = 0.1 + Math.random() * 0.5
                        const y = Math.random() * 0.5
                        const x = Math.sin(angle) * radius
                        const z = Math.cos(angle) * radius
                        const newPole = document.createElement('a-entity')
                        const newRocket = document.createElement('a-entity')
                        newRocket.classList.add('rocket')
                        newPole.classList.add('pole')
                            // newPole.setAttribute('gltf-model', '#poleModel')
                            // newRocket.setAttribute('gltf-model', '#rocketModel')
                        newPole.setAttribute('position', `${x} ${y} ${z}`)
                        newRocket.setAttribute('position', `${x} ${y} ${z}`)
                        newPole.appendChild(newRocket)
                        this.newElement.appendChild(newPole)
                        this.isPlaying = false
                    }
                    this.rockets = Array.from(document.getElementsByClassName('rocket'))
                }
            }
            this.isPlaying = false
            this.button.classList.toggle('fadeIn')
            this.sound.currentTime = 0
            this.sound.play()

            this.newElement.setAttribute('position', this.el.object3D.position)

            if (!this.isPlaying && this.state == 'won') {
                // this.isPlaying = true

                this.rockets.forEach((rocket) => {
                    const rocketParticles = document.createElement('a-entity')
                    const rocketPos = rocket.parentNode.getAttribute('position')

                    const initPos = `${rocketPos.x} 4 ${rocketPos.z}`
                    const wickEndPos = `${rocketPos.x} ${rocketPos.y + 3} ${rocketPos.z}`
                    const endPos = `${rocketPos.x} ${rocketPos.y + 2} ${rocketPos.z}`

                    const randColor1 = this.palette[(Math.random() * this.palette.length) >> 0]
                    const randColor2 = this.palette[(Math.random() * this.palette.length) >> 0]

                    // activate wick particles
                    rocketParticles.setAttribute('position', initPos)
                    rocketParticles.setAttribute('scale', '1 1 1')
                    rocketParticles.setAttribute('particle-system', {
                        color: '#F4D03F,#7D6608',
                        positionSpread: '0 0.5 0',
                        rotationAxis: 'x',
                        direction: '-1',
                        particleCount: '250',
                        maxParticleCount: '500',
                        maxAge: '0.45',
                        accelerationValue: '0, -0.01, 0',
                        accelerationSpread: '0 0 0',
                        velocityValue: '0 0 0',
                        blending: 1,
                    })

                    rocketParticles.setAttribute(
                        'animation__wickup', { property: 'position', to: wickEndPos, dur: 1500 }
                    )

                    this.newElement.appendChild(rocketParticles)

                    // time to fly
                    setTimeout(() => {
                        rocketParticles.removeAttribute('particle-system')
                        rocketParticles.setAttribute('particle-system', {
                            color: '#00BDFF,#7C00FF',
                            positionSpread: '0 0 0',
                            rotationAxis: 'x',
                            direction: '1',
                            size: '1.5',
                            particleCount: '500',
                            maxParticleCount: '500',
                            maxAge: '0.45',
                            accelerationValue: '0, -50, 0',
                            accelerationSpread: '0 50 0',
                            velocityValue: '0 0 0',
                            blending: 1,
                        })

                        rocket.setAttribute(
                            'animation__fly', { property: 'position', to: '0 1.3 0', dur: 3000 }
                        )

                        rocketParticles.setAttribute(
                            'animation__up', { property: 'position', to: endPos, dur: 3000 }
                        )
                    }, 1500)

                    // time to explosion
                    setTimeout(() => {
                        rocketParticles.removeAttribute('particle-system')
                        rocketParticles.setAttribute('particle-system', {
                            color: `${randColor1},${randColor2}`,
                            positionSpread: '0 0.5 0',
                            rotationAxis: 'x',
                            duration: '1',
                            size: '2.5',
                            direction: '-1',
                            rotationAngle: '0',
                            particleCount: '250',
                            maxParticleCount: '500',
                            maxAge: '0.6',
                            accelerationValue: '0, -1, 0',
                            accelerationSpread: '0 -1 0',
                            velocityValue: '0 0 0',
                            blending: 1,
                        })

                        rocketParticles.setAttribute(
                            'animation__blast', { property: 'scale', to: '3 3 3', easing: 'easeInOutQuad', dur: 500 }
                        )

                        rocket.setAttribute(
                            'animation__zipout', { property: 'scale', to: '0.001 1 0.001', dur: 100 }
                        )
                    }, 4500)

                    setTimeout(
                        () => Array.from(document.getElementsByClassName('rocket')).forEach((r) => {
                            r.setAttribute('visible', 'false')
                            r.classList.remove('rocket')
                        }),
                        5000
                    )

                    setTimeout(() => {
                        console.log('timeout final')
                        this.isPlaying = false
                    }, 6000)
                })
            }
        })

        document.querySelector('a-scene').addEventListener('loaded', () => {
            document.getElementById('enter').classList.add('buttonUILoaded')
        })
    },
    tick() {
        // Raycast from camera to 'ground'
        this.raycaster.setFromCamera(this.rayOrigin, this.threeCamera)
        const intersects = this.raycaster.intersectObject(this.ground.object3D, true)

        if (intersects.length > 0) {
            const [intersect] = intersects
            this.cursorLocation = intersect.point
        }
        // console.log(this.isPlaying)

        if (this.loaded) {
            this.newElement.setAttribute('look-at',
                `${this.camera.object3D.position.x} 0 ${this.camera.object3D.position.z}`)
        }

        this.el.object3D.position.y = 0.1
        this.el.object3D.position.lerp(this.cursorLocation, 0.4)
        this.el.object3D.rotation.y = this.threeCamera.rotation.y
    },
}

export { tapPlaceCursorComponent }