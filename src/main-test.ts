import './polyfills';

// jasmine staff
declare var jasmine;
// import jasmineRequire from 'jasmine-core/lib/jasmine-core/jasmine.js';
// window['jasmineRequire'] = jasmineRequire;
import 'jasmine-core/lib/jasmine-core/jasmine-html.js';
import 'jasmine-core/lib/jasmine-core/boot.js';

// zone.js testing imports
import 'zone.js/dist/zone-testing'; // instead all commented files below
// import 'zone.js/dist/async-test';
// import 'zone.js/dist/fake-async-test';
// import 'zone.js/dist/long-stack-trace-zone';
// import 'zone.js/dist/proxy.js';
// import 'zone.js/dist/sync-test';
// import 'zone.js/dist/jasmine-patch';

// import testBed and Angular staff
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';

// Spec files to include in the Stackblitz tests
import './app/app.component.spec.ts';


// get fresh instance of jasmine and 
bootstrap();

function bootstrap () {
  // this looks like workaround to get 100% fresh clear run. 
  // window['jasmineRef'] does nothing - it is just a flag 
  // if it is not defined - we have clear run
  // if not - lets reload
  if (window['jasmineRef']) { 
    location.reload();
    return;
  } else {
    window.onload(undefined); // overwrited by jasmine, initialize env    
    window['jasmineRef'] = jasmine.getEnv();
  }

  // Initialize the Angular testing environment.
  getTestBed().initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );
}