import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { ValidationService } from 'src/app/services/validation.service';
@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  exportAs: 'ngForm'
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup
  submitted = false;


  constructor(public authService: AuthService, private fb: FormBuilder, ) { }

  ngOnInit(): void {
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      firstName:['', Validators.required],
      lastName:['', Validators.required],
      phoneNumber:['', Validators.required]
    },
    {
      validator: ValidationService('password', 'confirmPassword')    }
    );
  }

  get f() {
    return this.signUpForm.controls;
  }
  signUpViaEmail() {
    this.submitted = true;
    if(this.signUpForm.valid){
        this.authService.SignUp(this.signUpForm.value);
    }
  }



}
