import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { HttpModule, JsonpModule } from "@angular/http";

import { LoginComponent } from "./login.component";

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		JsonpModule
	],
	declarations: [ LoginComponent ],
	providers: [
		
	],
	exports: [ LoginComponent ]
})

export class LoginModule { }
