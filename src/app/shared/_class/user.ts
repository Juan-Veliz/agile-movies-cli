import { FormControl, FormGroup, Validators } from "@angular/forms";

export class User {
    username?:string;
    password?:string;
    firstName?:string;
    lastName?:String;
    email?:String;
    createdAlt?:String;

    constructor(user:User){
        this.username = user?.username;
        this.password = user?.password;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.email = user.email;
    }

    static formControl(user: User){
        return new FormGroup({
            username: new FormControl(user.username, [ Validators.required, Validators.minLength(2), Validators.maxLength(50)]),
            password: new FormControl(user.password, [ Validators.required, Validators.minLength(2), Validators.maxLength(16)])
          });
    }
}
