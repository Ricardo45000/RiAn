import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';
import { environment } from 'environments/environment';
import bcrypt from 'bcryptjs';



@Injectable({
  providedIn: 'root',
})
export class AuthserviceService {
  private connected: boolean = false;
  private tableName = 'users'; // Replace with your Airtable table name
  private authUrl = `https://api.airtable.com/v0/${environment.BASE_ID}`;
  public myProfilePicture;
  public myQrCode;
  public myTable;
  public myName;
  public myLogo;
  public id;

  constructor(private http: HttpClient) {
    // Check localStorage for stored authentication state
    this.connected = localStorage.getItem('connected') === 'true';
    // Load other user data from localStorage
    this.loadUserData();
  }

  signIn(username: string, password: string): Observable<boolean> {
    this.id = username;
    const airtableEndpoint = `${this.authUrl}/${this.tableName}`;
    const headers = {
      Authorization: `Bearer ${environment.API_KEY}`,
    };
    
  
    const params = {
      filterByFormula: `{username} = '${username}'`,
      maxRecords: 1,
      fields: ['Id', 'Username', 'Password', 'Name', 'Image', 'Table', 'QrCode', 'Logo'],
    };

    return this.http.get<any>(airtableEndpoint, { params, headers }).pipe(
      map((response) => {
        const user = response.records[0];
        //console.log(this.hashPassword(password));
        if (user && this.verifyPassword(password, user.fields.Password)) {
          this.connected = true;
          this.myTable = user.fields.Table;
          this.myProfilePicture = user.fields.Image[0].url;
          this.myQrCode = user.fields.QrCode;
          this.myName = user.fields.Name;
          this.myLogo = user.fields.Logo[0].url;
          
          // Save other user data to localStorage
          this.saveUserData();
          return true;
        } else {
          this.connected = false;
          return false;
        }
      }),
      catchError((error) => {
        console.error('Error during sign-in:', error);
        return of(false);
      })
    );
    
  }

  checkConnection() {
    
    const airtableEndpoint = `${this.authUrl}/${this.tableName}`;
    const headers = {
      Authorization: `Bearer ${environment.API_KEY}`,
    };
  
    const params = {
      filterByFormula: `{username} = '${this.id}'`,
      maxRecords: 1,
      fields: ['Id', 'Username', 'Password', 'Name', 'Image', 'Table', 'QrCode', 'Logo'],
    };
  
    this.http.get<any>(airtableEndpoint, { params, headers }).pipe(
      catchError(error => {
        console.error('Error fetching profile picture:', error);
        this.connected = false;
        return of(false); // Assuming 'of' is imported from 'rxjs'
      }),
      map((response) => {
        const profilePictureUrl = response.records[0]?.fields?.Image[0]?.url || null;
        const myLogo = response.records[0]?.fields?.Logo[0]?.url || null;
        if (profilePictureUrl && myLogo) {
          localStorage.setItem('myProfilePicture', profilePictureUrl);
          this.myProfilePicture = profilePictureUrl;
          localStorage.setItem('myLogo', myLogo);
          this.myLogo = myLogo;
          this.connected = true;
        } else {
          this.connected = false;
        }
        return this.connected;
      })
    ).subscribe();
  
    return this.connected;
  }
  

  disconnect() {
    this.connected = false;
    localStorage.removeItem('connected');
    localStorage.removeItem('id');
    localStorage.removeItem('myTable');
    localStorage.removeItem('myProfilePicture');
    localStorage.removeItem('myName');
    localStorage.removeItem('qrcode');
    localStorage.removeItem('myLogo');

  }

  private saveUserData() {
    localStorage.setItem('connected', 'true');
    localStorage.setItem('id', this.id);
    localStorage.setItem('qrcode', this.myQrCode);
    localStorage.setItem('myTable', this.myTable);
    localStorage.setItem('myProfilePicture', this.myProfilePicture);
    localStorage.setItem('myName', this.myName);
    localStorage.setItem('myLogo', this.myLogo);
  }

  private loadUserData() {
    this.id = localStorage.getItem('id');
    this.myQrCode = localStorage.getItem('qrcode');
    this.myTable = localStorage.getItem('myTable');
    this.myProfilePicture = localStorage.getItem('myProfilePicture');
    this.myName = localStorage.getItem('myName');
    this.myLogo = localStorage.getItem('myLogo');
  }
  
  /**private hashPassword(password: string): string {
    const saltRounds = 10; // You can adjust the number of salt rounds based on your security requirements
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  }**/

  // Function to verify the entered password against the stored hash
  private verifyPassword(enteredPassword: string, storedHashedPassword: string): boolean {
    return bcrypt.compareSync(enteredPassword, storedHashedPassword);
  }


}
