/*
 * Public API Surface of searchkit-angular
 */

// Core Service, Module
// Types are embedded in searchkit.service.ts as a workaround for file system issues.
// Consumers can import types from the service file if needed, or types can be re-exported properly later.
// export * from './lib/types';
export * from './lib/searchkit.service';
export * from './lib/searchkit-http-backend.service';
export * from './lib/searchkit.module';

// UI Components
export * from './lib/components/search-box/search-box.component';
export * from './lib/components/results-list/results-list.component';
export * from './lib/components/facet-filter/facet-filter.component';
