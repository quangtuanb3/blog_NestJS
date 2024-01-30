import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { map, tap } from 'rxjs';
import { UserData, UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  dataSource!: UserData;
  displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role'];
  
  pageSizeOptions = [1, 2, 3];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;

  pageEvent!: PageEvent;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.initDataSource()
  }

  initDataSource() {
    this.userService.findAll({ page: 1, limit: 1 }).pipe(
      tap(user => console.log(user)),
      map((userData: UserData) => this.dataSource = userData)
    ).subscribe();

  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    let pageSize = e.pageSize;
    let pageIndex = e.pageIndex;
    pageIndex = pageIndex + 1;

    this.userService.findAll({ page: pageIndex, limit: pageSize }).pipe(
      map((userData: UserData) => this.dataSource = userData)
    ).subscribe();
  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

}
