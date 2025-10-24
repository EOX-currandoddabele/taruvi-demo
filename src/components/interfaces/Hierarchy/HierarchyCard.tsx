'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface HierarchyCardProps {
  name: string;
  slug: string;
  description?: string;
  icon: React.ReactNode;
  navigationPath: string;
  childCount?: number;
  childLabel?: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function HierarchyCard({
  name,
  slug,
  description,
  icon,
  navigationPath,
  childCount,
  childLabel,
  onEdit,
  onDelete,
}: HierarchyCardProps) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.action-buttons')) {
      return;
    }
    router.push(navigationPath);
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.2s',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: 3,
          '& .action-buttons': {
            opacity: 1,
          },
        },
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            width: { xs: 40, sm: 48 },
            height: { xs: 40, sm: 48 },
            borderRadius: 2,
            bgcolor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          noWrap
          sx={{ fontWeight: 600 }}
        >
          {name}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, fontFamily: 'monospace' }}
        >
          {slug}
        </Typography>

        {description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 2,
            }}
          >
            {description}
          </Typography>
        )}

        <Box
          className="action-buttons"
          sx={{
            display: 'flex',
            gap: 1,
            opacity: 0,
            transition: 'opacity 0.2s',
          }}
        >
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            sx={{ color: 'primary.main' }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </CardContent>

      {childCount !== undefined && childLabel && (
        <CardActions
          sx={{
            borderTop: 1,
            borderColor: 'divider',
            pt: 1.5,
            px: { xs: 2, sm: 3 },
            mt: 'auto',
          }}
        >
          <Chip
            label={`${childCount} ${childLabel}${childCount !== 1 ? 's' : ''}`}
            size="small"
            variant="outlined"
          />
        </CardActions>
      )}
    </Card>
  );
}
