import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { csrf } from 'npm:hono/csrf'
import { createClient } from 'npm:@supabase/supabase-js'
import * as kv from './kv_store.tsx'
import { getIoTService } from './iot_service.tsx'

const app = new Hono()

// Middleware
app.use('*', cors())
app.use('*', logger(console.log))
app.use('*', csrf())

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
)

// Helper function to verify admin access
async function verifyAdmin(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { error: 'No authorization token provided', user: null };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return { error: 'Invalid token', user: null };
  }
  
  // Check if user is admin from metadata or a dedicated table
  const userRole = user.user_metadata?.role || 'client';
  if (userRole !== 'admin') {
    return { error: 'Admin access required', user: null };
  }
  
  return { error: null, user };
}

// Helper function to verify any authenticated user
async function verifyUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { error: 'No authorization token provided', user: null };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return { error: 'Invalid token', user: null };
  }
  
  return { error: null, user };
}

// Helper function to sanitize input
function sanitizeInput(input: string): string {
  return input.replace(/[<>"'&]/g, (match) => {
    const entities: { [key: string]: string } = {
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '&': '&amp;'
    };
    return entities[match] || match;
  });
}

// Helper function to log audit events
async function logAuditEvent(userId: string, username: string, action: string, target: string, details: string, ipAddress: string, userAgent: string) {
  try {
    const auditEvent = {
      user_id: sanitizeInput(userId),
      username: sanitizeInput(username),
      action: sanitizeInput(action),
      target: sanitizeInput(target),
      details: sanitizeInput(details),
      ip_address: sanitizeInput(ipAddress),
      user_agent: sanitizeInput(userAgent),
      timestamp: new Date().toISOString(),
      severity: action.includes('DELETE') ? 'warning' : action.includes('FAIL') ? 'error' : 'info'
    };
    
    await kv.set(`audit_log:${Date.now()}:${userId}`, auditEvent);
    console.log('Audit event logged:', auditEvent);
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}

// Initialize storage buckets on startup
async function initializeStorage() {
  try {
    const bucketName = 'make-cf230d31-models';
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (!bucketExists) {
      const { error } = await supabase.storage.createBucket(bucketName, { public: false });
      if (error) {
        console.error('Error creating storage bucket:', error);
      } else {
        console.log('Storage bucket created successfully');
      }
    }
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
}

// Initialize on startup
initializeStorage();

// Routes

// Health check
app.get('/make-server-cf230d31/health', async (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Scene persistence endpoints for Babylon.js workspace

// Save scene state
app.post('/api/scenes/:roomId', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const roomId = c.req.param('roomId');
    const { sceneData, thumbnail } = await c.req.json();

    const sceneKey = `scene:${roomId}`;
    const sceneInfo = {
      id: roomId,
      data: sceneData,
      thumbnail,
      lastModified: new Date().toISOString(),
      lastModifiedBy: user.id,
      lastModifiedByUsername: user.user_metadata?.username || user.email,
      version: Date.now()
    };

    await kv.set(sceneKey, sceneInfo);

    // Log audit event
    await logAuditEvent(
      user.id,
      user.user_metadata?.username || user.email,
      'SCENE_SAVED',
      roomId,
      `Saved scene state for room: ${sanitizeInput(roomId)}`,
      c.req.header('cf-connecting-ip') || 'unknown',
      c.req.header('user-agent') || 'unknown'
    );

    return c.json({
      message: 'Scene saved successfully',
      scene: sceneInfo
    });

  } catch (error) {
    console.error('Scene save error:', error);
    return c.json({ error: 'Failed to save scene' }, 500);
  }
});

// Load scene state
app.get('/api/scenes/:roomId', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const roomId = c.req.param('roomId');
    const sceneKey = `scene:${roomId}`;
    const scene = await kv.get(sceneKey);

    if (!scene) {
      return c.json({ error: 'Scene not found' }, 404);
    }

    // Log audit event
    await logAuditEvent(
      user.id,
      user.user_metadata?.username || user.email,
      'SCENE_LOADED',
      sanitizeInput(roomId),
      `Loaded scene state for room: ${sanitizeInput(roomId)}`,
      c.req.header('cf-connecting-ip') || 'unknown',
      c.req.header('user-agent') || 'unknown'
    );

    return c.json({ scene });

  } catch (error) {
    console.error('Scene load error:', error);
    return c.json({ error: 'Failed to load scene' }, 500);
  }
});

