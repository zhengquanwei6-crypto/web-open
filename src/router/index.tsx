import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

import UserLayout from '../components/layout/UserLayout';
import AdminLayout from '../components/layout/AdminLayout';

import CharacterList from '../pages/user/CharacterList';
import CharacterDetail from '../pages/user/CharacterDetail';
import ChatPage from '../pages/user/ChatPage';
import Profile from '../pages/user/Profile';
import Settings from '../pages/user/Settings';

import Dashboard from '../pages/admin/Dashboard';
import AdminCharacterList from '../pages/admin/characters/CharacterList';
import CharacterCreate from '../pages/admin/characters/CharacterCreate';
import ModelConfig from '../pages/admin/ModelConfig';
import ComfyConfig from '../pages/admin/ComfyConfig';
import WorkflowList from '../pages/admin/workflows/WorkflowList';
import WorkflowUpload from '../pages/admin/workflows/WorkflowUpload';
import WorkflowDetail from '../pages/admin/workflows/WorkflowDetail';
import ResourceList from '../pages/admin/ResourceList';
import Prompts from '../pages/admin/Prompts';
import ChatLogs from '../pages/admin/ChatLogs';
import UsersList from '../pages/admin/UsersList';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <UserLayout />,
    children: [
      { index: true, element: <Navigate to="/characters" replace /> },
      { path: 'characters', element: <CharacterList /> },
      { path: 'characters/:id', element: <CharacterDetail /> },
      { path: 'profile', element: <Profile /> },
      { path: 'settings', element: <Settings /> },
    ]
  },
  {
    path: '/chat/:id',
    element: <ChatPage />
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'characters', element: <AdminCharacterList /> },
      { path: 'characters/create', element: <CharacterCreate /> },
      { path: 'models', element: <ModelConfig /> },
      { path: 'comfy', element: <ComfyConfig /> },
      { path: 'workflows', element: <WorkflowList /> },
      { path: 'workflows/upload', element: <WorkflowUpload /> },
      { path: 'workflows/:id', element: <WorkflowDetail /> },
      { path: 'resources', element: <ResourceList /> },
      { path: 'prompts', element: <Prompts /> },
      { path: 'chat-logs', element: <ChatLogs /> },
      { path: 'users', element: <UsersList /> },
    ]
  }
]);
