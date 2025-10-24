'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Typography,
  IconButton,
  Breadcrumbs,
  Link,
  Card,
  CardContent,
  Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useAppSelector } from '../../../../state/hooks';

export default function AppDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orgSlug = params.orgSlug as string;
  const instanceSlug = params.instanceSlug as string;
  const appSlug = params.appSlug as string;

  const organization = useAppSelector((state) =>
    state.hierarchy.organizations.find((org) => org.slug === orgSlug)
  );

  const instance = organization?.instances.find((inst) => inst.slug === instanceSlug);
  const app = instance?.apps.find((a) => a.slug === appSlug);

  if (!organization || !instance || !app) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h5" color="error">
          {!organization
            ? 'Organization not found'
            : !instance
            ? 'Instance not found'
            : 'App not found'}
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() =>
            router.push(
              !organization
                ? '/'
                : !instance
                ? `/${orgSlug}`
                : `/${orgSlug}/${instanceSlug}`
            )
          }
          sx={{ mt: 2 }}
        >
          Back
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <IconButton
        onClick={() => router.push(`/${orgSlug}/${instanceSlug}`)}
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
        <Link
          component="button"
          variant="body2"
          onClick={() => router.push(`/${orgSlug}`)}
          sx={{ cursor: 'pointer' }}
        >
          {instance.name}
        </Link>
        <Typography variant="body2" color="text.primary">
          {app.name}
        </Typography>
      </Breadcrumbs>

      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        {app.name}
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                App Information
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {app.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Slug
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, fontFamily: 'monospace' }}>
                  {app.slug}
                </Typography>

                {app.description && (
                  <>
                    <Typography variant="body2" color="text.secondary">
                      Description
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                      {app.description}
                    </Typography>
                  </>
                )}

                <Typography variant="body2" color="text.secondary">
                  Instance
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {instance.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Organization
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {organization.name}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {new Date(app.createdAt).toLocaleString()}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Last Updated
                </Typography>
                <Typography variant="body1">
                  {new Date(app.updatedAt).toLocaleString()}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Placeholder Content
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This is a placeholder for future app-specific content and functionality.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
