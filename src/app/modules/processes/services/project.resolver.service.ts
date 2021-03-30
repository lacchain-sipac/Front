import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { take, mergeMap } from 'rxjs/operators';
import { IProject } from '@shared/models/common/interfaces';
import { ProjectsService } from '@modules/processes/projects.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectResolver implements Resolve<IProject> {

  constructor(
    private projectsService: ProjectsService,
    private router: Router) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> | Promise<any> | any {
    return this.projectsService.getProject(route.paramMap.get('id')).pipe(
      take(1),
      mergeMap(response => {
        if (response.status === '00000') {
          return of(response.data);
        }
        this.router.navigate(['home/processes']);
        return EMPTY;
      })
    );
  }
}
