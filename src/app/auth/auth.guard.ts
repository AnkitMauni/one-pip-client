import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let router = inject(Router);

  const isLoggedIn = !!localStorage.getItem('loginId');
  const accountId = localStorage.getItem('loginId');
    
  if (!isLoggedIn || accountId === '0' || accountId === null) {
    // Clear all storage and redirect to login
    localStorage.clear();
    sessionStorage.clear();
    
    // Close any open modals or overlays
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      modal.remove();
    });
    
    // Remove modal backdrop
    const backdrops = document.querySelectorAll('.modal-backdrop');
    backdrops.forEach(backdrop => {
      backdrop.remove();
    });
    
    // Reset body classes
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }

  return true;
};
