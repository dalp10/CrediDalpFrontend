import { NgModule } from '@angular/core';
import { LucideAngularModule } from 'lucide-angular';
import {
  Home,
  FileText,
  Settings,
  PlusCircle,
  Wallet,
  DollarSign,
  List,
  Users,
  User,
  CreditCard,
  HandCoins,
} from 'lucide';

@NgModule({
  imports: [
    LucideAngularModule.pick({
      Home,
      FileText,
      Settings,
      PlusCircle,
      Wallet,
      DollarSign,
      List,
      Users,
      User,
      CreditCard,
      HandCoins,
    }),
  ],
  exports: [LucideAngularModule],
})
export class LucideIconsModule {}
