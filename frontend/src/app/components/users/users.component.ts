import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { map, tap } from 'rxjs';
import { User } from 'src/app/services/authentication-service/authentication.service';
import { UserData, UserService } from 'src/app/services/user-service/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  dataSource!: UserData;
  displayedColumns: string[] = ['id', 'name', 'username', 'email', 'role'];

  pageSizeOptions = [2, 4, 10];
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  pageSize = 4;
  disabled = false;

  pageEvent!: PageEvent;

  filterValue!: string;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.initDataSource()
  }

  initDataSource() {
    this.userService.findAll({ page: 1, limit: this.pageSize }).pipe(
      // tap(user => console.log(user)),
      map((userData: UserData) => this.dataSource = userData)
    ).subscribe();

  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.pageSize = e.pageSize;
    let pageIndex = e.pageIndex;
    pageIndex = pageIndex + 1;

    if (this.filterValue == null) {
      this.userService.findAll({ page: pageIndex, limit: this.pageSize }).pipe(
        map((userData: UserData) => this.dataSource = userData)
      ).subscribe();
    } else {
      this.userService.paginateByName({ username: this.filterValue, page: pageIndex, limit: this.pageSize }).pipe(
        map((userData: UserData) => this.dataSource = userData)
      ).subscribe();
    }

  }

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  findByName(username: string) {
    this.userService.paginateByName({ page: 1, limit: 10, username: username }).pipe(
      map((userData: UserData) => this.dataSource = userData)
    ).subscribe();
  }

}
