// airtable.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Airtable from 'airtable';
import { environment } from 'environments/environment';
import { AuthserviceService } from './authservice.service';

// Interface representing the structure of your records
interface AirtableRecord {
  rating: number;
  category: string;
  comment: string;
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class AirtableService {
  private base: Airtable.Base;
  private apiKey: string;
  private baseId: string;
  private records: AirtableRecord[] | null = null;

  constructor(private http: HttpClient, private authService: AuthserviceService) {
    this.apiKey = environment.API_KEY;
    this.baseId = environment.BASE_ID;
    this.base = new Airtable({ apiKey: this.apiKey }).base(this.baseId);
  }

 // Fetch records from Airtable
async getRecords(): Promise<AirtableRecord[]> {
  if (this.records === null) {
    const records: AirtableRecord[] = [];
    // Use the Airtable API to fetch records (replace 'Table' with your actual table name)
    const queryResult = await this.base(this.authService.myTable).select().all();

    // Extract the necessary fields from the Airtable records
    queryResult.forEach(record => {
      
      const airtableRecord: AirtableRecord = {
        category: record.fields['category'] as string, 
        rating: record.fields['rating'] as number,       
        comment: record.fields['comment'] as string,
        date: record.fields['date'] as string,
      };

      records.push(airtableRecord);
      this.records = records;
    });
  }
  return this.records;
}

/**async pushRecords(records: AirtableRecord[]): Promise<void> {
  try {
    const apiUrl = `https://api.airtable.com/v0/${this.baseId}/${this.authService.myTable}`;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    });

    // Adjust the data structure based on your Airtable schema
    const data = {
      records: records.map((record) => ({
        fields: record,
      })),
    };

    await this.http.post(apiUrl, data, { headers }).toPromise();
  } catch (error) {
    console.error('Error pushing records to Airtable:', error);
    throw error;
  }
}**/

}
