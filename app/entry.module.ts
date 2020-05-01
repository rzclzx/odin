import 'core-js/es6';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule,Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { HttpModule, JsonpModule } from "@angular/http";
import { MainModule } from "./main.module";
import { LoginModule } from "./login.module";
import { MainComponent } from "./main.component";
import { LoginComponent } from "./login.component";
import { EntryComponent } from "./entry.component";
import { childRoutes } from "./routing.module";


const routes: Routes = [
	{ path: "home" , redirectTo: "home/project/projectList", pathMatch: "full" },
	{ 
		path: "home",
		component: MainComponent,
		children: childRoutes
	},
    { path: "login", component: LoginComponent }
];

@NgModule({
	imports: [ 
        RouterModule.forRoot(routes, { useHash: true }),
		BrowserModule, 
		FormsModule,
		HttpModule,
		JsonpModule,
        MainModule,
        LoginModule
	],
	declarations: [
        EntryComponent
	],
	
	bootstrap: [ EntryComponent ]
})

export class EntryModule { }