/*===== MENU SHOW =====*/ 
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

/*==================== PROJECT SLIDER ====================*/
const projectSlider = document.getElementById('projectSlider')
const projectPrev = document.querySelector('.project-slider-prev')
const projectNext = document.querySelector('.project-slider-next')
let projectIndex = 0

const updateProjectSlider = () => {
    if (!projectSlider) return
    const slides = Array.from(projectSlider.querySelectorAll('.project-card'))
    const total = slides.length
    projectIndex = (projectIndex + total) % total

    if (slides.length === 0) return

    const slideWidth = slides[0].getBoundingClientRect().width
    const sliderStyle = window.getComputedStyle(projectSlider)
    const gap = parseFloat(sliderStyle.gap) || 0
    const x = projectIndex * (slideWidth + gap)

    projectSlider.scrollTo({ left: x, behavior: 'smooth' })
}

if (projectPrev && projectNext && projectSlider) {
    projectPrev.addEventListener('click', () => {
        projectIndex -= 1
        updateProjectSlider()
    })

    projectNext.addEventListener('click', () => {
        projectIndex += 1
        updateProjectSlider()
    })
    updateProjectSlider()
}

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

    const cardWidth = slides[0].offsetWidth
    const radius = 500
    const angleStep = 360 / total
    const rotation = skillsRotation || -skillsIndex * angleStep

    slides.forEach((slide, index) => {
        const angle = index * angleStep
        slide.style.transform = `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${radius}px)`
        slide.style.backfaceVisibility = 'hidden'
        slide.classList.remove('is-active', 'is-prev', 'is-next')

        const relativeIndex = ((index - skillsIndex) % total + total) % total
        const normalized = relativeIndex > total / 2 ? relativeIndex - total : relativeIndex

        if (normalized === 0) {
            slide.classList.add('is-active')
        } else if (normalized === 1 || normalized === - (total - 1)) {
            slide.classList.add('is-next')
        } else if (normalized === -1 || normalized === total - 1) {
            slide.classList.add('is-prev')
        }
    })

    skillsSlider.style.transform = `translateZ(-${radius}px) rotateY(${rotation}deg)`
}

if (skillsPrev && skillsNext && skillsSlider) {
    skillsPrev.addEventListener('click', () => {
        const total = skillsSlider.querySelectorAll('.skills__card').length
        skillsRotation -= 360 / total
        skillsIndex = (skillsIndex + 1) % total
        updateSkillsSlider()
    })

    skillsNext.addEventListener('click', () => {
        const total = skillsSlider.querySelectorAll('.skills__card').length
        skillsRotation -= 360 / total
        skillsIndex = (skillsIndex + 1) % total
        updateSkillsSlider()
    })

    window.addEventListener('resize', updateSkillsSlider)
    updateSkillsSlider()
    setTimeout(updateSkillsSlider, 100)
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
sr.reveal('.home__data, .about__img, .skills__subtitle, .skills__text'); 
sr.reveal('.home__img, .about__subtitle, .about__text, .skills__img',{delay: 300}); 
sr.reveal('.home__social-icon',{ interval: 150}); 
sr.reveal('.skills__data, .contact__input',{interval: 150});