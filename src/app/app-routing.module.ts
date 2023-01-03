import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent

},
{
    path: "about",
    component: AboutComponent
},
{
    path: 'courses/:id',
    component: CourseComponent,
    resolve: {
        course: CourseResolver
    }
},
{
    path: "**",
    redirectTo: '/'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
