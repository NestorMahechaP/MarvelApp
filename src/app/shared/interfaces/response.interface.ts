import { Character } from "./character.interface";

export interface ResponseObject{
    data:Result; 
}

export interface Result{
    results:Character[]
}