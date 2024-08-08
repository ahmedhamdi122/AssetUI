import { Injectable } from '@angular/core';
import FeatureLayer from '@arcgis/core/layers/FeatureLayer';
import { environment } from 'src/environments/environment';
import Map from '@arcgis/core/Map';
@Injectable({
  providedIn: 'root'
})
export class FeaturesMapService {
  public HOSP_ELSHARKYA: FeatureLayer;
  public ADMIN_ELSHARKYA: FeatureLayer;
  public ELSHARKYA: FeatureLayer;

  public HOSP_ELSHARKYA_En: FeatureLayer;
  public ADMIN_ELSHARKYA_En: FeatureLayer;
  public ELSHARKYA_En: FeatureLayer;

  public HOSP_ELSHARKYAUrl =
  environment.arcgisServerUrl + 'healthAPP/FeatureServer/0/query';
public ADMIN_ELSHARKYAUrl =
  environment.arcgisServerUrl + 'healthAPP/FeatureServer/1/query';
public ELSHARKYAUrl =
  environment.arcgisServerUrl + 'healthAPP/FeatureServer/2/query';
  
  public HOSP_ELSHARKYAUrl_En =
  environment.arcgisServerUrl + 'healthAPP_Eng/FeatureServer/0/query';
  public ADMIN_ELSHARKYAUrl_En =
  environment.arcgisServerUrl + 'healthAPP_En/FeatureServer/1/query';
public ELSHARKYAUrl_En =
  environment.arcgisServerUrl + 'healthAPP_En/FeatureServer/2/query';

  constructor() { }

  FeatureADMIN_ELSHARKYA(mapInstance: Map, trans: number, query: string) {
    this.ADMIN_ELSHARKYA = new FeatureLayer({
      url: environment.arcgisServerUrl + 'healthAPP/FeatureServer/1',
      opacity: trans,
      definitionExpression: query,
    });
    mapInstance.add(this.ADMIN_ELSHARKYA);
  }
  FeatureADMIN_ELSHARKYA_En(mapInstance: Map, trans: number, query: string) {
    this.ADMIN_ELSHARKYA = new FeatureLayer({
      url: environment.arcgisServerUrl + 'healthAPP_Eng/FeatureServer/1',
      opacity: trans,
      definitionExpression: query,
    });
    mapInstance.add(this.ADMIN_ELSHARKYA);
  }
  FeatureELSHARKYA(mapInstance: Map, trans: number, query: string) {
    this.ELSHARKYA = new FeatureLayer({
      url: environment.arcgisServerUrl + 'healthAPP/FeatureServer/2',
      opacity: trans,
      definitionExpression: query,
    });
    mapInstance.add(this.ELSHARKYA);
  }
  FeatureELSHARKYA_En(mapInstance: Map, trans: number, query: string) {
    this.ELSHARKYA_En = new FeatureLayer({
      url: environment.arcgisServerUrl + 'healthAPP_Eng/FeatureServer/2',
      opacity: trans,
      definitionExpression: query,
    });
    mapInstance.add(this.ELSHARKYA_En);
  }

  FeatureHOSP_ELSHARKYA(
    mapInstance: Map,
    trans: number,
    popupTemp,
    query: string
  ) {
    this.HOSP_ELSHARKYA = new FeatureLayer({
      url: environment.arcgisServerUrl + 'healthAPP/FeatureServer/0',
      outFields: ['*'],
      popupEnabled: true,
      popupTemplate: popupTemp,
      opacity: trans,
      definitionExpression: query,
    });
    mapInstance.add(this.HOSP_ELSHARKYA);
  }
  FeatureHOSP_ELSHARKYA_En(
    mapInstance: Map,
    trans: number,
    popupTemp,
    query: string
  ) {
    this.HOSP_ELSHARKYA_En = new FeatureLayer({
      url: environment.arcgisServerUrl + 'healthAPP_Eng/FeatureServer/0',
      outFields: ['*'],
      popupEnabled: true,
      popupTemplate: popupTemp,
      opacity: trans,
      definitionExpression: query,
    });
    mapInstance.add(this.HOSP_ELSHARKYA_En);
  }
  //  postdata(obj)
  // {
  //   return this.http
  //   .post("http://10.10.0.147/arcgis/rest/services/healthAPP/FeatureServer/0/addFeatures",obj)
  //   .pipe();

  // }
}