// List user's scenes
app.get('/api/scenes', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const allScenes = await kv.getByPrefix('scene:');
    const userScenes = allScenes.filter(scene =>
      scene.lastModifiedBy === user.id
    );

    return c.json({ scenes: userScenes });

  } catch (error) {
    console.error('Scenes list error:', error);
    return c.json({ error: 'Failed to list scenes' }, 500);
  }
});

// Delete scene
app.delete('/api/scenes/:roomId', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const roomId = c.req.param('roomId');
    const sceneKey = `scene:${roomId}`;
    const scene = await kv.get(sceneKey);

    if (!scene) {
      return c.json({ error: 'Scene not found' }, 404);
    }

    // Check if user owns the scene
    if (scene.lastModifiedBy !== user.id) {
      return c.json({ error: 'Access denied' }, 403);
    }

    await kv.del(sceneKey);

    // Log audit event
    await logAuditEvent(
      user.id,
      user.user_metadata?.username || user.email,
      'SCENE_DELETED',
      roomId,
      `Deleted scene: ${roomId}`,
      c.req.header('cf-connecting-ip') || 'unknown',
      c.req.header('user-agent') || 'unknown'
    );

    return c.json({ message: 'Scene deleted successfully' });

  } catch (error) {
    console.error('Scene delete error:', error);
    return c.json({ error: 'Failed to delete scene' }, 500);
  }
});

// Get scene versions/history (for future implementation)
app.get('/api/scenes/:roomId/versions', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const roomId = c.req.param('roomId');
    const versions = await kv.getByPrefix(`scene_version:${roomId}:`);

    return c.json({ versions });

  } catch (error) {
    console.error('Scene versions error:', error);
    return c.json({ error: 'Failed to get scene versions' }, 500);
  }
});

