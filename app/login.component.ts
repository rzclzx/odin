import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
declare var require;
declare var $;
let path = require("./login.html");
@Component({
	selector: "ng-login",
	template: path
})

export class LoginComponent implements OnInit { 

	

	constructor(
		
	) {}

	ngOnInit() {
		
    }


	
}