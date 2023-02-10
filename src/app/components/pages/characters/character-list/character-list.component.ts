import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterService } from '@app/shared/services/character.service';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.css']
})
export class CharacterListComponent implements OnInit{
  constructor(private characterService : CharacterService, private route: ActivatedRoute){}

  ngOnInit(): void {
    this.loadCharactersList();
  }

  private query : string = '';
  private orderBy : string = '';
  characterList:any=[];

  private loadCharactersList(){
    this.route.params.subscribe(params => {
      this.query = params['query'];
      this.getCharactersData();
    });
  }

  private async getCharactersData(){
    this.characterList = await this.characterService.searchCharacters(this.query, this.orderBy);
  }

  orderAs(type = '')
  {
    this.orderBy = type;
    this.getCharactersData();
  }

  comicArrays(character:any): string[]{
    let comicArray: string[] = [];
    let comics = character.comics?.items;
    if(comics)
    {
      for(var val of comics){
        comicArray.push(val?.name);
      }
    }
    if(comicArray.length == 0)
      comicArray.push("No comics found.")
    return comicArray;
  }

  validateDescription(text:String){
    return text.length>143 ? text.slice(0,140)+ "..." : text;
  }

  validateComic(text:String){
    return text.length>43 ? text.slice(0,40)+ "..." : text;
  }
  
  replaceDefaultImage(img:any){
    var urlDefaultImg = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
    var actualImg = img.path + "." + img.extension;
    return actualImg != urlDefaultImg ? actualImg : "assets/super-hero.jpg";
  }
} 