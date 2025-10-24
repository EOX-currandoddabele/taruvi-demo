import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { mockOrganizations } from '../lib/mock-data/hierarchy';
import type { Organization, Instance, App } from '../lib/types/hierarchy';

export type { HierarchyState };

interface HierarchyState {
  organizations: Organization[];
}

const initialState: HierarchyState = {
  organizations: mockOrganizations,
};

const hierarchySlice = createSlice({
  name: 'hierarchy',
  initialState,
  reducers: {
    // Organization CRUD
    addOrganization: (state, action: PayloadAction<Omit<Organization, 'id' | 'createdAt' | 'updatedAt' | 'instances'>>) => {
      const newOrg: Organization = {
        ...action.payload,
        id: nanoid(),
        instances: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.organizations.push(newOrg);
    },

    updateOrganization: (state, action: PayloadAction<{ id: string; data: Partial<Organization> }>) => {
      const org = state.organizations.find(o => o.id === action.payload.id);
      if (org) {
        Object.assign(org, action.payload.data);
        org.updatedAt = new Date().toISOString();
      }
    },

    deleteOrganization: (state, action: PayloadAction<string>) => {
      state.organizations = state.organizations.filter(o => o.id !== action.payload);
    },

    // Instance CRUD
    addInstance: (state, action: PayloadAction<{ organizationId: string; data: Omit<Instance, 'id' | 'createdAt' | 'updatedAt' | 'apps' | 'organizationId'> }>) => {
      const org = state.organizations.find(o => o.id === action.payload.organizationId);
      if (org) {
        const newInstance: Instance = {
          ...action.payload.data,
          id: nanoid(),
          organizationId: action.payload.organizationId,
          apps: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        org.instances.push(newInstance);
        org.updatedAt = new Date().toISOString();
      }
    },

    updateInstance: (state, action: PayloadAction<{ organizationId: string; instanceId: string; data: Partial<Instance> }>) => {
      const org = state.organizations.find(o => o.id === action.payload.organizationId);
      if (org) {
        const instance = org.instances.find(i => i.id === action.payload.instanceId);
        if (instance) {
          Object.assign(instance, action.payload.data);
          instance.updatedAt = new Date().toISOString();
          org.updatedAt = new Date().toISOString();
        }
      }
    },

    deleteInstance: (state, action: PayloadAction<{ organizationId: string; instanceId: string }>) => {
      const org = state.organizations.find(o => o.id === action.payload.organizationId);
      if (org) {
        org.instances = org.instances.filter(i => i.id !== action.payload.instanceId);
        org.updatedAt = new Date().toISOString();
      }
    },

    // App CRUD
    addApp: (state, action: PayloadAction<{ organizationId: string; instanceId: string; data: Omit<App, 'id' | 'createdAt' | 'updatedAt' | 'instanceId'> }>) => {
      const org = state.organizations.find(o => o.id === action.payload.organizationId);
      if (org) {
        const instance = org.instances.find(i => i.id === action.payload.instanceId);
        if (instance) {
          const newApp: App = {
            ...action.payload.data,
            id: nanoid(),
            instanceId: action.payload.instanceId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          instance.apps.push(newApp);
          instance.updatedAt = new Date().toISOString();
          org.updatedAt = new Date().toISOString();
        }
      }
    },

    updateApp: (state, action: PayloadAction<{ organizationId: string; instanceId: string; appId: string; data: Partial<App> }>) => {
      const org = state.organizations.find(o => o.id === action.payload.organizationId);
      if (org) {
        const instance = org.instances.find(i => i.id === action.payload.instanceId);
        if (instance) {
          const app = instance.apps.find(a => a.id === action.payload.appId);
          if (app) {
            Object.assign(app, action.payload.data);
            app.updatedAt = new Date().toISOString();
            instance.updatedAt = new Date().toISOString();
            org.updatedAt = new Date().toISOString();
          }
        }
      }
    },

    deleteApp: (state, action: PayloadAction<{ organizationId: string; instanceId: string; appId: string }>) => {
      const org = state.organizations.find(o => o.id === action.payload.organizationId);
      if (org) {
        const instance = org.instances.find(i => i.id === action.payload.instanceId);
        if (instance) {
          instance.apps = instance.apps.filter(a => a.id !== action.payload.appId);
          instance.updatedAt = new Date().toISOString();
          org.updatedAt = new Date().toISOString();
        }
      }
    },
  },
});

export const {
  addOrganization,
  updateOrganization,
  deleteOrganization,
  addInstance,
  updateInstance,
  deleteInstance,
  addApp,
  updateApp,
  deleteApp,
} = hierarchySlice.actions;

export default hierarchySlice.reducer;
