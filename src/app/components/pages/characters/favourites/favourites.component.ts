import { Component, OnInit } from '@angular/core';
import { CharacterService } from '@app/shared/services/character.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css']
})
export class FavouritesComponent implements OnInit{
  constructor(private characterService : CharacterService, private toastr:ToastrService){}

  favourites: any=[];

  ngOnInit(): void {
    this.characterService.selectedFavourites$.subscribe((value:any)=>{
      this.favourites = value;
    })
  }
  
  deleteFavourite(img:any){
    var cont:number=0;
    var index:number=-1;
    for(let element of this.favourites)
    {
      if(element.id==img.id)
      {
        index=cont;
        break;
      }
      cont=cont+1;
    }
    if(index>-1)
    {
      this.favourites.splice(index,1)
      this.toastr.info('Favourite comic', 'DELETED', {timeOut:2000})
    }
    this.save(this.favourites);
    this.characterService.setFavourite(this.favourites);
  }

  save(fav :any){
    sessionStorage.setItem('favourites', JSON.stringify (fav))
  }

  get(){
    var favouritesArray : any=[];
    favouritesArray=sessionStorage.getItem('favourites');
    if (favouritesArray==null || favouritesArray.length==0)
      return [];
    return JSON.parse(favouritesArray);
  }
  replaceDefaultImage(img:any){
    var urlDefaultImg = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg";
    var actualImg = img.path + "." + img.extension;
    return actualImg != urlDefaultImg ? actualImg : "assets/unknown-comic.jpg";
  }
}
