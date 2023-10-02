import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MomentModule } from 'angular2-moment';

// Rutas
import { MessagesRoutingModule } from './messages-routing.module';

// Componenentes
import { MainComponent } from './components/main/main.component';
import { SendComponent } from './components/send/send.component';
import { ReceivedComponent } from './components/received/received.component';
import { SendedComponent } from './components/sended/sended.component';

// Servicios
import { UserService } from './../services/user.service';
import { UserGuard } from './../services/user.guard';

@NgModule({
  declarations: [
    MainComponent,
    SendComponent,
    ReceivedComponent,
    SendedComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MomentModule,
    MessagesRoutingModule
  ],
  exports: [
    MainComponent,
    SendComponent,
    ReceivedComponent,
    SendedComponent
  ],
  providers: [UserService, UserGuard]
})
export class MessagesModule { }
