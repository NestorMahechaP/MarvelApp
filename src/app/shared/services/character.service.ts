import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { environment } from '@environment/environment.development';
import { Character } from '../interfaces/character.interface';
import { firstValueFrom } from 'rxjs';
import { ResponseObject } from '../interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {

  constructor(private http: HttpClient) {}

  searchCharacters(query='', orderBy=''){
    let path1 = `${environment.baseUrlAPI}?`;
    let path2 = `${environment.apiKey}`;
    if (query != '')
    {
      path1 += `nameStartsWith=${query}&`;
    }
    if (orderBy != '')
    {
      path1 += `orderBy=${orderBy}&`;
    }
    return this.loadCharacters(path1 + path2);
  }

  getDetails(id:number){
    return this.http.get<Character>(`${environment.baseUrlAPI}?id=${id}&${environment.apiKey}`)
  }

  getComics(id:number){
    return this.http.get<Character>(`${environment.baseUrlAPI}/${id}/comics?${environment.apiKey}`)
  }

  getComicDetailsByUrl(urlComic:string){
    return this.http.get(`${urlComic.replace("http","https")}?${environment.apiKey}`);
  }

  async loadCharacters(query='')
  {
    let characterList:Character[] = [];
    let offset = 0;
    let size = 100;
    let max = 300;
    while(true)
    {
      var temp = (await this.sendRequest(query, offset, size)).data.results;
      characterList = characterList.concat(characterList, temp);
      if (temp.length < 100 || characterList.length >= max)
        break;
      offset += size;
    }
    console.log(characterList);
    return characterList;
  }

  async sendRequest(query='', offset=0, size=100){
    return await firstValueFrom(this.http.get<ResponseObject>(`${query}&limit=${size}&offset=${offset}`));
  }
}

