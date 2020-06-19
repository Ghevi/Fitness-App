import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Store } from '@ngrx/store';

import * as fromRoot from '../app.reducer'
import { take } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(// private authService: AuthService,
              private store: Store<fromRoot.State>,
              private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));

    // if (this.authService.isAuth()) {
    //   return true;
    // } else {
    //   return this.router.createUrlTree(['/login']);
    // }
  }

  canLoad(route: Route) {
    return this.store.select(fromRoot.getIsAuth).pipe(take(1));

    // if (this.authService.isAuth()) {
    //   return true;
    // } else {
    //   return this.router.navigate(['/login']); // don't use createUrlTree here
    // }
  }
}
