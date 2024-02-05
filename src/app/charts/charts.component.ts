import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Chart from 'chart.js';
import { AirtableService } from 'environments/airtable/airtable.service';
import { AuthserviceService } from 'environments/airtable/authservice.service';
import { ChartService } from './service/chart.service';

interface USERS {
  rating: number;
  category: string;
  comment: string;
  date: string;
}

@Component({
    selector: 'charts-cmp',
    templateUrl: './charts.component.html'
})



export class ChartsComponent implements OnInit{
  public absoluteNumber: number;
  public percentage: number;
  public isPositive: boolean;
  public isNegative: boolean;
  public gradientStroke;
  public chartColor = "#FFFFFF";
  public canvas : any;
  public ctx;
  public gradientFill;
  public gradientChartOptionsConfiguration: any;
  public gradientChartOptionsConfigurationWithNumbersAndGrid: any;
  public chartBar: any;
  public chartLine: any;
  private Users: USERS[] = [];
  private now = new Date();
  now1 = new Date(this.now.getFullYear()+"-01-02");
  now2 = new Date(this.now.getFullYear()+"-06-30");
  now3 = new Date(this.now.getFullYear()+"-07-01");
  now4 = new Date(this.now.getFullYear()+"-12-31");
  
  constructor(private airtableService: AirtableService, private authService: AuthserviceService, private router: Router, private chartService: ChartService) {}

  ngOnInit(){

    if (this.authService.checkConnection()){
      this.airtableService.getRecords().then((records) => {
        this.Users = records;
        
        this.initialisation();
      });
    }else{
      this.router.navigate(['/pages/lock']);
    }
    
      
  }

  //------------------------------------- Set Charts --------------------------------------


