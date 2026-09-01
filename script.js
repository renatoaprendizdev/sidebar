/* =========================================================
BARBERFLOW
SCRIPT.JS
SIDEBAR ADMINISTRATIVO
========================================================= */

document.addEventListener("DOMContentLoaded", () => {


/* =====================================================
   ELEMENTOS
   ===================================================== */

const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const mobileMenu = document.getElementById("mobileMenu");
const sidebarOverlay = document.getElementById("sidebarOverlay");

const navItems = document.querySelectorAll(".nav-item");
const navLinks = document.querySelectorAll(".nav-link");

const logoutButton = document.querySelector(".logout-button");
const profileMenu = document.querySelector(".profile-menu");


/* =====================================================
   VERIFICAÇÃO
   ===================================================== */

if (!sidebar) {
    console.error("Sidebar não encontrado.");
    return;
}


/* =====================================================
   DETECTAR MOBILE
   ===================================================== */

const isMobile = () => {
    return window.innerWidth <= 700;
};


/* =====================================================
   ESTADO SALVO DO SIDEBAR
   ===================================================== */

const sidebarCollapsed =
    localStorage.getItem("barberflow-sidebar-collapsed");

if (
    sidebarCollapsed === "true" &&
    !isMobile()
) {
    sidebar.classList.add("collapsed");
}


/* =====================================================
   RECOLHER / EXPANDIR SIDEBAR
   ===================================================== */

if (sidebarToggle) {

    sidebarToggle.addEventListener("click", () => {

        if (isMobile()) {
            return;
        }

        sidebar.classList.toggle("collapsed");

        const isCollapsed =
            sidebar.classList.contains("collapsed");

        localStorage.setItem(
            "barberflow-sidebar-collapsed",
            isCollapsed
        );

        updateToggleLabel();

    });

}


/* =====================================================
   ATUALIZAR LABEL DO BOTÃO
   ===================================================== */

function updateToggleLabel() {

    if (!sidebarToggle) {
        return;
    }

    const isCollapsed =
        sidebar.classList.contains("collapsed");

    if (isCollapsed) {

        sidebarToggle.setAttribute(
            "aria-label",
            "Expandir menu"
        );

        sidebarToggle.setAttribute(
            "title",
            "Expandir menu"
        );

    } else {

        sidebarToggle.setAttribute(
            "aria-label",
            "Recolher menu"
        );

        sidebarToggle.setAttribute(
            "title",
            "Recolher menu"
        );

    }

}


/* =====================================================
   ABRIR MENU MOBILE
   ===================================================== */

if (mobileMenu) {

    mobileMenu.addEventListener("click", () => {

        sidebar.classList.add("mobile-open");

        sidebarOverlay.classList.add("active");

        document.body.style.overflow = "hidden";

    });

}


/* =====================================================
   FECHAR MENU MOBILE
   ===================================================== */

function closeMobileSidebar() {

    sidebar.classList.remove("mobile-open");

    sidebarOverlay.classList.remove("active");

    document.body.style.overflow = "";

}


/* =====================================================
   OVERLAY
   ===================================================== */

if (sidebarOverlay) {

    sidebarOverlay.addEventListener(
        "click",
        closeMobileSidebar
    );

}


/* =====================================================
   LINKS DO MENU
   ===================================================== */

navLinks.forEach((link, index) => {

    link.addEventListener("click", (event) => {

        /*
         * Como este é um template de demonstração,
         * impedimos o carregamento do "#".
         *
         * Quando forem criadas páginas reais,
         * basta colocar o endereço no href.
         */

        if (link.getAttribute("href") === "#") {
            event.preventDefault();
        }


        /* ---------------------------------------------
           REMOVER ITEM ATIVO
        --------------------------------------------- */

        navItems.forEach(item => {
            item.classList.remove("active");
        });


        /* ---------------------------------------------
           ATIVAR ITEM CLICADO
        --------------------------------------------- */

        const currentItem =
            link.closest(".nav-item");

        if (currentItem) {
            currentItem.classList.add("active");
        }


        /* ---------------------------------------------
           FECHAR SIDEBAR NO CELULAR
        --------------------------------------------- */

        if (isMobile()) {
            closeMobileSidebar();
        }

    });

});


/* =====================================================
   MENU DO PERFIL
   ===================================================== */

if (profileMenu) {

    profileMenu.addEventListener("click", () => {

        console.log(
            "Menu de opções do perfil."
        );

        /*
         * Futuramente podemos abrir aqui:
         *
         * - Meu perfil
         * - Alterar senha
         * - Preferências
         * - Sair
         */

    });

}


/* =====================================================
   BOTÃO SAIR
   ===================================================== */

if (logoutButton) {

    logoutButton.addEventListener("click", () => {

        const confirmLogout = confirm(
            "Deseja realmente sair do sistema?"
        );

        if (!confirmLogout) {
            return;
        }


        /*
         * Aqui podemos futuramente:
         *
         * - limpar sessão
         * - remover localStorage
         * - redirecionar para login
         */

        localStorage.removeItem(
            "barberflow-sidebar-collapsed"
        );


        alert(
            "Sessão encerrada com sucesso!"
        );


        /*
         * Exemplo de redirecionamento:
         *
         * window.location.href = "login.html";
         */

    });

}


/* =====================================================
   FECHAR SIDEBAR COM ESC
   ===================================================== */

document.addEventListener("keydown", (event) => {

    if (event.key === "Escape") {

        if (isMobile()) {
            closeMobileSidebar();
        }

    }

});


/* =====================================================
   AJUSTAR AO REDIMENSIONAR A TELA
   ===================================================== */

let previousMobileState = isMobile();

window.addEventListener("resize", () => {

    const currentMobileState = isMobile();


    /* ---------------------------------------------
       Mudou de desktop para mobile
    --------------------------------------------- */

    if (
        !previousMobileState &&
        currentMobileState
    ) {

        sidebar.classList.remove("mobile-open");

        sidebarOverlay.classList.remove("active");

        document.body.style.overflow = "";

    }


    /* ---------------------------------------------
       Mudou de mobile para desktop
    --------------------------------------------- */

    if (
        previousMobileState &&
        !currentMobileState
    ) {

        sidebar.classList.remove("mobile-open");

        sidebarOverlay.classList.remove("active");

        document.body.style.overflow = "";

        const savedState =
            localStorage.getItem(
                "barberflow-sidebar-collapsed"
            );

        if (savedState === "true") {
            sidebar.classList.add("collapsed");
        }

    }


    previousMobileState = currentMobileState;

});


/* =====================================================
   INICIALIZAÇÃO
   ===================================================== */

updateToggleLabel();


/* =====================================================
   ANIMAÇÃO INICIAL DOS ITENS
   ===================================================== */

navItems.forEach((item, index) => {

    item.style.opacity = "0";
    item.style.transform = "translateX(-8px)";

    setTimeout(() => {

        item.style.transition =
            "opacity 0.35s ease, transform 0.35s ease";

        item.style.opacity = "1";
        item.style.transform = "translateX(0)";

    }, 80 + (index * 35));

});


});
