const instance = M.Tabs.init(document.querySelector('.tabs'));
const circles = [...document.querySelectorAll('.circle-place')]

circles.forEach(circle => {
    circle.addEventListener('click', e => {
        if(e.target.classList.contains('close')) return alert('Уже забронировано');

        document.querySelector('#place_number').value = e.target.dataset.place

        circles.forEach(circle => circle.classList.remove('active'))

        e.target.classList.toggle('active')
    })
})