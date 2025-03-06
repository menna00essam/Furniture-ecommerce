import { Component, OnInit } from '@angular/core';
import { UserService } from '../../Services/user.service';
import { user } from '../../models/user.model';
import { InputComponent } from '../shared/input/input.component';
import { ButtonComponent } from '../shared/button/button.component';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  imports: [InputComponent, ButtonComponent, RouterOutlet],
})
export class ProfileComponent implements OnInit {
  user!: user;
  isChecked: boolean = false;
  activeComponent: string = 'orders';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.userService.getUser();
  }
  toggleCheck() {
    console.log(5);
    this.isChecked = !this.isChecked;
  }
  route(r: string) {
    this.activeComponent = r;
    this.router.navigate([`/profile/${r}`]);
  }
}
