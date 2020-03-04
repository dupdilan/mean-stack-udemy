import { NgModule } from '@angular/core';
import { MatInputModule, MatButtonModule, MatCardModule, MatToolbarModule, MatExpansionModule, MatProgressSpinnerModule,MatGridListModule,MatPaginatorModule,MatDialogModule} from '@angular/material';


@NgModule({

  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    MatPaginatorModule,
    MatDialogModule,
  ]

})
export class AngularMaterialModule {

}
