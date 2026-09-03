/*===== MENU SHOW =====*/ 
/* A small canvas field keeps the background alive without adding DOM nodes. */
const backgroundCanvas = document.getElementById('background-canvas')

if (backgroundCanvas) {
    const backgroundContext = backgroundCanvas.getContext('2d')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const particles = []
    const cursor = { x: 0, y: 0, targetX: 0, targetY: 0 }
    let animationFrame
    let width = 0
    let height = 0
    let devicePixelRatio = 1

    const createParticles = () => {
        const count = Math.min(150, Math.max(40, Math.round((width * height) / 12000)))
        particles.length = 0

        for (let index = 0; index < count; index += 1) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.8 + 0.7,
                speedX: (Math.random() - 0.5) * 0.22,
                speedY: (Math.random() - 0.5) * 0.22,
                phase: Math.random() * Math.PI * 2,
                hue: Math.random() > 0.82 ? 285 : Math.random() > 0.62 ? 145 : 188
            })
        }
    }

    const resizeCanvas = () => {
        width = window.innerWidth
        height = window.innerHeight
        devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2)
        backgroundCanvas.width = Math.floor(width * devicePixelRatio)
        backgroundCanvas.height = Math.floor(height * devicePixelRatio)
        backgroundContext.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
        createParticles()
        drawBackground(0)
    }

    const drawBackground = (time) => {
        backgroundContext.clearRect(0, 0, width, height)
        const connectionDistance = Math.min(165, width * 0.14)

        // Calculate every rendered position first so connection lines use fresh coordinates.
        particles.forEach((particle) => {
            if (!reducedMotion.matches) {
                particle.x += particle.speedX
                particle.y += particle.speedY
                if (particle.x < -20) particle.x = width + 20
                if (particle.x > width + 20) particle.x = -20
                if (particle.y < -20) particle.y = height + 20
                if (particle.y > height + 20) particle.y = -20
            }

            const cursorDistanceX = particle.x - cursor.x
            const cursorDistanceY = particle.y - cursor.y
            const cursorDistance = Math.hypot(cursorDistanceX, cursorDistanceY)
            const influence = Math.max(0, 1 - cursorDistance / 300)
            const offsetX = cursorDistanceX * influence * 0.07
            const offsetY = cursorDistanceY * influence * 0.07
            const x = particle.x - offsetX
            const y = particle.y - offsetY

            particle.renderX = x
            particle.renderY = y
        })

        particles.forEach((particle, index) => {
            const pulse = 0.7 + Math.sin(time * 0.0008 + particle.phase) * 0.24
            const x = particle.renderX
            const y = particle.renderY
            backgroundContext.beginPath()
            backgroundContext.arc(x, y, particle.radius, 0, Math.PI * 2)
            backgroundContext.fillStyle = `hsla(${particle.hue}, 88%, 58%, ${pulse})`
            backgroundContext.fill()

            for (let nextIndex = index + 1; nextIndex < particles.length; nextIndex += 1) {
                const nextParticle = particles[nextIndex]
                const distance = Math.hypot(x - nextParticle.renderX, y - nextParticle.renderY)
                if (distance < connectionDistance) {
                    backgroundContext.beginPath()
                    backgroundContext.moveTo(x, y)
                    backgroundContext.lineTo(nextParticle.renderX, nextParticle.renderY)
                    backgroundContext.strokeStyle = `rgba(16, 136, 173, ${(1 - distance / connectionDistance) * 0.28})`
                    backgroundContext.lineWidth = 0.7
                    backgroundContext.stroke()
                }
            }
        })
    }

    const animateBackground = (time) => {
        cursor.x += (cursor.targetX - cursor.x) * 0.06
        cursor.y += (cursor.targetY - cursor.y) * 0.06
        drawBackground(time)
        animationFrame = requestAnimationFrame(animateBackground)
    }

    const handlePointerMove = (event) => {
        cursor.targetX = event.clientX
        cursor.targetY = event.clientY
    }

    cursor.x = window.innerWidth / 2
    cursor.y = window.innerHeight / 2
    cursor.targetX = cursor.x
    cursor.targetY = cursor.y
    window.addEventListener('resize', resizeCanvas, { passive: true })
    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    resizeCanvas()

    if (!reducedMotion.matches) {
        animationFrame = requestAnimationFrame(animateBackground)
    }
}

