import { Component, OnInit, AfterViewInit, AfterViewChecked, AfterContentInit } from '@angular/core';
import { AuthserviceService } from 'environments/airtable/authservice.service';

//Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    collapse?: string;
    icontype: string;
    // icon: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

//Menu Items
export const ROUTES: RouteInfo[] = [{
        path: '/dashboard',
        title: 'Your Dashboard',
        type: 'link',
        icontype: 'nc-icon nc-bank',
    },{
    path: '/advanced',
    title: 'Advanced',
    type: 'link',
    icontype: 'nc-icon nc-ruler-pencil',
    },
    {
        path: '/tables/all',
        title: 'All Details',
        type: 'link',
        collapse: 'tables',
        icontype: 'nc-icon nc-single-copy-04',
        children: [
            {path: 'all', title: 'Regular Tables', ab:'RT'},
        ]
    },{
        path: '/pages/lock',
        title: 'Logout',
        type: 'link',
        icontype: 'nc-icon nc-lock-circle-open',

    }
];

@Component({
    selector: 'sidebar-cmp',
    templateUrl: 'sidebar.component.html',
})

export class SidebarComponent {

    

    public menuItems: any[];
    public myName;
    public myProfilePicture;
    public myShop;
    public myLogo;
    public myQrCode;
    

    constructor(private authService: AuthserviceService) {
        this.myName = this.authService.myName;
        this.myProfilePicture = this.authService.myProfilePicture;
        this.myShop = this.authService.myTable;
        this.myLogo = this.authService.myLogo;
        this.myQrCode = this.authService.myQrCode;
    }
    
    isNotMobileMenu(){
        if( window.outerWidth > 991){
            return false;
        }
        return true;
    }

    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
    ngAfterViewInit(){
    }

}