// Authentication routes
app.post('/make-server-cf230d31/signup', async (c) => {
  try {
    const body = await c.req.json();
    const { name, username, email, password, role = 'client' } = body;
    
    if (!name || !username || !email || !password) {
      return c.json({ error: 'Missing required fields' }, 400);
    }
    
    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name, 
        username, 
        role 
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });
    
    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }
    
    // Store additional user data in KV store
    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      name,
      username,
      email,
      role,
      createdAt: new Date().toISOString(),
      assignedModels: [],
      lastActive: new Date().toISOString()
    });
    
    // Log audit event
    await logAuditEvent(
      data.user.id, 
      username, 
      'USER_CREATED', 
      username, 
      `New ${role} account created`, 
      c.req.header('cf-connecting-ip') || 'unknown',
      c.req.header('user-agent') || 'unknown'
    );
    
    return c.json({ 
      message: 'User created successfully', 
      user: { 
        id: data.user.id, 
        name, 
        username, 
        email, 
        role 
      } 
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get current user profile
app.get('/make-server-cf230d31/profile', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);
  
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const userData = await kv.get(`user:${user.id}`);
    return c.json({ user: userData || user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Upload model (Admin only)
app.post('/make-server-cf230d31/upload-model', async (c) => {
  const { error, user } = await verifyAdmin(c.req.raw);
  
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const tags = formData.get('tags') as string;
    const assignedClients = JSON.parse(formData.get('assignedClients') as string || '[]');
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }
    
    // Upload file to Supabase Storage
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `models/${fileName}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('make-cf230d31-models')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: 'Failed to upload file' }, 500);
    }
    
    // Create signed URL for access
    const { data: signedUrlData } = await supabase.storage
      .from('make-cf230d31-models')
      .createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1 year expiry
    
    // Store model metadata
    const modelId = `model_${Date.now()}`;
    const modelData = {
      id: modelId,
      name: title,
      description,
      tags: tags.split(',').map(tag => tag.trim()),
      fileName,
      filePath,
      fileSize: file.size,
      format: file.name.split('.').pop()?.toLowerCase(),
      uploadedBy: user.id,
      uploadedByUsername: user.user_metadata?.username || 'admin',
      assignedClients,
      uploadDate: new Date().toISOString(),
      views: 0,
      signedUrl: signedUrlData?.signedUrl
    };
    
    await kv.set(`model:${modelId}`, modelData);
    
    // Update assigned clients
    for (const clientUsername of assignedClients) {
      const clients = await kv.getByPrefix('user:');
      const client = clients.find(c => c.username === clientUsername);
      if (client) {
        client.assignedModels = client.assignedModels || [];
        client.assignedModels.push(modelId);
        await kv.set(`user:${client.id}`, client);
      }
    }
    
    // Log audit event
    await logAuditEvent(
      user.id,
      user.user_metadata?.username || 'admin',
      'MODEL_UPLOADED',
      title,
      `Uploaded model: ${title} (${file.size} bytes)`,
      c.req.header('cf-connecting-ip') || 'unknown',
      c.req.header('user-agent') || 'unknown'
    );
    
    return c.json({ 
      message: 'Model uploaded successfully', 
      model: modelData 
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get models (different for admin vs client)
app.get('/make-server-cf230d31/models', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);
  
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const allModels = await kv.getByPrefix('model:');
    const userRole = user.user_metadata?.role || 'client';
    
    let models = [];
    
    if (userRole === 'admin') {
      // Admin can see all models
      models = allModels;
    } else {
      // Client can only see assigned models
      const userData = await kv.get(`user:${user.id}`);
      const assignedModelIds = userData?.assignedModels || [];
      models = allModels.filter(model => 
        model.assignedClients.includes(user.user_metadata?.username) ||
        assignedModelIds.includes(model.id)
      );
    }
    
    // Refresh signed URLs if needed
    for (const model of models) {
      if (!model.signedUrl) {
        const { data: signedUrlData } = await supabase.storage
          .from('make-cf230d31-models')
          .createSignedUrl(model.filePath, 60 * 60 * 24 * 365);
        
        if (signedUrlData?.signedUrl) {
          model.signedUrl = signedUrlData.signedUrl;
          await kv.set(`model:${model.id}`, model);
        }
      }
    }
    
    return c.json({ models });
    
  } catch (error) {
    console.error('Models fetch error:', error);
    return c.json({ error: 'Failed to fetch models' }, 500);
  }
});

// Delete model (Admin only)
app.delete('/make-server-cf230d31/models/:id', async (c) => {
  const { error, user } = await verifyAdmin(c.req.raw);
  
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const modelId = c.req.param('id');
    const model = await kv.get(`model:${modelId}`);
    
    if (!model) {
      return c.json({ error: 'Model not found' }, 404);
    }
    
    // Delete from storage
    const { error: deleteError } = await supabase.storage
      .from('make-cf230d31-models')
      .remove([model.filePath]);
    
    if (deleteError) {
      console.error('Storage delete error:', deleteError);
    }
    
    // Remove from KV store
    await kv.del(`model:${modelId}`);
    
    // Remove from assigned clients
    const allUsers = await kv.getByPrefix('user:');
    for (const userData of allUsers) {
      if (userData.assignedModels && userData.assignedModels.includes(modelId)) {
        userData.assignedModels = userData.assignedModels.filter(id => id !== modelId);
        await kv.set(`user:${userData.id}`, userData);
      }
    }
    
    // Log audit event
    await logAuditEvent(
      user.id,
      user.user_metadata?.username || 'admin',
      'MODEL_DELETED',
      model.name,
      `Deleted model: ${model.name}`,
      c.req.header('cf-connecting-ip') || 'unknown',
      c.req.header('user-agent') || 'unknown'
    );
    
    return c.json({ message: 'Model deleted successfully' });
    
  } catch (error) {
    console.error('Delete error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get clients (Admin only)
app.get('/make-server-cf230d31/clients', async (c) => {
  const { error, user } = await verifyAdmin(c.req.raw);
  
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const allUsers = await kv.getByPrefix('user:');
    const clients = allUsers.filter(userData => userData.role === 'client');
    
    return c.json({ clients });
    
  } catch (error) {
    console.error('Clients fetch error:', error);
    return c.json({ error: 'Failed to fetch clients' }, 500);
  }
});

// Assign model to client (Admin only)
app.post('/make-server-cf230d31/assign-model', async (c) => {
  const { error, user } = await verifyAdmin(c.req.raw);
  
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const { modelId, clientUsernames } = await c.req.json();
    
    const model = await kv.get(`model:${modelId}`);
    if (!model) {
      return c.json({ error: 'Model not found' }, 404);
    }
    
    // Update model's assigned clients
    model.assignedClients = clientUsernames;
    await kv.set(`model:${modelId}`, model);
    
    // Update clients' assigned models
    const allUsers = await kv.getByPrefix('user:');
    for (const userData of allUsers) {
      if (userData.role === 'client') {
        userData.assignedModels = userData.assignedModels || [];
        
        if (clientUsernames.includes(userData.username)) {
          // Add model if not already assigned
          if (!userData.assignedModels.includes(modelId)) {
            userData.assignedModels.push(modelId);
          }
        } else {
          // Remove model if previously assigned
          userData.assignedModels = userData.assignedModels.filter(id => id !== modelId);
        }
        
        await kv.set(`user:${userData.id}`, userData);
      }
    }
    
    // Log audit event
    await logAuditEvent(
      user.id,
      user.user_metadata?.username || 'admin',
      'MODEL_ASSIGNED',
      `${sanitizeInput(model.name)} → ${clientUsernames.map(sanitizeInput).join(', ')}`,
      `Assigned model to clients: ${clientUsernames.map(sanitizeInput).join(', ')}`,
      c.req.header('cf-connecting-ip') || 'unknown',
      c.req.header('user-agent') || 'unknown'
    );
    
    return c.json({ message: 'Model assigned successfully' });
    
  } catch (error) {
    console.error('Assignment error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get audit logs (Admin only)
app.get('/make-server-cf230d31/audit-logs', async (c) => {
  const { error, user } = await verifyAdmin(c.req.raw);
  
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const logs = await kv.getByPrefix('audit_log:');
    
    // Sort by timestamp (most recent first)
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return c.json({ logs });
    
  } catch (error) {
    console.error('Audit logs fetch error:', error);
    return c.json({ error: 'Failed to fetch audit logs' }, 500);
  }
});

// Update model view count
app.post('/make-server-cf230d31/models/:id/view', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);
  
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const modelId = c.req.param('id');
    const model = await kv.get(`model:${modelId}`);
    
    if (!model) {
      return c.json({ error: 'Model not found' }, 404);
    }
    
    // Check if user has access to this model
    const userRole = user.user_metadata?.role || 'client';
    if (userRole !== 'admin' && !model.assignedClients.includes(user.user_metadata?.username)) {
      return c.json({ error: 'Access denied' }, 403);
    }
    
    // Increment view count
    model.views = (model.views || 0) + 1;
    await kv.set(`model:${modelId}`, model);
    
    // Log audit event
    await logAuditEvent(
      user.id,
      user.user_metadata?.username || 'user',
      'MODEL_VIEWED',
      model.name,
      `Viewed model in workspace`,
      c.req.header('cf-connecting-ip') || 'unknown',
      c.req.header('user-agent') || 'unknown'
    );
    
    return c.json({ message: 'View recorded', views: model.views });
    
  } catch (error) {
    console.error('View update error:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// System stats (Admin only)
app.get('/make-server-cf230d31/stats', async (c) => {
  const { error, user } = await verifyAdmin(c.req.raw);
  
  if (error) {
    return c.json({ error }, 401);
  }
  
  try {
    const models = await kv.getByPrefix('model:');
    const users = await kv.getByPrefix('user:');
    const clients = users.filter(u => u.role === 'client');
    const logs = await kv.getByPrefix('audit_log:');
    
    const totalSize = models.reduce((sum, model) => sum + (model.fileSize || 0), 0);
    const recentLogs = logs.filter(log => {
      const logTime = new Date(log.timestamp).getTime();
      const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
      return logTime > oneDayAgo;
    });
    
    const stats = {
      totalModels: models.length,
      totalClients: clients.length,
      totalUsers: users.length,
      storageUsed: (totalSize / (1024 * 1024 * 1024)).toFixed(2) + ' GB',
      storageBytes: totalSize,
      totalViews: models.reduce((sum, model) => sum + (model.views || 0), 0),
      recentActivity: recentLogs.length,
      errorCount: logs.filter(log => log.severity === 'error').length,
      warningCount: logs.filter(log => log.severity === 'warning').length
    };
    
    return c.json({ stats });
    
  } catch (error) {
    console.error('Stats fetch error:', error);
    return c.json({ error: 'Failed to fetch stats' }, 500);
  }
});

// Error handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// IoT API Endpoints

// Get all sensors
app.get('/api/iot/sensors', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const iotService = getIoTService();
    const sensors = iotService.getAllSensors();

    return c.json({ sensors });

  } catch (error) {
    console.error('IoT sensors fetch error:', error);
    return c.json({ error: 'Failed to fetch sensors' }, 500);
  }
});

// Get all devices
app.get('/api/iot/devices', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const iotService = getIoTService();
    const devices = iotService.getAllDevices();

    return c.json({ devices });

  } catch (error) {
    console.error('IoT devices fetch error:', error);
    return c.json({ error: 'Failed to fetch devices' }, 500);
  }
});

// Get sensor value
app.get('/api/iot/sensors/:sensorId', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const sensorId = c.req.param('sensorId');
    const iotService = getIoTService();
    const value = iotService.getSensorValue(sensorId);

    if (value === null) {
      return c.json({ error: 'Sensor not found' }, 404);
    }

    return c.json({ sensorId, value });

  } catch (error) {
    console.error('IoT sensor value fetch error:', error);
    return c.json({ error: 'Failed to fetch sensor value' }, 500);
  }
});

// Control device
app.post('/api/iot/devices/:deviceId/control', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const deviceId = c.req.param('deviceId');
    const { command } = await c.req.json();

    if (!['on', 'off', 'toggle'].includes(command)) {
      return c.json({ error: 'Invalid command' }, 400);
    }

    const iotService = getIoTService();
    const success = await iotService.controlDevice(deviceId, command);

    if (!success) {
      return c.json({ error: 'Failed to control device' }, 400);
    }

    return c.json({ message: 'Device controlled successfully', deviceId, command });

  } catch (error) {
    console.error('IoT device control error:', error);
    return c.json({ error: 'Failed to control device' }, 500);
  }
});

// Get energy history
app.get('/api/iot/energy-history', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const hours = parseInt(c.req.query('hours') || '24');
    const iotService = getIoTService();
    const history = iotService.getEnergyHistory(hours);

    return c.json({ history });

  } catch (error) {
    console.error('IoT energy history fetch error:', error);
    return c.json({ error: 'Failed to fetch energy history' }, 500);
  }
});

// Get sensor alerts
app.get('/api/iot/alerts', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const iotService = getIoTService();
    const alerts = iotService.getSensorAlerts();

    return c.json({ alerts });

  } catch (error) {
    console.error('IoT alerts fetch error:', error);
    return c.json({ error: 'Failed to fetch alerts' }, 500);
  }
});

// Get simulation status
app.get('/api/iot/simulation/status', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const iotService = getIoTService();
    const status = iotService.getSimulationStatus();

    return c.json({ status });

  } catch (error) {
    console.error('IoT simulation status fetch error:', error);
    return c.json({ error: 'Failed to fetch simulation status' }, 500);
  }
});

// Start simulation
app.post('/api/iot/simulation/start', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const iotService = getIoTService();
    iotService.startSimulation();

    return c.json({ message: 'IoT simulation started' });

  } catch (error) {
    console.error('IoT simulation start error:', error);
    return c.json({ error: 'Failed to start simulation' }, 500);
  }
});

// Stop simulation
app.post('/api/iot/simulation/stop', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const iotService = getIoTService();
    iotService.stopSimulation();

    return c.json({ message: 'IoT simulation stopped' });

  } catch (error) {
    console.error('IoT simulation stop error:', error);
    return c.json({ error: 'Failed to stop simulation' }, 500);
  }
});

// Update simulation config
app.put('/api/iot/simulation/config', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const config = await c.req.json();
    const iotService = getIoTService();
    iotService.updateSimulationConfig(config);

    return c.json({ message: 'Simulation config updated' });

  } catch (error) {
    console.error('IoT simulation config update error:', error);
    return c.json({ error: 'Failed to update simulation config' }, 500);
  }
});

// Export IoT data
app.get('/api/iot/export', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const iotService = getIoTService();
    const data = iotService.exportIoTData();

    return c.json({ data });

  } catch (error) {
    console.error('IoT data export error:', error);
    return c.json({ error: 'Failed to export IoT data' }, 500);
  }
});

// Simulate environmental conditions
app.post('/api/iot/environment/simulate', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const iotService = getIoTService();
    const conditions = await iotService.simulateEnvironmentalConditions();

    return c.json({ conditions });

  } catch (error) {
    console.error('IoT environmental simulation error:', error);
    return c.json({ error: 'Failed to simulate environmental conditions' }, 500);
  }
});

// Create automation rule
app.post('/api/iot/automation/rules', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const { trigger, action } = await c.req.json();
    const iotService = getIoTService();
    const ruleId = await iotService.createAutomationRule(trigger, action);

    return c.json({ message: 'Automation rule created', ruleId });

  } catch (error) {
    console.error('IoT automation rule creation error:', error);
    return c.json({ error: 'Failed to create automation rule' }, 500);
  }
});

// Execute automation rule
app.post('/api/iot/automation/rules/:ruleId/execute', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const ruleId = c.req.param('ruleId');
    const iotService = getIoTService();
    const success = await iotService.executeAutomationRule(ruleId);

    if (!success) {
      return c.json({ error: 'Rule not found or execution failed' }, 404);
    }

    return c.json({ message: 'Automation rule executed successfully' });

  } catch (error) {
    console.error('IoT automation rule execution error:', error);
    return c.json({ error: 'Failed to execute automation rule' }, 500);
  }
});

// Energy optimization
app.get('/api/iot/energy/optimize', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const iotService = getIoTService();
    const optimization = await iotService.optimizeEnergyUsage();

    return c.json({ optimization });

  } catch (error) {
    console.error('IoT energy optimization error:', error);
    return c.json({ error: 'Failed to optimize energy usage' }, 500);
  }
});

// Predictive maintenance
app.get('/api/iot/maintenance/predict', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const iotService = getIoTService();
    const predictions = await iotService.predictMaintenanceNeeds();

    return c.json({ predictions });

  } catch (error) {
    console.error('IoT predictive maintenance error:', error);
    return c.json({ error: 'Failed to predict maintenance needs' }, 500);
  }
});

// Create smart schedule
app.post('/api/iot/schedules', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const { deviceId, schedule } = await c.req.json();
    const iotService = getIoTService();
    const success = await iotService.createSmartSchedule(deviceId, schedule);

    if (!success) {
      return c.json({ error: 'Failed to create smart schedule' }, 400);
    }

    return c.json({ message: 'Smart schedule created successfully' });

  } catch (error) {
    console.error('IoT smart schedule creation error:', error);
    return c.json({ error: 'Failed to create smart schedule' }, 500);
  }
});

// Environmental impact analysis
app.get('/api/iot/environment/impact', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const iotService = getIoTService();
    const impact = await iotService.calculateEnvironmentalImpact();

    return c.json({ impact });

  } catch (error) {
    console.error('IoT environmental impact analysis error:', error);
    return c.json({ error: 'Failed to calculate environmental impact' }, 500);
  }
});

// Add custom sensor
app.post('/api/iot/sensors', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const sensor = await c.req.json();
    const iotService = getIoTService();
    iotService.addSensor(sensor);

    return c.json({ message: 'Sensor added successfully' });

  } catch (error) {
    console.error('IoT sensor addition error:', error);
    return c.json({ error: 'Failed to add sensor' }, 500);
  }
});

// Add custom device
app.post('/api/iot/devices', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const device = await c.req.json();
    const iotService = getIoTService();
    iotService.addDevice(device);

    return c.json({ message: 'Device added successfully' });

  } catch (error) {
    console.error('IoT device addition error:', error);
    return c.json({ error: 'Failed to add device' }, 500);
  }
});

// Remove sensor
app.delete('/api/iot/sensors/:sensorId', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const sensorId = c.req.param('sensorId');
    const iotService = getIoTService();
    const success = iotService.removeSensor(sensorId);

    if (!success) {
      return c.json({ error: 'Sensor not found' }, 404);
    }

    return c.json({ message: 'Sensor removed successfully' });

  } catch (error) {
    console.error('IoT sensor removal error:', error);
    return c.json({ error: 'Failed to remove sensor' }, 500);
  }
});

// Remove device
app.delete('/api/iot/devices/:deviceId', async (c) => {
  const { error, user } = await verifyUser(c.req.raw);

  if (error) {
    return c.json({ error }, 401);
  }

  try {
    const deviceId = c.req.param('deviceId');
    const iotService = getIoTService();
    const success = iotService.removeDevice(deviceId);

    if (!success) {
      return c.json({ error: 'Device not found' }, 404);
    }

    return c.json({ message: 'Device removed successfully' });

  } catch (error) {
    console.error('IoT device removal error:', error);
    return c.json({ error: 'Failed to remove device' }, 500);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404);
});

Deno.serve(app.fetch);
