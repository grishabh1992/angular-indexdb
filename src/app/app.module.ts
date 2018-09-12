import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { IndexDbServiceService } from './index-db.service.service';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule, FormsModule, ReactiveFormsModule
  ],
  providers: [IndexDbServiceService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
