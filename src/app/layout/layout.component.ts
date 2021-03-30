import { Component, OnInit } from '@angular/core';
import { RoleService } from '@core/services/role.service';


@Component({
  selector: 'kt-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(
    private roleService: RoleService,
  ) { }


  ngOnInit() {
    this.roleService.resolveRouteByRole();
  }

}
