import {HttpClient, HttpClientModule} from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [RouterOutlet, HttpClientModule],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
    title = "atom-challenge-fe-template";
    content = "This is the content of the app component";

    constructor(
        public httpClient: HttpClient,
    ) {
    }

    ngOnInit() {
        this.httpClient.get("/api/hello").subscribe((response) => {
            this.content = response.toString();
        });
    }
}
