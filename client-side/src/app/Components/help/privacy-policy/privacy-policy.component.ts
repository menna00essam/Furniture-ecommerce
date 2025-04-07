import { Component } from '@angular/core';
import { HeaderBannerComponent } from '../../shared/header-banner/header-banner.component';
import { FeatureBannerComponent } from '../../shared/feature-banner/feature-banner.component';

@Component({
  selector: 'app-privacy-policy',
  imports: [HeaderBannerComponent, FeatureBannerComponent],
  templateUrl: './privacy-policy.component.html',
})
export class PrivacyPolicyComponent {}
