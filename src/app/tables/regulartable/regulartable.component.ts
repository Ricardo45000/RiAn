import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from 'app/shared/service/shared.service';
import { AirtableService } from 'environments/airtable/airtable.service';
import { AuthserviceService } from 'environments/airtable/authservice.service';

interface USERS {
  category: String;
  rating: number;
  comment: String;
  date: String;
}

declare var $:any;

interface DataTable {
    headerRow: string[];
    dataRows: string[][];
}

@Component({
    selector: 'regular-table-cmp',
    templateUrl: 'regulartable.component.html'
})

export class RegularTableComponent implements OnInit, AfterViewInit{

  public dataTable: DataTable = { headerRow: [], dataRows: [] };
  public dtInstance: any;

  constructor(private airtableService: AirtableService, 
    private router: Router, 
    private authService: AuthserviceService, 
    private sharedService: SharedService,
    public translate: TranslateService) {
      this.translate.setDefaultLang("en");
    }



  // Create a function to convert USERS array to DataTable
  convertToDataTable(users: USERS[]): DataTable {
    // Extract header row from the first user object (assuming all objects have the same structure)
    const headerRow: string[] = Object.keys(users[0]);
    // Extract data rows
    const dataRows: string[][] = users.map(user =>
      Object.values(user).map(value =>
        (value !== null && value !== undefined && value !== '')
          ? value.toString().replace(/[\r\n]+/g, '\n')
          : '\n'
      )
    );
    

    return { headerRow, dataRows };
}

  ngOnInit() {
    if (this.authService.checkConnection()) { 

      this.sharedService.filterRating$.subscribe((rating) => {
        this.filterByRating(rating);
      });
      this.sharedService.filterCategory$.subscribe((category) => {
        this.filterByCategory(category);
      });
      
     this.airtableService.getRecords().then((records) => {
        if (records && records.length > 0) {
          this.dataTable = this.convertToDataTable(records);
          
          
          
          // Additional logic that needs to happen after data fetching and initialization
        } else {
          console.error('No records found.');
        }
      }).catch(error => {
        console.error('Error fetching records:', error);
      });
    } else {
      this.router.navigate(['/pages/lock']);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initDataTable();
    });
  }

  
  initDataTable(): Promise<void> {
  
    // Wrap the initialization logic in a Promise
    return new Promise<void>((resolve) => {
      const checkCondition = () => {
        if (this.dataTable.dataRows.length > 0) {
          // If the condition is met, proceed with DataTable initialization
          this.dtInstance = $('#datatable').DataTable({
            "pagingType": "full_numbers",
            "lengthMenu": [
              [10, 25, 50, -1],
              [10, 25, 50, "All"]
            ],
            "order": [[this.dataTable.headerRow.indexOf('date'), 'desc']],
            responsive: true,
            language: {
              search: "_INPUT_",
              searchPlaceholder: "Search records",
            },
            initComplete: function () {
              const api = this.api();
  
              // Create a new row below the header row for filter inputs
              const filterRow = $(api.table().header()).closest('thead')[0].insertRow(-1);
  
              // Create an input element for each column and append it to the new row
              api.columns().every(function (index) {
                const column = this;
                const cell = filterRow.insertCell(-1);
                $(cell).addClass('header-filter-cell');
  
                if (column.header().textContent === 'rating' || column.header().textContent === 'category' ||
                 column.header().textContent === 'note' || column.header().textContent === 'catégorie' ||
                 column.header().textContent === 'kategorie' || column.header().textContent === 'bewertung') {
                  const select = document.createElement('select');
                  select.id = column.header().textContent.toLowerCase();
                  const values = Array.from(new Set(api.column(index).data().toArray())).sort();
  
                  // Add an empty option for no filter
                  const option = document.createElement('option');
                  option.text = 'All';
                  option.value = '';
                  select.add(option);
  
                  // Add options for each unique value in the column
                  values.forEach(value => {
                    const option = document.createElement('option');
                    option.text = value as string; // Explicitly cast value to string
                    option.value = value as string; // Explicitly cast value to string
                    select.add(option);
                  });
  
                  $(select).appendTo($(cell))
                    .on('change', function () {
                      const val = $.fn.dataTable.util.escapeRegex($(this).val());
                      column.search(val ? `^${val}$` : '', true, false).draw();
                    })
                    .css('width', '100%');
                } else {
                  const input = document.createElement("input");
                  $(input).appendTo($(cell))
                    .on('keyup change', function () {
                      column.search($(this).val()).draw();
                    }).attr('placeholder', api.column(index).header().textContent)
                    .css('width', '100%');
                }
              });
  
              // Add overflow style to make it scrollable
              $('#datatable_wrapper').css('overflow', 'auto');
  
              // Resolve the Promise after DataTable initialization
              resolve();
            }
          });
        } else {
          // If not, check again after a short delay
          setTimeout(checkCondition, 100);
        }
      };
  
      // Start checking the condition
      checkCondition();
    });
  }
  


public async filterByRating(rating: number): Promise<void> {

  await this.waitForDataTableInit(); // Ensure DataTable is initialized
  const api = this.dtInstance;
  
  // Check if DataTable instance is defined
  if (api) {
    // Find the rating filter element using its id
    var ratingFilterSelect = null;
    if(this.translate.currentLang == null || this.translate.currentLang == 'en' ){
      ratingFilterSelect = $(`#rating`);
    }
    if( this.translate.currentLang == 'fr' ){
      ratingFilterSelect = $(`#note`);
    }
    if(this.translate.currentLang == 'de' ){
      ratingFilterSelect = $(`#bewertung`);
    }
  

    // Check if the filter select element is found
    if (ratingFilterSelect.length > 0) {
      // Set the value of the select element to the specified optionValue
      ratingFilterSelect.val(rating.toString()).trigger('change');
    } else {
      console.error('Rating filter select element not found.');
    }
  } else {
    console.error('DataTable instance not defined.');
  }
}

public async filterByCategory(category: string): Promise<void> {
  
  await this.waitForDataTableInit(); // Ensure DataTable is initialized
  const api = this.dtInstance;
  // Check if DataTable instance is defined
  if (api) {
    // Find the rating filter element using its id
    var categoryFilterSelect;

    if(this.translate.currentLang == null || this.translate.currentLang == 'en' ){
      categoryFilterSelect = $(`#category`);
    }
    if( this.translate.currentLang == 'fr' ){
      categoryFilterSelect = $(`#catégorie`);
    }
    if(this.translate.currentLang == 'de' ){
      categoryFilterSelect = $(`#kategorie`);
    }

    // Check if the filter select element is found
    if (categoryFilterSelect.length > 0) {
      // Set the value of the select element to the specified optionValue
      categoryFilterSelect.val(category.toString()).trigger('change');
    } else {
      console.error('Category filter select element not found.');
    }
  } else {
    console.error('DataTable instance not defined.');
  }
}


private waitForDataTableInit(): Promise<void> {
  return new Promise<void>((resolve) => {
    const intervalId = setInterval(() => {
      const api = $.fn.DataTable.isDataTable('#datatable') ?
        $('#datatable').DataTable() :
        undefined;
      if (api) {
        clearInterval(intervalId);
        resolve();
      }
    }, 100);
  });
}

  

      
     

}
