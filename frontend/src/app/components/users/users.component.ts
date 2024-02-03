import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subject, debounceTime, distinctUntilChanged, map, tap } from 'rxjs';
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
  pageIndex = 1;
  disabled = false;
  pageEvent!: PageEvent;

  // filterValue!: string;

  // Model for form input value - this will always have latest value
  public inputValue!: string;
  // This value will be updated only after debounce
  public debouncedInputValue = this.inputValue;
  // Holds results
  // public people$: Subject<any> = new Subject();
  private searchDebouncer$: Subject<string> = new Subject();

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.initDataSource()
    // Setup debouncer
    this.setupSearchDebouncer();
  }

  public onSearchInputChange(term: string): void {
    // `onSearchInputChange` is called whenever the input is changed.
    // We have to send the value to debouncing observable
    this.searchDebouncer$.next(term);
  }

  private setupSearchDebouncer(): void {
    // Subscribe to `searchDebouncer$` values,
    // but pipe through `debounceTime` and `distinctUntilChanged`
    this.searchDebouncer$.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe((term: string) => {
      // Remember value after debouncing
      this.debouncedInputValue = term;

      // Do the actual search
      this.userService.paginateByName({ username: this.debouncedInputValue, page: this.pageIndex, limit: this.pageSize }).pipe(
        map((userData: UserData) => this.dataSource = userData)
      ).subscribe();
    });
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
    this.pageIndex = e.pageIndex;
    this.pageIndex = this.pageIndex + 1;

    if (this.debouncedInputValue == null) {
      this.userService.findAll({ page: this.pageIndex, limit: this.pageSize }).pipe(
        map((userData: UserData) => this.dataSource = userData)
      ).subscribe();
    } else {
      this.userService.paginateByName({ username: this.debouncedInputValue, page: this.pageIndex, limit: this.pageSize }).pipe(
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
