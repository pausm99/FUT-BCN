import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, of, switchMap } from 'rxjs';
import { EventService } from '../../services/event/event.service';

export const EventGuard: CanActivateFn = (route, state) => {

  const eventService = inject(EventService);
  const router = inject(Router);
  const id: string = route.params['id'];

  if (isNaN(Number(id))) {
    router.navigate(['/not-found']);
    return false;
  }

  return eventService.getEventById(Number(id)).pipe(
    switchMap((event) => {

        if (event) {
          eventService.activeEvent.set(event);
          return of(true);
        }
        else {
          router.navigate(['/home']);
          return of(false);
        }
    }),
    catchError((error) => {
      router.navigate(['/not-found']);
      return of(false);
    })
  );
};
