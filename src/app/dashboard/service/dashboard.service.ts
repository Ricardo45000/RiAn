import { Injectable } from '@angular/core';
import Chart from 'chart.js';
import { AirtableService } from 'environments/airtable/airtable.service';

interface USERS {
  rating: number;
  category: string;
  comment: string;
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  
  records: USERS[] = [];
  selectedLanguage = 'en';

  constructor(private airtableService: AirtableService) {}

  public async getChartData(ctx: any): Promise<Chart.ChartData> {
    this.records = await this.airtableService.getRecords();
    return this.generateChartData(ctx);
  }

  private generateChartData(ctx: any): Chart.ChartData {
    const chartColor = "#FFFFFF";

    var gradientStroke = ctx.createLinearGradient(0, 20, 0, 300);
    gradientStroke.addColorStop(0, '#6bd098');
    gradientStroke.addColorStop(1, chartColor);

    const dataset = {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
        label: 'Number of Reviews',
        borderColor: '#6bd098',
        backgroundColor: gradientStroke,
        pointRadius: 5,
        pointHoverRadius: 10,
        fill: true,
        borderWidth: 3,
        data: this.countDatesForEachMonth(),
      }]
    };

    return dataset;
  }

  //need to adjust it for the current year and to stop the line chart if the month did not start yet
  private countDatesForEachMonth(): number[] {
    const currentYear = new Date().getFullYear();

    // Filter records for the current year and only include months that have started in the current year
    const filteredRecords = this.records
      .filter(user => {
        const userDate = new Date(user.date);
        return userDate.getFullYear() === currentYear
      });

    // Count occurrences for each month using map and reduce
    return filteredRecords
      .map(user => new Date(user.date).getMonth())
      .reduce((monthCounts, month) => {
        monthCounts[month]++;
        return monthCounts;
      }, new Array(12).fill(0));
  }
  

  public calculateAverageStars(): string {
    const validRatings = this.records.map(user => user.rating).filter(stars => !isNaN(stars));
  
    const totalStars = validRatings.reduce((sum, stars) => sum + stars, 0);
    const recordsCount = validRatings.length;
  
    // Check if there are valid records to avoid division by zero
    return Number(recordsCount > 0 ? totalStars / recordsCount : 0).toFixed(2);
  }
  

  public counterStarsRating(nbstars: number): number {
    return this.records.map(user => user.rating).filter(rating => rating === nbstars).length;
  }

  public numberOfComments(){ 
    const currentYear = new Date().getFullYear();

    // Use map to transform each record's date to the corresponding year
    const years = this.records.map(user => new Date(user.date).getFullYear());

    // Use reduce to count the occurrences of the current year
    const numberOfComments = years.reduce((count, year) => {
      return count + (year === currentYear ? 1 : 0);
    }, 0);

    return numberOfComments;
  }

  public categoryToImprove(): string | null {
    const categoryCounts: { [category: string]: number } = {};
  
    // Use map to transform each user record into its category
    const categories = this.records.map(user => {
      const lowercaseCategory = user.category.toLowerCase();
      return lowercaseCategory.charAt(0).toUpperCase() + lowercaseCategory.slice(1);
    }); // Convert to lowercase for case-insensitive comparison
  
    // Use reduce to count the occurrences for each category
    categories.reduce((accumulator, category) => {
      accumulator[category] = (accumulator[category] || 0) + 1;
      return accumulator;
    }, categoryCounts);
  
    // Find the category with the highest count
    const [categoryToImprove] = Object.entries(categoryCounts)
      .reduce((max, entry) => (entry[1] > max[1] ? entry : max), ['', -Infinity]);
  
    return categoryToImprove || null;
  }

}
