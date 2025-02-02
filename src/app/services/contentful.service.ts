import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { createClient } from 'contentful';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

const accessToken = environment.contentful.accessToken;
const spaceId = environment.contentful.space;

@Injectable({
  providedIn: 'root'
})
export class ContentfulService {
  private client = createClient(environment.contentful);
  
  constructor() { } 
  
  // only for testing..
  getContents() {
    const promise = this.client.getEntries();
    return from(promise).pipe(map(response => response.items))
  }
  
  // only for testing
  getContents_New() {
    return this.client.getEntries()
    .then((res: { items: any; }) => res.items);
  }

  getContent_GraphQl() {
    return fetch(
      `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/master`,
      {
        method: 'POST',
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          query: this.getQuery()
        })
      }
    )
    .then(res => res.json())
    .then(response => {
      // console.log('GraphQl load');
      // console.log(response);
      return response;
    })
    .catch(error => {
      console.log(error);
    })
  }
  
  getQuery() {
    return `
    {
      battleshipCollection (limit:1) {
        items{
          heading,
          description,
          backgound{
            url
          }
          burgerMenu{
            url
          }
        }
      }
    }
    `;
  }
}
