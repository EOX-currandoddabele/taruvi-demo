'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; slug: string; description?: string }) => void;
  entityType: string; // 'Organization', 'Instance', 'App'
  initialData: {
    name: string;
    slug: string;
    description?: string;
  } | null;
}

export function EditModal({
  visible,
  onClose,
  onSubmit,
  entityType,
  initialData,
}: EditModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  // Pre-fill form with existing data
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSlug(initialData.slug);
      setDescription(initialData.description || '');
    }
  }, [initialData]);

  const handleSubmit = () => {
    if (!name.trim() || !slug.trim()) return;

    onSubmit({
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || undefined,
    });
  };

  const isValid = name.trim() && slug.trim();

  return (
    <Dialog open={visible} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit {entityType}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            autoFocus
          />
          <TextField
            label="Slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            fullWidth
            helperText="URL-friendly identifier"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={3}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!isValid}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
