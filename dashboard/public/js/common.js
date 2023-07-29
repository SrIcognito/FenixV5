// ScrollTop
const BodyType = document.body || document.documentElement

function ScrollUp() {
    BodyType.scrollTo({ top: 0, behavior: 'smooth' });
}

BodyType.addEventListener('scroll', () => {
    const scrollTop = document.getElementById('scroll-top');
    const max = 550

    if (BodyType.scrollTop >= max) scrollTop.classList.add('show-scroll'); else scrollTop.classList.remove('show-scroll')
})

// NewPage 
function newPage(Link) {
    window.open(Link, 'popUpWindow', 'height=800,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
}

// Numbers
function formatNumber(Number) {
    if (Number < 1e3) return Number;
    if (Number >= 1e3 && Number < 1e6) return +(Number / 1e3).toFixed(1) + "K";
    if (Number >= 1e6 && Number < 1e9) return +(Number / 1e6).toFixed(1) + "M";
    if (Number >= 1e9 && Number < 1e12) return +(Number / 1e9).toFixed(1) + "B";
    if (Number >= 1e12) return +(Number / 1e12).toFixed(1) + "T";
};

// Statistics
if (document.getElementById("Channel")) document.getElementById("Channel").innerHTML = formatNumber(document.getElementById("Channel").innerHTML)
if (document.getElementById("Server")) document.getElementById("Server").innerHTML = formatNumber(document.getElementById("Server").innerHTML)
if (document.getElementById("User")) document.getElementById("User").innerHTML = formatNumber(document.getElementById("User").innerHTML)


const accordionItems = document.querySelectorAll('.accordion__item')
accordionItems.forEach((item) => {
    const accordionHeader = item.querySelector('.accordion__header')
    accordionHeader.addEventListener('click', () => {
        const openItem = document.querySelector('.accordion-open')
        toggleItem(item)
        if (openItem && openItem !== item) { toggleItem(openItem) }
    })
})
const toggleItem = (item) => {
    const accordionContent = item.querySelector('.accordion__content')
    if (item.classList.contains('accordion-open')) {
        accordionContent.removeAttribute('style')
        item.classList.remove('accordion-open')
    } else {
        accordionContent.style.height = accordionContent.scrollHeight + 'px'
        item.classList.add('accordion-open')
    }
}

// Servers
function search(query) {
    var servers = JSON.parse(document.getElementById("servers").value);
    servers.forEach(server => {
        document.getElementById(server.id).removeAttribute("hidden");
    })
    servers = servers.filter(obj => !obj.name.toLowerCase().includes(query.toLowerCase()));
    servers.forEach(server => {
        document.getElementById(server.id).setAttribute("hidden", "");
    })
}

// LoadEvent
window.addEventListener("load", () => {
    // PreLoad
    setTimeout(function () { document.getElementById('Preloader').classList.add("hide"); document.getElementById('Content').classList.remove("hide"); document.getElementById('Content').className = 'animate__fadeOut' }, 2000);

    // TippyLoad
    tippy('#Partner', {
        content: 'Socio de RedFenix.',
    });
    tippy('#DiscordBot', {
        content: 'Bot de Discord.',
    });
    tippy('#Comunity', {
        content: 'Comunidad.',
    });
    tippy('#DiscordServer', {
        content: 'Servidor de Discord.',
    });
    tippy('#DiscordBotList', {
        content: 'Lista de Bots de Discord.',
    });
    tippy('#LearningSite', {
        content: 'Sitio de Aprendizaje.',
    });

    // StyleLoad
    if (window.location.pathname == '/commands') document.getElementById("Style").setAttribute("href", "/styles/commands.css");
    if (window.location.pathname == '/faq') document.getElementById("Style").setAttribute("href", "/styles/docs.css");
    if (window.location.pathname == '/dashboard') document.getElementById("dash").classList.add("hide"); else document.getElementById("dash").classList.remove("hide"); 
});

// Modal
document.addEventListener("DOMContentLoaded", function (event) {
    document.querySelector("#myBtn").addEventListener("click", (event) => {
        document.getElementById("myModal").style.display = "block";
        document.querySelector(".modal-box").classList.toggle("show-modal");
    });
    document.querySelector(".fa-times").addEventListener("click", (event) => {
        resetForm()
        document.getElementById("myModal").style.display = "none";
        document.querySelector(".modal-box").classList.toggle("show-modal");
    });
});

// Premium
window.onclick = function (event) {
    if (event.target == document.getElementById("myModal")) {
        resetForm()
        document.getElementById("myModal").style.display = "none";
        document.querySelector(".modal-box").classList.toggle("show-modal");
    }
}

function resetForm() {
    const form = document.querySelector("form");
    const eField = form.querySelector(".code");
    const eButton = form.querySelector(".submit");
    const successTxt = eField.querySelector(".success-txt");
    const errorTxt = eField.querySelector(".error-txt");
    const eInput = eField.querySelector("input");


    eField.classList.remove("error");
    eField.classList.remove("isvalid");
    eField.classList.add("valid");
    successTxt.innerHTML = ''
    errorTxt.innerHTML = ''
    eInput.value = ''
    eButton.disabled = false;
}

function PremiumError(error) {
    const form = document.querySelector("form");
    const eField = form.querySelector(".code");
    const errorTxt = eField.querySelector(".error-txt");

    eField.classList.remove("valid");
    eField.classList.remove("isvalid");
    eField.classList.add("error");

    errorTxt.innerHTML = error.status === 422 ? "No se pudo procesar y verificar el codigo" : error.responseJSON.message
}

function PremiumSuccess(response) {
    const form = document.querySelector("form");
    const eField = form.querySelector(".code");
    const successTxt = eField.querySelector(".success-txt");

    successTxt.innerHTML = response.message
    eField.classList.remove("error");
    eField.classList.add("isvalid");
}

document.querySelector(".submit").addEventListener("click", (e) => {
    e.preventDefault();
    const form = document.querySelector("form");
    const eField = form.querySelector(".code");
    const eButton = form.querySelector(".submit");
    const eInput = eField.querySelector("input");

    eButton.disabled = true;

    $.ajax({
        method: form.method,
        url: form.action,
        dataType: 'json',
        data: {
            code: eInput.value
        },
        success: function (response) {
            resetForm()
            PremiumSuccess(response);
            setTimeout(() => {
                resetForm()
                document.getElementById("myModal").style.display = "none";
                document.querySelector(".modal-box").classList.toggle("show-modal");
            }, 2500)
        },
        error: function (jqXHR, textStatus, errorThrown) {
            resetForm()
            PremiumError(jqXHR)
        }
    });
});
