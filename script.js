/* =========================================
   BARBERFLOW — PAINEL ADMINISTRATIVO
   Arquivo: script.js
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // =========================================
    // 1. ELEMENTOS DO HTML
    // =========================================

    const body = document.body;
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const mobileMenu = document.getElementById("mobileMenu");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const navItems = document.querySelectorAll(".nav-item");
    const profileButton = document.querySelector(".profile-menu");
    const logoutButton = document.querySelector(".logout-button");

    const MOBILE_BREAKPOINT = 900;
    const STORAGE_KEY = "barberFlowSidebarCollapsed";

    if (!sidebar) {
        console.error("BarberFlow: sidebar não encontrada no HTML.");
        return;
    }

    // =========================================
    // 2. VERIFICAR O TAMANHO DA TELA
    // =========================================

    function isMobile() {
        return window.innerWidth <= MOBILE_BREAKPOINT;
    }

    // =========================================
    // 3. RECOLHER E EXPANDIR A SIDEBAR
    // =========================================

    function setCollapsed(collapsed) {
        if (isMobile()) {
            body.classList.remove("sidebar-collapsed");
            return;
        }

        body.classList.toggle("sidebar-collapsed", collapsed);

        if (sidebarToggle) {
            const label = collapsed
                ? "Expandir menu"
                : "Recolher menu";

            sidebarToggle.setAttribute("aria-label", label);
            sidebarToggle.setAttribute("title", label);
            sidebarToggle.setAttribute(
                "aria-expanded",
                String(!collapsed)
            );
        }

        // Salva a preferência do usuário no navegador.
        try {
            localStorage.setItem(
                STORAGE_KEY,
                String(collapsed)
            );
        } catch (error) {
            console.warn(
                "Não foi possível salvar a preferência da sidebar."
            );
        }
    }

    // Recupera o estado salvo ao abrir a página.
    let sidebarWasCollapsed = false;

    try {
        sidebarWasCollapsed =
            localStorage.getItem(STORAGE_KEY) === "true";
    } catch (error) {
        sidebarWasCollapsed = false;
    }

    setCollapsed(sidebarWasCollapsed);

    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", () => {
            if (isMobile()) {
                closeMobileSidebar();
                return;
            }

            const collapsed =
                body.classList.contains("sidebar-collapsed");

            setCollapsed(!collapsed);
        });
    }

    // =========================================
    // 4. MENU MOBILE
    // =========================================

    function openMobileSidebar() {
        if (!isMobile()) return;

        body.classList.add("mobile-sidebar-open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.add("is-visible");
        }

        if (mobileMenu) {
            mobileMenu.setAttribute("aria-expanded", "true");
            mobileMenu.setAttribute("aria-label", "Fechar menu");
        }
    }

    function closeMobileSidebar() {
        body.classList.remove("mobile-sidebar-open");

        if (sidebarOverlay) {
            sidebarOverlay.classList.remove("is-visible");
        }

        if (mobileMenu) {
            mobileMenu.setAttribute("aria-expanded", "false");
            mobileMenu.setAttribute("aria-label", "Abrir menu");
        }
    }

    if (mobileMenu) {
        mobileMenu.setAttribute("aria-expanded", "false");

        mobileMenu.addEventListener("click", () => {
            const isOpen =
                body.classList.contains("mobile-sidebar-open");

            if (isOpen) {
                closeMobileSidebar();
            } else {
                openMobileSidebar();
            }
        });
    }

    // Fecha ao clicar no fundo escuro.
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener(
            "click",
            closeMobileSidebar
        );
    }

    // Fecha o menu quando o usuário pressiona ESC.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileSidebar();
            closeProfileMenu();
            closeLogoutDialog();
        }
    });

    // Ajusta o menu quando a tela muda de tamanho.
    window.addEventListener("resize", () => {
        if (isMobile()) {
            body.classList.remove("sidebar-collapsed");
        } else {
            closeMobileSidebar();

            try {
                body.classList.toggle(
                    "sidebar-collapsed",
                    localStorage.getItem(STORAGE_KEY) === "true"
                );
            } catch (error) {
                body.classList.remove("sidebar-collapsed");
            }
        }
    });

    // =========================================
    // 5. NAVEGAÇÃO E ITEM ATIVO
    // =========================================

    navItems.forEach((item) => {
        const link = item.querySelector(".nav-link");

        if (!link) return;

        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            // Impede o salto para o topo enquanto o link
            // ainda estiver configurado como "#".
            if (!href || href === "#") {
                event.preventDefault();
            }

            // Remove o estado ativo dos outros itens.
            navItems.forEach((navItem) => {
                navItem.classList.remove("active");

                const navLink =
                    navItem.querySelector(".nav-link");

                if (navLink) {
                    navLink.removeAttribute("aria-current");
                }
            });

            // Ativa o item clicado.
            item.classList.add("active");
            link.setAttribute("aria-current", "page");

            // Atualiza o título da página demonstrativa.
            const navText = link.querySelector(".nav-text");
            const pageTitle =
                document.querySelector(".main-header h1");

            if (navText && pageTitle) {
                pageTitle.textContent =
                    navText.textContent.trim();
            }

            // Fecha o menu depois da seleção no celular.
            if (isMobile()) {
                closeMobileSidebar();
            }
        });
    });

    // Mantém o Dashboard selecionado inicialmente.
    const initialActiveLink = document.querySelector(
        ".nav-item.active .nav-link"
    );

    if (initialActiveLink) {
        initialActiveLink.setAttribute("aria-current", "page");
    }

    // =========================================
    // 6. AVISOS TEMPORÁRIOS
    // =========================================

    function showNotice(message) {
        let notice = document.getElementById("barberFlowNotice");

        if (!notice) {
            notice = document.createElement("div");
            notice.id = "barberFlowNotice";
            notice.setAttribute("role", "status");

            notice.style.cssText = `
                position: fixed;
                right: 20px;
                bottom: 20px;
                z-index: 1300;
                max-width: calc(100vw - 40px);
                padding: 14px 18px;
                border-radius: 12px;
                background: #111827;
                color: #ffffff;
                box-shadow: 0 8px 28px rgba(0, 0, 0, 0.18);
                font-family: Inter, sans-serif;
                font-size: 13px;
                line-height: 1.5;
            `;

            document.body.appendChild(notice);
        }

        notice.textContent = message;
        notice.hidden = false;
    }

    // =========================================
    // 7. MENU DE OPÇÕES DO PERFIL
    // =========================================

    let profilePopover = null;

    function closeProfileMenu() {
        if (profilePopover) {
            profilePopover.hidden = true;
        }

        if (profileButton) {
            profileButton.setAttribute("aria-expanded", "false");
        }
    }

    if (profileButton) {
        profileButton.setAttribute("aria-haspopup", "true");
        profileButton.setAttribute("aria-expanded", "false");

        // Cria o menu sem precisar alterar o HTML.
        profilePopover = document.createElement("div");
        profilePopover.className = "profile-popover";
        profilePopover.hidden = true;

        profilePopover.innerHTML = `
            <button type="button" data-profile-action="account">
                <i class="fa-regular fa-user" aria-hidden="true"></i>
                Meu perfil
            </button>

            <button type="button" data-profile-action="settings">
                <i class="fa-solid fa-gear" aria-hidden="true"></i>
                Configurações
            </button>
        `;

        document.body.appendChild(profilePopover);

        profileButton.addEventListener("click", (event) => {
            event.stopPropagation();

            const shouldOpen = profilePopover.hidden;

            closeProfileMenu();

            if (!shouldOpen) return;

            const rect = profileButton.getBoundingClientRect();
            const menuWidth = 190;

            const left = Math.max(
                12,
                Math.min(
                    rect.right - menuWidth,
                    window.innerWidth - menuWidth - 12
                )
            );

            const top = Math.min(
                rect.bottom + 8,
                window.innerHeight - 120
            );

            profilePopover.style.left = `${left}px`;
            profilePopover.style.top = `${top}px`;

            profilePopover.hidden = false;
            profileButton.setAttribute("aria-expanded", "true");
        });

        profilePopover.addEventListener("click", (event) => {
            const button = event.target.closest(
                "[data-profile-action]"
            );

            if (!button) return;

            const action = button.dataset.profileAction;

            if (action === "account") {
                showNotice(
                    "A página Meu perfil ainda precisa ser conectada."
                );
            }

            if (action === "settings") {
                showNotice(
                    "A página Configurações ainda precisa ser conectada."
                );
            }

            closeProfileMenu();
        });

        // Fecha o menu ao clicar fora dele.
        document.addEventListener("click", (event) => {
            if (
                profilePopover &&
                !profilePopover.hidden &&
                !profilePopover.contains(event.target) &&
                !profileButton.contains(event.target)
            ) {
                closeProfileMenu();
            }
        });
    }

    // =========================================
    // 8. CONFIRMAÇÃO DO BOTÃO SAIR
    // =========================================

    let logoutDialog = null;

    function closeLogoutDialog() {
        if (logoutDialog) {
            logoutDialog.hidden = true;
        }
    }

    if (logoutButton) {
        logoutDialog = document.createElement("div");
        logoutDialog.className = "logout-dialog";
        logoutDialog.hidden = true;

        logoutDialog.innerHTML = `
            <section
                class="logout-card"
                role="dialog"
                aria-modal="true"
                aria-labelledby="logoutTitle"
                aria-describedby="logoutDescription"
            >
                <h2 id="logoutTitle">
                    Deseja sair do painel?
                </h2>

                <p id="logoutDescription">
                    Você poderá entrar novamente quando quiser.
                    Confirme para continuar.
                </p>

                <div class="logout-actions">
                    <button
                        class="logout-cancel"
                        type="button"
                    >
                        Cancelar
                    </button>

                    <button
                        class="logout-confirm"
                        type="button"
                    >
                        Confirmar saída
                    </button>
                </div>
            </section>
        `;

        document.body.appendChild(logoutDialog);

        const cancelButton =
            logoutDialog.querySelector(".logout-cancel");

        const confirmButton =
            logoutDialog.querySelector(".logout-confirm");

        // Abre a confirmação.
        logoutButton.addEventListener("click", () => {
            closeProfileMenu();

            logoutDialog.hidden = false;
            cancelButton.focus();
        });

        // Cancela a saída.
        cancelButton.addEventListener(
            "click",
            closeLogoutDialog
        );

        // Fecha ao clicar fora da caixa.
        logoutDialog.addEventListener("click", (event) => {
            if (event.target === logoutDialog) {
                closeLogoutDialog();
            }
        });

        // A saída real será integrada ao login.
        confirmButton.addEventListener("click", () => {
            closeLogoutDialog();

            showNotice(
                "A saída real precisa ser conectada ao sistema de login."
            );
        });
    }

    // =========================================
    // 9. INICIALIZAÇÃO
    // =========================================

    closeMobileSidebar();

    console.log(
        "BarberFlow iniciado. Sidebar e navegação carregadas."
    );
});