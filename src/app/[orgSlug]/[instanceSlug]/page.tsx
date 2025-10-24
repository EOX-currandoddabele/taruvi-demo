'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Button, Container, Typography, Grid, IconButton, Breadcrumbs, Link } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AppsIcon from '@mui/icons-material/Apps';
import { useAppDispatch, useAppSelector } from '../../../state/hooks';
import {
  addApp,
  updateApp,
  deleteApp,
} from '../../../state/hierarchySlice';
import { HierarchyCard } from '../../../components/interfaces/Hierarchy/HierarchyCard';
import { CreateModal } from '../../../components/interfaces/Hierarchy/CreateModal';
import { EditModal } from '../../../components/interfaces/Hierarchy/EditModal';
import { DeleteConfirmationModal } from '../../../components/interfaces/Hierarchy/DeleteConfirmationModal';
import type { App } from '../../../lib/types/hierarchy';

export default function AppsPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const orgSlug = params.orgSlug as string;
  const instanceSlug = params.instanceSlug as string;

  const organization = useAppSelector((state) =>
    state.hierarchy.organizations.find((org) => org.slug === orgSlug)
  );

  const instance = organization?.instances.find((inst) => inst.slug === instanceSlug);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);

  if (!organization || !instance) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          {!organization ? 'Organization not found' : 'Instance not found'}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push(organization ? `/${orgSlug}` : '/')}
          sx={{ mt: 2 }}
        >
          Back
        </Button>
      </Container>
    );
  }

  const handleCreate = (data: { name: string; slug: string; description?: string }) => {
    dispatch(
      addApp({
        organizationId: organization.id,
        instanceId: instance.id,
        data,
      })
    );
    setCreateModalOpen(false);
  };

  const handleEdit = (data: { name: string; slug: string; description?: string }) => {
    if (selectedApp) {
      dispatch(
        updateApp({
          organizationId: organization.id,
          instanceId: instance.id,
          appId: selectedApp.id,
          data,
        })
      );
      setEditModalOpen(false);
      setSelectedApp(null);
    }
  };

  const handleDelete = () => {
    if (selectedApp) {
      dispatch(
        deleteApp({
          organizationId: organization.id,
          instanceId: instance.id,
          appId: selectedApp.id,
        })
      );
      setDeleteModalOpen(false);
      setSelectedApp(null);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <IconButton
        onClick={() => router.push(`/${orgSlug}`)}
        sx={{ mb: 2 }}
      >
        <ArrowBackIcon />
      </IconButton>

      <Breadcrumbs sx={{ mb: 2 }}>
        <Link
          component="button"
          variant="body2"
          onClick={() => router.push('/')}
          sx={{ cursor: 'pointer' }}
        >
          {organization.name}
        </Link>
        <Typography variant="body2" color="text.primary">
          {instance.name}
        </Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          justifyContent: 'space-between',
          gap: 2,
          mb: 4,
        }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Apps
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage apps for {instance.name}
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          New App
        </Button>
      </Box>

      {instance.apps.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            border: 2,
            borderStyle: 'dashed',
            borderColor: 'divider',
            borderRadius: 2,
            bgcolor: 'background.default',
          }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            No apps found
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create your first app
          </Button>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {instance.apps.map((app) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={app.id}>
              <HierarchyCard
                name={app.name}
                slug={app.slug}
                description={app.description}
                icon={<AppsIcon sx={{ fontSize: 24, color: 'white' }} />}
                navigationPath={`/${orgSlug}/${instanceSlug}/${app.slug}`}
                onEdit={() => {
                  setSelectedApp(app);
                  setEditModalOpen(true);
                }}
                onDelete={() => {
                  setSelectedApp(app);
                  setDeleteModalOpen(true);
                }}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateModal
        visible={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreate}
        entityType="App"
      />

      <EditModal
        visible={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedApp(null);
        }}
        onSubmit={handleEdit}
        entityType="App"
        initialData={selectedApp}
      />

      <DeleteConfirmationModal
        visible={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedApp(null);
        }}
        onConfirm={handleDelete}
        title="Delete App"
        description={`Are you sure you want to delete "${selectedApp?.name}"?`}
      />
    </Container>
  );
}
