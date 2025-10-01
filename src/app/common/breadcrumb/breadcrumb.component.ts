import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {BreadCrumbsAndUrls} from '../../utils/BreadCrumb';
import {OnBoardingService} from '../../services/OnBoarding/on-boarding.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.sass']
})
export class BreadcrumbComponent implements OnInit {
  route: ActivatedRoute;
  breadcrumbsAndUrls = Array<BreadCrumbsAndUrls>();
  breadcrumbString = '';
  static setUrlToBreadCrumb(breadcrumbs) {
    let url = '';
    for (const breadcrumb of breadcrumbs) {
      if (breadcrumb.breadcrumb) {
        url += breadcrumb.breadcrumb.toLowerCase().split(' - ')[0] + '/';
        if (breadcrumb.breadcrumb.split(' - ')[1]) {
          url += breadcrumb.breadcrumb.split(' - ')[1] + '/';
        }
        breadcrumb.url = url.replace(' ', '-');
      }
    }
  }

  constructor(private activatedRoute: ActivatedRoute, public router: Router,
              private onboardingService: OnBoardingService) { }

  ngOnInit() {
    this.buildBreadCrumb();
  }

  /**
   * Build the breadcrumb of current page.
   * Compose of all the previous pages and the current one.
   * In form of links.
   */
  buildBreadCrumb() {
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.breadcrumbsAndUrls = [];
        let breadcrumb = new BreadCrumbsAndUrls();
        if (this.activatedRoute.root.children.length > 0) {
          this.route = this.lastChildRoute();
          this.route.data.subscribe(
            data => {
              if (data.breadcrumb) {
                this.breadcrumbString = data.breadcrumb;
                if (data.breadcrumb2) {
                  this.breadcrumbString += data.breadcrumb2;
                }
                if (this.route.snapshot.data['rsc']) {
                  let resource;
                  if (this.route.snapshot.data['rsc'].onboardee) {
                    resource = this.route.snapshot.data['rsc'].onboardee;
                  } else {
                    resource = this.route.snapshot.data['rsc'];
                  }
                  this.breadcrumbString += `${resource.firstName} ${resource.lastName}`;
                }
                if (this.breadcrumbString.includes('{') && this.breadcrumbString.includes('}')) {
                  const params = this.breadcrumbString.match(/[^{\}]+(?=})/g);
                  for (const param of params) {
                    this.breadcrumbString = this.breadcrumbString.replace(`{${param}}`,
                      encodeURIComponent(this.route.snapshot.queryParams[param]));
                  }
                }
                for (const string of this.breadcrumbString.split('/')) {
                  breadcrumb = new BreadCrumbsAndUrls();
                  breadcrumb.breadcrumb = decodeURIComponent(string);
                  this.breadcrumbsAndUrls.push(breadcrumb);
                }


              }
            }
          );
        }
        BreadcrumbComponent.setUrlToBreadCrumb(this.breadcrumbsAndUrls);
      }
    });
  }

  /**
   * get the last child in the activated route.
   */
  lastChildRoute(): ActivatedRoute {
    let lastChildRoute = this.activatedRoute.root;
    while (lastChildRoute.children.length > 0) {
      lastChildRoute = lastChildRoute.children[0];
    }
    return lastChildRoute;
  }
}
