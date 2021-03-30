import { Component, OnInit } from '@angular/core';
import { LoaderService } from '@core/services';

@Component({
  selector: 'kt-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  isLoading = false;
  constructor(private loaderService: LoaderService) { }

  ngOnInit() {
    this.loaderService.isLoading.subscribe((response) => {
      setTimeout (() => this.isLoading = response, 0);
    });
  }

}
