import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Breadcrumb } from '../Models/breadcrumb.model';
import { TranslateService } from '@ngx-translate/core';


@Injectable({
    providedIn: 'root'
})
export class BreadcrumbService {

    lang = localStorage.getItem("lang");
    private breadcrumbs: Breadcrumb[] = [];
    private breadcrumbSubject: BehaviorSubject<Breadcrumb[]> = new BehaviorSubject<Breadcrumb[]>(this.breadcrumbs);

    constructor(private translate: TranslateService, private activateRoute: ActivatedRoute) { }

    get breadcrumbs$(): Observable<Breadcrumb[]> {
        return this.breadcrumbSubject.asObservable();
    }

    setBreadcrumbs(newBreadcrumbs: Breadcrumb[]) {
        this.breadcrumbs = newBreadcrumbs;
        this.breadcrumbSubject.next(this.breadcrumbs);
    }
    addBreadcrumb(route: ActivatedRouteSnapshot, parentUrl: string[], translationKeys: string[]) {
        const breadcrumbs: Breadcrumb[] = [];

        if (translationKeys.length > 0) {
            for (const translationKey of translationKeys) {
                this.translate.get(translationKey).subscribe((translatedLabel: string) => {
                    if (translatedLabel) {
                        const breadcrumb: Breadcrumb = {
                            label: translatedLabel,
                            url: this.createBreadcrumbUrl(route, parentUrl)
                        };
                        breadcrumbs.push(breadcrumb);
                        this.breadcrumbSubject.next([...breadcrumbs]); // Broadcast the updated breadcrumbs
                    }
                });
            }
        }

    }

    private createBreadcrumbUrl(route: ActivatedRouteSnapshot, parentUrl: string[]): string {
        const urlSegments: string[] = route.pathFromRoot
            .filter((snapshot: ActivatedRouteSnapshot) => snapshot.url.length > 0)
            .reduce((acc: string[], snapshot: ActivatedRouteSnapshot) => acc.concat(snapshot.url.map(urlSegment => urlSegment.path)), []);

        const url = `/${parentUrl.concat(urlSegments).join('/')}`;
        return url;
    }



    getParentUrlSegments(): string[] {
        const urlSegments: string[] = this.activateRoute.snapshot.pathFromRoot
            .filter((snapshot: ActivatedRouteSnapshot) => snapshot.url.length > 0)
            .reduce((acc: string[], snapshot: ActivatedRouteSnapshot) => acc.concat(snapshot.url.map(urlSegment => urlSegment.path)), []);

        return urlSegments;
    }
}
