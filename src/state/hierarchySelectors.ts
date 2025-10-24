import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from './store';

export const selectOrganizations = (state: RootState) => state.hierarchy.organizations;

export const selectOrganizationBySlug = createSelector(
  [selectOrganizations, (_state: RootState, slug: string) => slug],
  (organizations, slug) => organizations.find(org => org.slug === slug)
);

export const selectInstanceBySlug = createSelector(
  [
    selectOrganizations,
    (_state: RootState, orgSlug: string) => orgSlug,
    (_state: RootState, _orgSlug: string, instanceSlug: string) => instanceSlug,
  ],
  (organizations, orgSlug, instanceSlug) => {
    const org = organizations.find(o => o.slug === orgSlug);
    if (!org) return undefined;
    return org.instances.find(i => i.slug === instanceSlug);
  }
);

export const selectAppBySlug = createSelector(
  [
    selectOrganizations,
    (_state: RootState, orgSlug: string) => orgSlug,
    (_state: RootState, _orgSlug: string, instanceSlug: string) => instanceSlug,
    (_state: RootState, _orgSlug: string, _instanceSlug: string, appSlug: string) => appSlug,
  ],
  (organizations, orgSlug, instanceSlug, appSlug) => {
    const org = organizations.find(o => o.slug === orgSlug);
    if (!org) return undefined;
    const instance = org.instances.find(i => i.slug === instanceSlug);
    if (!instance) return undefined;
    return instance.apps.find(a => a.slug === appSlug);
  }
);
