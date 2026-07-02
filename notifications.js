import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();
  
let ptrStartY = 0;
let ptrIsPulling = false;
let ptrIsRefreshing = false;

const ptrElement = document.getElementById('pullToRefresh');
const ptrIcon = document.getElementById('ptrIcon');

if (ptrElement && ptrIcon) {
    window.addEventListener('touchstart', (e) => {
        if (window.scrollY === 0 && !ptrIsRefreshing) {
            ptrStartY = e.touches[0].clientY;
            ptrIsPulling = true;
        }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
        if (!ptrIsPulling) return;
        const currentY = e.touches[0].clientY;
        const pullDistance = currentY - ptrStartY;

        if (pullDistance > 0) {
            const moveY = Math.min(pullDistance * 0.5, 150);
            ptrElement.style.top = (moveY - 80) + 'px';
            ptrIcon.style.transform = `rotate(${moveY * 2}deg)`;

            if (moveY > 60) {
                ptrIcon.classList.replace('fa-arrow-down', 'fa-arrow-rotate-right');
                document.querySelector('.ptr-box').style.transform = "scale(1.1)";
            } else {
                ptrIcon.classList.replace('fa-arrow-rotate-right', 'fa-arrow-down');
                document.querySelector('.ptr-box').style.transform = "scale(0.8)";
            }
        }
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        if (!ptrIsPulling) return;
        ptrIsPulling = false;
        const currentTop = parseFloat(getComputedStyle(ptrElement).top);

        if (currentTop > -20) {
            startPtrRefresh();
        } else {
            resetPtrPosition();
        }
    });
}

function startPtrRefresh() {
    ptrIsRefreshing = true;
    ptrElement.style.top = '20px';
    ptrElement.classList.add('ptr-loading');
    if (navigator.vibrate) navigator.vibrate(50);
    setTimeout(() => {
        location.reload();
    }, 800);
}

function resetPtrPosition() {
    ptrElement.style.top = '-80px';
    const box = document.querySelector('.ptr-box');
    if (box) box.style.transform = "scale(0.8)";
    setTimeout(() => {
        ptrIcon.style.transform = 'rotate(0deg)';
        ptrIcon.classList.replace('fa-arrow-rotate-right', 'fa-arrow-down');
        ptrElement.classList.remove('ptr-loading');
    }, 300);
}
