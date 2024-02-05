import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import Chart from 'chart.js';
import { DashboardService } from './service/dashboard.service';
import { AuthserviceService } from 'environments/airtable/authservice.service';
import { Router } from '@angular/router';
import { SharedService } from 'app/shared/service/shared.service';
import { RegularTableComponent } from 'app/tables/regulartable/regulartable.component';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  

  constructor(private sharedService: SharedService, 
    private dashboardService: DashboardService, 
    private authService: AuthserviceService, 
    private router: Router,
    private resolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef,
    public translate: TranslateService) {
      this.translate.setDefaultLang("en");
    }


  isLoading = false;
  private canvas : any;
  private ctx: any;
  chartData: Chart.ChartData;
  regularTableComponentRef: any;


  public ngOnInit() {
    
    if (this.authService.checkConnection()){
      this.isLoading = true;
      this.initializeChart();
      this.loadData();
      this.initiateRegularTableComponent();
      this.isLoading = false;
      
    }else{
      this.router.navigate(['/pages/lock']);
    } 
  
  }

  private initiateRegularTableComponent(): void {
    // Create a factory for RegularTableComponent
    const factory = this.resolver.resolveComponentFactory(RegularTableComponent);

    // Create the component
    this.regularTableComponentRef = this.viewContainerRef.createComponent(factory);

    // Access the instance of the component and call its methods
    const regularTableComponentInstance = this.regularTableComponentRef.instance;
    regularTableComponentInstance.ngOnInit(); // Manually call ngOnInit

    // Example: Manually call a method of RegularTableComponent
    regularTableComponentInstance.filterByRating(5);

    // Hide the component discreetly
    this.regularTableComponentRef.location.nativeElement.style.display = 'none';
  }

  private initializeChart(): void {
    this.canvas = document.getElementById("activeUsers");
    this.ctx = this.canvas.getContext("2d");
  }

  private async loadData(): Promise<void> {
    this.chartData = await this.dashboardService.getChartData(this.ctx);
    this.createChart();
  }

  private createChart(): void {
    new Chart(this.ctx, {
      type: 'line',
      data: this.chartData,
      options: {
        legend: {
          display: true
        },
        tooltips: {
          enabled: true,
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: "#9f9f9f",
              beginAtZero: true,
              maxTicksLimit: 10,
            },
            gridLines: {
              drawBorder: false,
              zeroLineColor: "transparent",
              color: 'rgba(255,255,255,0.05)'
            }
          }],
          dataset: [{
            barPercentage: 1.6,
            gridLines: {
              drawBorder: true,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: "transparent",
              display: true,
            },
            ticks: {
              padding: 20,
              fontColor: "#9f9f9f"
            }
          }]
        },
      }
    });
  }

  public calculateAverageStars(){ return this.dashboardService.calculateAverageStars(); }

  public counterStarsRating(nbstars: number){ return this.dashboardService.counterStarsRating(nbstars); }

  public currentYear(){ return new Date().getFullYear(); }

  public numberOfComments(){ return this.dashboardService.numberOfComments(); }

  public filterRating(rating: number){
    this.router.navigate(['/tables/all']);
    this.sharedService.sendFilterRating(rating);
    
  }

  public filterCategory(category: string) {
    this.router.navigate(['/tables/all']);
    this.sharedService.sendFilterCategory(category);
  }

  public categoryToImprove() {
    return this.dashboardService.categoryToImprove()
  }



}
