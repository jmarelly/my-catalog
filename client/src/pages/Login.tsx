import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
} from '@mui/material';
import { Login as LoginIcon } from '@mui/icons-material';
import { useAuth } from '../hooks/useAuth';
import { useValidationErrors } from '../hooks/useValidationErrors';
import { loginSchema } from '../schemas/auth.schema';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { processZodErrorWithFallback } = useValidationErrors();
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const validated = loginSchema.parse({ username, password });
      await login(validated.username, validated.password);
      navigate('/admin');
    } catch (err) {
      const errors = processZodErrorWithFallback(err, {
        general: 'Invalid username or password',
      });
      setErrors(errors);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 200px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card sx={{ width: '100%', maxWidth: 400 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom fontWeight={700}>
            Welcome Back
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            {errors.general && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errors.general}
              </Alert>
            )}

            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={e => setUsername(e.target.value)}
              margin="normal"
              autoFocus
              error={!!errors.username}
              helperText={errors.username}
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              value={password}
              onChange={e => setPassword(e.target.value)}
              margin="normal"
              error={!!errors.password}
              helperText={errors.password}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
              startIcon={<LoginIcon />}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Typography variant="body2" align="center" color="text.secondary">
              Username: admin | Password: admin123
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
