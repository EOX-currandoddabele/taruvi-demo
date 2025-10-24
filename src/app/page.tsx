'use client';

import React, { useState } from 'react';
import { Box, Button, Container, Typography, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAppDispatch, useAppSelector } from '../state/hooks';
import {
  addOrganization,
  updateOrganization,
  deleteOrganization,
} from '../state/hierarchySlice';
import FolderIcon from '@mui/icons-material/Folder';
import { HierarchyCard } from '../components/interfaces/Hierarchy/HierarchyCard';
import { CreateModal } from '../components/interfaces/Hierarchy/CreateModal';
import { EditModal } from '../components/interfaces/Hierarchy/EditModal';
import { DeleteConfirmationModal } from '../components/interfaces/Hierarchy/DeleteConfirmationModal';
import type { Organization } from '../lib/types/hierarchy';

export default function OrganizationsPage() {
  const dispatch = useAppDispatch();
  const organizations = useAppSelector((state) => state.hierarchy.organizations);

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  const handleCreate = (data: { name: string; slug: string; description?: string }) => {
    dispatch(addOrganization(data));
    setCreateModalOpen(false);
  };

  const handleEdit = (data: { name: string; slug: string; description?: string }) => {
    if (selectedOrg) {
      dispatch(updateOrganization({ id: selectedOrg.id, data }));
      setEditModalOpen(false);
      setSelectedOrg(null);
    }
  };

  const handleDelete = () => {
    if (selectedOrg) {
      dispatch(deleteOrganization(selectedOrg.id));
      setDeleteModalOpen(false);
      setSelectedOrg(null);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
            Organizations
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your organizations and their instances
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateModalOpen(true)}
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          New Organization
        </Button>
      </Box>

      {organizations.length === 0 ? (
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
            No organizations found
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateModalOpen(true)}
          >
            Create your first organization
          </Button>
        </Box>
      ) : (
        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {organizations.map((org) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={org.id}>
              <HierarchyCard
                name={org.name}
                slug={org.slug}
                description={org.description}
                icon={<FolderIcon sx={{ fontSize: 24, color: 'white' }} />}
                navigationPath={`/${org.slug}`}
                childCount={org.instances.length}
                childLabel="instance"
                onEdit={() => {
                  setSelectedOrg(org);
                  setEditModalOpen(true);
                }}
                onDelete={() => {
                  setSelectedOrg(org);
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
        entityType="Organization"
      />

      <EditModal
        visible={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedOrg(null);
        }}
        onSubmit={handleEdit}
        entityType="Organization"
        initialData={selectedOrg}
      />

      <DeleteConfirmationModal
        visible={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedOrg(null);
        }}
        onConfirm={handleDelete}
        title="Delete Organization"
        description={`Are you sure you want to delete "${selectedOrg?.name}"? This will also delete all instances and apps within this organization.`}
      />
    </Container>
  );
}
