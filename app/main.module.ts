import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule, JsonpModule } from "@angular/http";

import { MainComponent } from "./main.component";
import { RoutingModule } from "./routing.module";


@NgModule({
	imports: [ 
        BrowserModule, 
		FormsModule,
		RoutingModule,
		HttpModule,
		JsonpModule,
	],
	declarations: [
		MainComponent
	],
	providers:[ 

	],
	exports: [ MainComponent ]
})

export class MainModule { }