import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../models/user.entity';
import { Repository } from 'typeorm';
import { Observable, catchError, from, switchMap, throwError, map } from 'rxjs';
import { User, UserRole } from '../models/user.interface';
import { AuthService } from 'src/auth/service/auth.service';
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';


@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService,
    ) { }

    create(user: User): Observable<User> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.name = user.name;
                newUser.username = user.username;
                newUser.email = user.email;
                newUser.password = passwordHash;
                newUser.role = UserRole.USER;
                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const { password, ...result } = user;
                        return result;
                    }), catchError(err => throwError(err))
                );

            })
        )
    }

    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOneBy({ id })).pipe(
            map((user: User) => {
                const { password, ...result } = user;
                return result;
            }), catchError(err => throwError(err))
        );
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach(function (v) { delete v.password });
                return users;
            })
        );
    }

    paginate(options: IPaginationOptions): Observable<Pagination<User>> {
        return from(paginate<User>(this.userRepository, options)).pipe(
            map((usersPageable: Pagination<User>) => {
                console.log("usersPageable ", usersPageable);
                usersPageable.items.forEach(function (v) { delete v.password })
                return usersPageable;
            })
        )
    }

    deleteOne(id: number): Observable<any> {
        return from(this.userRepository.delete(id));
    }

    updateOne(id: number, user: User): Observable<any> {
        delete user.email;
        delete user.password;
        delete user.role;
        return from(this.userRepository.update(id, user));
    }

    updateRoleOfUser(id: number, user: User): Observable<any> {
        const newUser = new UserEntity();
        newUser.role = user.role;
        return from(this.userRepository.update(id, newUser));
    }

    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => {
                if (user) {
                    return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt))
                } else {
                    return 'Wrong Credential'
                }
            })
        )
    }

    validateUser(email: string, password: string): Observable<User> {
        return this.findByEmail(email).pipe(
            switchMap((user: User) => this.authService.comparePassword(password, user.password).pipe(
                map((match: boolean) => {
                    if (match) {
                        const { password, ...result } = user;
                        return result;
                    } else {
                        throw Error;
                    }
                })
            )
            )
        )
    }

    findByEmail(email: string): Observable<User> {
        return from(this.userRepository.findOneBy({ email }));
    }

}
