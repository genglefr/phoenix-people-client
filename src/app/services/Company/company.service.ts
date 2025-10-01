import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {CompanyDto} from '../../model';
import {ApiInformation} from '../../utils/ApiInformation';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  params: HttpParams;

  // Static array containing names of the belgian companies.
  public readonly belgianCompanies = ['ARHS Belgium', 'ARHS Digital', 'ARHS Technology'];
  public readonly luxCompanies = ['ARHS Luxembourg', 'Nyx', 'ARHS Consulting', 'ARHS Cube', 'ARHS Spikeseed', 'Fleetback', 'ARHS Beyond Limit', 'ARHS Advisory', 'ARHS Cybersec'];

  constructor(private http: HttpClient) {
  }

  getCompanies(): Promise<CompanyDto[]> {
    return new Promise(resolve => {
      this.http.get<CompanyDto[]>(
        `${ApiInformation.API_ENDPOINT}${ApiInformation.COMPANIES_ENDPOINT}list`
      ).subscribe(
        data => resolve(data)
      );
    });
  }
}

