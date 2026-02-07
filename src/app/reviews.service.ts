import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  // Pour utiliser l'API Google Places, il faut une clé API
  // Obtenir la clé ici: https://console.cloud.google.com/apis/credentials
  private apiKey = 'VOTRE_CLE_API_GOOGLE'; // À remplacer
  private placeId = 'ChIJwfhSL4Pq9EcRqcmswNRXNzU'; // Place ID de Studio Vert

  constructor(private http: HttpClient) {}

  getGoogleReviews(): Observable<any> {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${this.placeId}&fields=reviews,rating,user_ratings_total&key=${this.apiKey}`;

    // Note: Cette requête nécessite un proxy car Google bloque les requêtes CORS directes
    // Solution alternative ci-dessous
    return this.http.get(url);
  }

  // Méthode alternative utilisant un proxy CORS ou backend
  getGoogleReviewsViaProxy(): Observable<any> {
    // Vous pouvez utiliser un service comme https://cors-anywhere.herokuapp.com/
    // ou créer votre propre endpoint backend
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    const url = `${proxyUrl}https://maps.googleapis.com/maps/api/place/details/json?place_id=${this.placeId}&fields=reviews,rating,user_ratings_total&key=${this.apiKey}`;

    return this.http.get(url);
  }
}
