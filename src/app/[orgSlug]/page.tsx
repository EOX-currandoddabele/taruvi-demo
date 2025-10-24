'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Button, Container, Typography, Grid, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StorageIcon from '@mui/icons-material/Storage';
import { useAppDispatch, useAppSelector } from '../../state/hooks';
import {
  addInstance,
  updateInstance,
  deleteInstance,
} from '../../state/hierarchySlice';
import { HierarchyCard } from '../../components/interfaces/Hierarchy/HierarchyCard';
import { CreateModal } from '../../components/interfaces/Hierarchy/CreateModal';
import { EditModal } from '../../components/interfaces/Hierarchy/EditModal';
import { DeleteConfirmationModal } from '../../components/interfaces/Hierarchy/DeleteConfirmationModal';
import type { Instance } from '../../lib/types/hierarchy';

export default function InstancesPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const orgSlug = params.orgSlug as string;

  const organization = useAppSelector((state) =>
    state.hierarchy.organizations.find((org) => org.slug === orgSlug)
  );

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedInstance, setSelectedInstance] = useState<Instance | null>(null);

  if (!organization) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          Organization not found
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push('/')}
          sx={{ mt: 2 }}
        >
          Back to Organizations
        </Button>
      </Container>
    );
  }

  const handleCreate = (data: { name: string; slug: string; description?: string }) => {
    dispatch(addInstance({ organizationId: organization.id, data }));
    setCreateModalOpen(false);
  };

  const handleEdit = (data: { name: string; slug: string; description?: string }) => {
    if (selectedInstance) {
      dispatch(
        updateInstance({
          organizationId: organization.id,
          instanceId: selectedInstance.id,
          data,
        })
      );
      setEditModalOpen(false);
      setSelectedInstance(null);
    }
  };

  const handleDelete = () => {
    if (selectedInstance) {
      dispatch(
        deleteInstance({
          organizationId: organization.id,
          instanceId: selectedInstance.id,
        })
      );
      setDeleteModalOpen(false);
      setSelectedInstance(null);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <IconButton
        onClick={() => router.push('/')}
        sx={{ mb: 2 }}
      >
        <ArrowBackIcon />
      </IconButton>

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
            {organization.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage instances for this organization
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          New Instance
        </Button>
      </Box>

      {organization.instances.length === 0 ? (
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
            No instances found
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create your first instance
          </Button>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {organization.instances.map((instance) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={instance.id}>
              <HierarchyCard
                name={instance.name}
                slug={instance.slug}
                description={instance.description}
                icon={<StorageIcon sx={{ fontSize: 24, color: 'white' }} />}
                navigationPath={`/${orgSlug}/${instance.slug}`}
                childCount={instance.apps.length}
                childLabel="app"
                onEdit={() => {
                  setSelectedInstance(instance);
                  setEditModalOpen(true);
                }}
                onDelete={() => {
                  setSelectedInstance(instance);
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
        entityType="Instance"
      />

      <EditModal
        visible={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedInstance(null);
        }}
        onSubmit={handleEdit}
        entityType="Instance"
        initialData={selectedInstance}
      />

      <DeleteConfirmationModal
        visible={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedInstance(null);
        }}
        onConfirm={handleDelete}
        title="Delete Instance"
        description={`Are you sure you want to delete "${selectedInstance?.name}"? This will also delete all apps within this instance.`}
      />
    </Container>
  );
}
