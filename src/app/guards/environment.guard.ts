import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { EnvironmentSelectionService } from '../services/environment-selection.service';

export const environmentGuard = () => {
  const environmentService = inject(EnvironmentSelectionService);
  const router = inject(Router);

  if (!environmentService.hasEnvironmentSelected()) {
    router.navigate(['/environment-selection']);
    return false;
  }
  return true;
}; 