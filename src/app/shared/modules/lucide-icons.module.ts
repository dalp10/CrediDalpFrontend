// src/app/shared/modules/lucide-icons.module.ts
import { NgModule } from '@angular/core';
import { LucideAngularModule, Home, Users, User, HandCoins } from 'lucide-angular';

@NgModule({
  imports: [
    LucideAngularModule.pick({
      Home,
      Users,
      User,
      HandCoins,
    }),
  ],
  exports: [LucideAngularModule],
})
export class LucideIconsModule {}
