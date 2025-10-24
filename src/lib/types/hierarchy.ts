export interface App {
  id: string;
  name: string;
  slug: string;
  description?: string;
  instanceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Instance {
  id: string;
  name: string;
  slug: string;
  description?: string;
  organizationId: string;
  apps: App[];
  createdAt: string;
  updatedAt: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description?: string;
  instances: Instance[];
  createdAt: string;
  updatedAt: string;
}
