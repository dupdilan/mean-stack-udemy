import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    // selector: 'selector-name',
    templateUrl: './error.component.html'
})

export class ErrorComponent implements OnInit {
    constructor(@Inject(MAT_DIALOG_DATA) public data : {message: string} ) { }

    ngOnInit() { }
  message = "An unkonwn error!";

}
