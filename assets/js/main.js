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