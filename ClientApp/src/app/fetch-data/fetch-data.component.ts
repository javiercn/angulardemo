import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-fetch-data',
  templateUrl: './fetch-data.component.html'
})
export class FetchDataComponent implements OnInit {
  private http: HttpClient;
  private baseUrl: string;
  private authenticationService: AuthenticationService;

  public forecasts: WeatherForecast[];

  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string, authenticationService: AuthenticationService) {
    this.http = http;
    this.baseUrl = baseUrl;
    this.authenticationService = authenticationService;
  }

  async ngOnInit() {
    let accessToken = await this.authenticationService.getAccesstoken();
    let headers = new HttpHeaders().set('Authorization', `Bearer ${accessToken}`);
    this.http.get<WeatherForecast[]>(this.baseUrl + 'api/SampleData/WeatherForecasts', { headers: headers })
      .subscribe(result => {
        this.forecasts = result;
      }, error => console.error(error));
  }
}

interface WeatherForecast {
  dateFormatted: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}
