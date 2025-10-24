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

interface CreateModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; slug: string; description?: string }) => void;
  entityType: string; // 'Organization', 'Instance', 'App'
}

export function CreateModal({
  visible,
  onClose,
  onSubmit,
  entityType,
}: CreateModalProps) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');

  // Auto-generate slug from name
  useEffect(() => {
    if (name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setSlug(generatedSlug);
    }
  }, [name]);

  const handleSubmit = () => {
    if (!name.trim() || !slug.trim()) return;

    onSubmit({
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim() || undefined,
    });

    // Reset form
    setName('');
    setSlug('');
    setDescription('');
  };

  const handleClose = () => {
    setName('');
    setSlug('');
    setDescription('');
    onClose();
  };

  const isValid = name.trim() && slug.trim();

  return (
    <Dialog open={visible} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create New {entityType}</DialogTitle>
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
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!isValid}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}