const showMenu = (toggleId, navId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId)

    if(toggle && nav){
        toggle.addEventListener('click', ()=>{
            nav.classList.toggle('show')
        })
    }
}
showMenu('nav-toggle','nav-menu')


/*==================== REMOVE MENU MOBILE ====================*/
const navLink = document.querySelectorAll('.nav__link')

function linkAction(){
    const navMenu = document.getElementById('nav-menu')
    navMenu.classList.remove('show')
}
navLink.forEach(n => n.addEventListener('click', linkAction))

const skillsSlider = document.getElementById('skillsSlider')
const skillsPrev = document.querySelector('.skills-slider-prev')
const skillsNext = document.querySelector('.skills-slider-next')
let skillsIndex = 1
let skillsRotation = 0

const updateSkillsSlider = () => {
    if (!skillsSlider) return

    const slides = Array.from(skillsSlider.querySelectorAll('.skills__card'))
    const total = slides.length
    if (total === 0) return

    const radius = 500
    const angleStep = 360 / total

    slides.forEach((slide, index) => {
        const angle = index * angleStep
        slide.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`
        slide.style.backfaceVisibility = 'hidden'
        slide.style.filter = 'none'
        slide.classList.remove('is-active', 'is-prev', 'is-next')

        const relativeIndex = ((index - skillsIndex) % total + total) % total
        const normalized = relativeIndex > total / 2 ? relativeIndex - total : relativeIndex

        if (normalized === 0) {
            slide.classList.add('is-active')
            slide.style.opacity = '1'
        } else if (normalized === 1 || normalized === - (total - 1)) {
            slide.classList.add('is-next')
            slide.style.opacity = '1'
        } else if (normalized === -1 || normalized === total - 1) {
            slide.classList.add('is-prev')
            slide.style.opacity = '1'
        } else {
            slide.style.opacity = '0.35'
        }
    })

    skillsSlider.style.transform = `translateZ(-${radius}px) rotateY(${skillsRotation}deg)`
}

if (skillsPrev && skillsNext && skillsSlider) {
    const initSkillsCarousel = () => {
        const total = skillsSlider.querySelectorAll('.skills__card').length
        if (total === 0) return
        const angleStep = 360 / total
        skillsRotation = -skillsIndex * angleStep
        updateSkillsSlider()
    }

    skillsNext.addEventListener('click', () => {
        const total = skillsSlider.querySelectorAll('.skills__card').length
        const angleStep = 360 / total
        skillsRotation -= angleStep
        skillsIndex = (skillsIndex + 1) % total
        updateSkillsSlider()
    })

    skillsPrev.addEventListener('click', () => {
        const total = skillsSlider.querySelectorAll('.skills__card').length
        const angleStep = 360 / total
        skillsRotation += angleStep
        skillsIndex = (skillsIndex - 1 + total) % total
        updateSkillsSlider()
    })

    window.addEventListener('resize', initSkillsCarousel)
    initSkillsCarousel()
    setTimeout(initSkillsCarousel, 100)
}

/*==================== SCROLL SECTIONS ACTIVE LINK ====================*/
const sections = document.querySelectorAll('section[id]')

const scrollActive = () =>{
    const scrollDown = window.scrollY

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id'),
              sectionsClass = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        
        if(sectionsClass){
            if(scrollDown > sectionTop && scrollDown <= sectionTop + sectionHeight){
                sectionsClass.classList.add('active-link')
            }else{
                sectionsClass.classList.remove('active-link')
            }
        }
    })
}
window.addEventListener('scroll', scrollActive)


/*===== SCROLL REVEAL ANIMATION =====*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 1200,
    delay: 150,
});

/* Existing animations */
sr.reveal('.home__data, .about__img, .home__subtitle');
sr.reveal('.home__img, .about__subtitle, .about__text', { delay: 300 });
sr.reveal('.home__social-icon', { interval: 150 });
sr.reveal('.project-card, .experience__card, .certifications__badge, .certifications__profile, .contact__bar', { interval: 150 });
sr.reveal('.skills-slider-container', { delay: 200 });