  private setupGradient(){
    this.gradientStroke = this.ctx.createLinearGradient(0, 10, 0, 75);
    this.gradientStroke.addColorStop(0, '#6bd098');
    this.gradientStroke.addColorStop(1, this.chartColor);

    this.gradientFill = this.ctx.createLinearGradient(0, 10, 0, 75);
    this.gradientFill.addColorStop(0, '#f17e5d');
    this.gradientFill.addColorStop(1, this.chartColor);

  }
  private setupLineChart() {
    
    this.canvas = document.getElementById("chartLine");
    this.ctx = this.canvas.getContext("2d");
    this.setupGradient();
    this.chartLine = new Chart(this.ctx, {
      type: 'line',
      data: {
        labels: ["W01/W27","W02/W28","W03/W29","W04/W30","W05/W31","W06/W32","W07/W33","W08/W34","W09/W35","W10/W36",
          "W11/W37","W12/W38","W13/W39","W14/W40","W15/W41","W16/W42","W17/W43","W18/W44","W19/W45","W20/W46",
          "W21/W47","W22/W48","W23/W49","W24/W50","W25/W51","W26/W52"], 
        datasets: [{
          label: "Week 1 - Week 26",
            borderColor: "#6bd098",
            backgroundColor: this.gradientStroke,
            pointRadius: 2,
            pointHoverRadius: 5,
            borderWidth: 3,
            data: Object.values(this.countDatesInRange(this.now1, this.now2, 'week')), //count reviews per month on the first range time
          },
          {
            label: "Week 27 - Week 52",
            borderColor: "#f17e5d",
            backgroundColor: this.gradientFill,
            pointRadius: 2,
            pointHoverRadius: 5,
            borderWidth: 3,
            data: Object.values(this.countDatesInRange(this.now3, this.now4, 'week')), //count reviews per month on the first range time
          },
          
        ]
      },
      options: {
        legend: {
          display: true,
          position: "bottom" as const,
        },

        tooltips: {
          enabled: true
        },

        scales: {
          yAxes: [{

            ticks: {
              fontColor: "#9f9f9f",
              beginAtZero: false,
              maxTicksLimit: 5,
              //padding: 20
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
              drawBorder: false,
              color: 'rgba(255,255,255,0.1)',
              zeroLineColor: "transparent",
              display: false,
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

  private setupBarChart() {
    this.canvas = document.getElementById("activity");
      this.ctx = this.canvas.getContext("2d");
      this.chartBar = new Chart(this.ctx, {
        type: 'bar',
        data: {
          datasets: [

            {
              label: "Week 1 - Week 26",
              borderColor: '#6bd098',
              fill: true,
              backgroundColor: '#6bd098',
              hoverBorderColor: '#6bd098',
              borderWidth: 8,
              data: [Object.values(this.countDatesInRange(this.now1, this.now2, 'week')).reduce((acc, value) => acc + value, 0)],
            },
            {
              label: "Week 26 - Week 53",
              borderColor: '#f17e5d',
              fill: true,
              backgroundColor: '#f17e5d',
              hoverBorderColor: '#f17e5d',
              borderWidth: 8,
              data: [Object.values(this.countDatesInRange(this.now3, this.now4, 'week')).reduce((acc, value) => acc + value, 0)],
            }
          ]
        },
        options: {
          legend: {
            display: true,
            position: "bottom" as const,

          },
          scales: {
            
            yAxes: [{
              ticks: {
                fontColor: "#9f9f9f",
                fontStyle: "bold",
                beginAtZero: true,
                maxTicksLimit: 5,
                padding: 20
              },
              gridLines: {
                zeroLineColor: "transparent",
                display: true,
                drawBorder: false,
                color: '#9f9f9f',
              }

            }],
            dataset: [{
              barPercentage: 0.4,
              gridLines: {
                zeroLineColor: "white",
                display: false,

                drawBorder: false,
                color: 'transparent',
              },
              ticks: {
                padding: 20,
                fontColor: "#9f9f9f",
                fontStyle: "bold"
              }
            }]
          }
        }
        
      });
  }


  //------------------------------------ Initialisation -----------------------------------


  initialisation() {
    this.setupLineChart();
    this.setupBarChart();
    var absoluteNumber1 = this.chartBar.data.datasets[0].data[0];
    var absoluteNumber2 = this.chartBar.data.datasets[1].data[0];
    this.absoluteNumber = absoluteNumber2 - absoluteNumber1;

    // Replace these with your actual calculations
    this.percentage = Number(((absoluteNumber2 - absoluteNumber1)*100 / absoluteNumber1).toFixed(2));

    // Determine if the percentage is positive or negative
    this.isPositive = this.percentage >= 0;
    this.isNegative = this.percentage < 0;
  }

  
//-----------------------------------------REAL UPDATE-------------------------------------

  public realUpdate(): void {
    const unit = (document.getElementById('unit') as HTMLInputElement).value;

    if (unit && ['day', 'week', 'month', 'year'].includes(unit)) {
      this.updateCharts(unit as "day" | "week" | "month" | "year");
    }
  }


  calculateNumbersAndPercentage(): void {

    const absoluteNumber1 = this.chartBar.data.datasets[0].data[0];
    const absoluteNumber2 = this.chartBar.data.datasets[1].data[0];
    this.absoluteNumber = absoluteNumber2 - absoluteNumber1;

    // Replace these with your actual calculations
    this.percentage = Number(((absoluteNumber2 - absoluteNumber1)*100 / absoluteNumber1).toFixed(2));

    // Determine if the percentage is positive or negative
    this.isPositive = this.percentage >= 0;
    this.isNegative = this.percentage < 0;
  }


  private countDatesInRange(startDate: Date, endDate: Date, timeUnit: 'day' | 'week' | 'month' | 'year'): Record<string, number> {
    const counts: Record<string, number> = {};
  
    const stepFnMap: Record<string, (date: Date) => string> = {
      'day': (date: Date) => `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`,
      'week': (date: Date) => `W${String(this.chartService.getISOWeek(date)).padStart(2, '0')}`,
      'month': (date: Date) => `${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`,
      'year': (date: Date) => `${date.getFullYear()}`
    };
  
    const stepFn = stepFnMap[timeUnit];
  
    for (let d = new Date(startDate); d <= endDate; this.chartService.incrementDate(d, timeUnit)) {
      const key = stepFn(d);
      counts[key] = 0;
    }
  
    this.Users.forEach(user => {
      const date = new Date(user.date);
      if (date >= startDate && date <= endDate) {
        const key = stepFn(date);
        counts[key]++;
      }
    });
  
    return counts;
  }
  

  private updateCharts(timeUnit: 'day' | 'week' | 'month' | 'year'): void {
    const startDateInput1 = new Date((document.getElementById('startDate1') as HTMLInputElement).value);
    const endDateInput1 = new Date((document.getElementById('endDate1') as HTMLInputElement).value);
    const startDateInput2 = new Date((document.getElementById('startDate2') as HTMLInputElement).value);
    const endDateInput2 = new Date((document.getElementById('endDate2') as HTMLInputElement).value);

    if (startDateInput1 && endDateInput1 && startDateInput2 && endDateInput2) {
        const result1BarPie = [Object.values(this.countDatesInRange(startDateInput1, endDateInput1, timeUnit)).reduce((acc, value) => acc + value, 0)];
        this.chartBar.data.datasets[0].data = result1BarPie;

        const result2BarPie = [Object.values(this.countDatesInRange(startDateInput2, endDateInput2, timeUnit)).reduce((acc, value) => acc + value, 0)];
        this.chartBar.data.datasets[1].data = result2BarPie;
        this.absoluteNumber = result2BarPie[0] - result1BarPie[0];

        this.chartLine.data.datasets[0].data = Object.values(this.countDatesInRange(startDateInput1, endDateInput1, timeUnit));
        this.chartLine.data.datasets[1].data = Object.values(this.countDatesInRange(startDateInput2, endDateInput2, timeUnit));

        const firstList = Object.keys(this.countDatesInRange(startDateInput1, endDateInput1, timeUnit));
        const secondList = Object.keys(this.countDatesInRange(startDateInput2, endDateInput2, timeUnit));
        this.chartBar.data.labels = this.chartService.getLabelForChart(timeUnit, firstList, secondList);

        this.chartBar.data.datasets[0].label = this.chartLine.data.datasets[0].label = this.chartService.getLabelForDataset(firstList);
        this.chartBar.data.datasets[1].label = this.chartLine.data.datasets[1].label = this.chartService.getLabelForDataset(secondList);
        
        this.chartLine.data.labels = this.chartService.mixLists(firstList, secondList);

        // Update charts
        this.chartBar.update();
        this.chartLine.update();
        this.calculateNumbersAndPercentage();
    }
  }
  
}
